/**
 * game.js - 竞技专业版 (多维度过滤 + 无重复洗牌)
 */

let gamePool = [];      // 当前选中的题目池
let currentIndex = 0;   // 当前题目指针
let totalWeightedScore = 0; 
let currentPoem = null;
let score = 0;
let combo = 0;
let correctCount = 0;
let audio = new Audio();
let canClick = false;
let startTime = 0;
let activeTimeouts = [];

// --- 初始化与选歌逻辑 ---
const startBtn = document.getElementById('start-btn');
const colorCheckboxes = document.querySelectorAll('input[name="color-pick"]');
const kCheckboxes = document.querySelectorAll('input[name="k-pick"]');

/**
 * 核心筛选逻辑：获取颜色与长度的交集
 */
function updateCount() {
    const selectedColors = Array.from(colorCheckboxes).filter(i => i.checked).map(i => i.value);
    const selectedKLens = Array.from(kCheckboxes).filter(i => i.checked).map(i => parseInt(i.value));
    
    // 筛选符合所有条件的牌
    const pool = mainData.filter(p => {
        // 1. 颜色匹配
        if (!selectedColors.includes(p.color)) return false;
        
        // 2. 决句长度匹配 (从 map 获取实时长度)
        const fullKey = p.first_half + p.second_half;
        const kData = kimarijiMap.get(fullKey);
        if (!kData) return false;
        
        const len = kData.kimarijiFirstHalf.length;
        // 注意：HTML中 value=6 对应 6字决(大山札)
        return selectedKLens.includes(len);
    });

    const countEl = document.getElementById('selected-count');
    if (countEl) countEl.innerText = pool.length;
    return pool;
}

[...colorCheckboxes, ...kCheckboxes].forEach(box => {
    box.addEventListener('change', updateCount);
    
});

if (startBtn) {
    startBtn.addEventListener('click', () => {
        gamePool = updateCount();
        
        if (gamePool.length === 0) {
            alert("条件に合う札がありません。設定を変更してください。");
            return;
        }

        // 洗牌算法：打乱题目池顺序，确保不重复
        for (let i = gamePool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gamePool[i], gamePool[j]] = [gamePool[j], gamePool[i]];
        }

        document.body.className = 'battle-mode';
        resetGame();
        nextQuestion();
    });
}

function resetGame() {
    score = 0;
    combo = 0;
    currentIndex = 0; // 重置指针
    correctCount = 0;
    totalWeightedScore = 0;
    updateUI();
}

/**
 * 核心：文字逐字显示（严格对应 CSS 动画）
 */
function animateTextIn(text) {
    const container = document.getElementById('kami-no-ku');
    if (!container) return;
    
    container.innerHTML = '';
    activeTimeouts.forEach(clearTimeout);
    activeTimeouts = [];

    const chars = text.split('');
    let accumulatedDelay = 0;

    chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.innerText = char;
        container.appendChild(span);

        // 模拟竞技朗读节奏
        let delay = (i === 0) ? 600 : 300; 
        accumulatedDelay += delay;

        const timer = setTimeout(() => {
            span.classList.add('active');
        }, accumulatedDelay);
        activeTimeouts.push(timer);
    });
}

/**
 * 加载下一题
 */
function nextQuestion() {
    if (currentIndex >= gamePool.length) {
        showResults();
        return;
    }

    // 从打乱后的池子里按顺序取
    currentPoem = gamePool[currentIndex];

    const statusLabel = document.getElementById('status-label');
    const cardGrid = document.getElementById('card-grid');
    const timerBar = document.getElementById('timer-bar');
    
    if (statusLabel) {
        statusLabel.innerText = "詠み上げ中...";
        statusLabel.className = ''; 
    }
    if (cardGrid) cardGrid.classList.remove('locked');
    if (timerBar) timerBar.style.width = "100%";
    
    canClick = true; 

    renderOptions(currentPoem);

    const stdNum = String(currentPoem.standardNumber).padStart(3, '0');
    audio.src = `assets/audio/a${stdNum}.mp3`;
    
    audio.onplay = () => {
        startTime = Date.now();
        animateTextIn(currentPoem.first_half);
        requestAnimationFrame(updateTimer);
    };
    
    audio.play().catch(e => {
        startTime = Date.now();
        animateTextIn(currentPoem.first_half);
    });
}

/**
 * 渲染卡片选项 - 核心：保持你要求的特殊排版
 */
function renderOptions(correct) {
    const grid = document.getElementById('card-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // 生成 4 个不重复选项
    let options = [correct];
    while (options.length < 4) {
        let rand = mainData[Math.floor(Math.random() * mainData.length)];
        if (!options.find(o => o.standardNumber === rand.standardNumber)) {
            options.push(rand);
        }
    }
    options.sort(() => Math.random() - 0.5);

    options.forEach(poem => {
        const card = document.createElement('div');
        card.className = `karuta-card color-${poem.color}`;
        card.dataset.isCorrect = (poem.standardNumber === correct.standardNumber);
        
        const fullText = poem.second_half.replace(/[\s　]/g, "");

        // --- 核心排版逻辑：绝对不准动 ---
        if (poem.standardNumber === 21) {
            const p1 = fullText.substring(0, 5);
            const p2 = fullText.substring(5, 10);
            const p3 = fullText.substring(10);
            card.innerHTML = `${p1}\n${p2}\n<span style="letter-spacing: -0.06em !important; display: inline-block;">${p3}</span>`;
        } else {
            let lines = [];
            for (let i = 0; i < fullText.length; i += 5) {
                lines.push(fullText.substring(i, i + 5));
            }
            card.innerText = lines.map(line => line.length === 4 ? line + "\n" : line).join("\n");
        }
        // --- 排版逻辑结束 ---

        card.onclick = () => handleChoice(poem.standardNumber === correct.standardNumber, card);
        grid.appendChild(card);
    });
}

/**
 * 核心逻辑：处理选择与算分
 */
function handleChoice(isCorrect, cardElement) {
    if (!canClick) return;
    canClick = false;
    
    document.getElementById('card-grid').classList.add('locked');
    audio.pause();
    currentIndex++; // 移动到下一张牌

    const elapsed = (Date.now() - startTime) / 1000;
    const statusLabel = document.getElementById('status-label');

    if (isCorrect) {
        correctCount++;
        combo++;
        
        const fullKey = currentPoem.first_half + currentPoem.second_half;
        const kData = kimarijiMap.get(fullKey);
        const kLen = (kData ? kData.kimarijiFirstHalf.length : 1);
        
        // --- 竞技权重系统 ---
        // 1. 难度分 (大山札等长句具有极高基础分)
        let weight = 1.0; 
        if (kLen === 2) weight = 1.2;
        else if (kLen === 3) weight = 1.4;
        else if (kLen === 4) weight = 1.6;
        else if (kLen === 5) weight = 1.8;
        else if (kLen === 6) weight = 2.0; // 大山札是实力的象征

        // 2. 速度倍率
        let multiplier = 1.0;
        let sfx = 'correct.wav';
        if (elapsed < 3.0) { multiplier = 3.0; sfx = 'godspeed.wav'; statusLabel.innerText = "神速！"; statusLabel.className = 'status-godspeed'; }
        else if (elapsed < 6.5) { multiplier = 2.0; sfx = 'flash.wav'; statusLabel.innerText = "閃光！"; statusLabel.className = 'status-flash'; }
        else { statusLabel.innerText = "正解！"; statusLabel.className = 'status-correct'; }

        // 3. 连击增益 (Combo)
        const comboBonus = 1 + Math.min(combo * 0.01, 0.20);
        
        const point = Math.round((weight * multiplier) * comboBonus * 100);
        totalWeightedScore += point;
        score += point; 
        
        cardElement.classList.add('correct');
        new Audio(`assets/sounds/${sfx}`).play().catch(()=>{});
    } else {
        combo = 0;
        statusLabel.innerText = "お手つき！";
        statusLabel.className = 'status-wrong';
        cardElement.classList.add('wrong');
        const correctCard = document.querySelector('.karuta-card[data-is-correct="true"]');
        if (correctCard) correctCard.classList.add('highlight-answer');
        new Audio(`assets/sounds/wrong.wav`).play().catch(()=>{});
    }

    revealKimariji();
    updateUI();

    setTimeout(nextQuestion, 2000);
}

/**
 * 显示决意字（Kimariji）
 * 采用正则保护 HTML 标签，确保排版不乱
 */
function revealKimariji() {
    if (!currentPoem) return;
    activeTimeouts.forEach(clearTimeout);

    const fullKey = currentPoem.first_half + currentPoem.second_half;
    const kData = kimarijiMap.get(fullKey);
    if (!kData) return;

    // 1. 上句处理（这部分比较简单，直接替换即可）
    const kamiContainer = document.getElementById('kami-no-ku');
    if (kamiContainer) {
        const k1 = kData.kimarijiFirstHalf || "";
        const rest1 = currentPoem.first_half.substring(k1.length);
        kamiContainer.innerHTML = `<span class="active kimariji-display">${k1}</span><span class="active">${rest1}</span>`;
    }

    // 2. 下句卡片精确高亮（核心修复：只高亮前 N 个字，不误伤后面重复的字）
    const correctCard = document.querySelector('.karuta-card[data-is-correct="true"]');
    if (correctCard) {
        const k2 = kData.kimarijiSecondHalf || "";
        if (!k2) return;

        let k2Count = k2.length; // 需要高亮的字符总数
        let currentHTML = correctCard.innerHTML;
        let resultHTML = "";
        let foundCount = 0;

        // 状态机：遍历 HTML，只处理不在标签内的文字
        let inTag = false;
        for (let i = 0; i < currentHTML.length; i++) {
            let char = currentHTML[i];

            if (char === '<') {
                inTag = true;
                resultHTML += char;
            } else if (char === '>') {
                inTag = false;
                resultHTML += char;
            } else if (!inTag && foundCount < k2Count && /[^\n\s　]/.test(char)) {
                // 如果不在标签内，且还没达到决定字数量，且不是换行符/空格
                resultHTML += `<span class="card-kimariji">${char}</span>`;
                foundCount++;
            } else {
                // 剩下的字符（包括超出数量的重复字）原样返回
                resultHTML += char;
            }
        }
        correctCard.innerHTML = resultHTML;
    }
}

function updateUI() {
    const scoreEl = document.getElementById('score');
    const comboEl = document.getElementById('combo');
    if (scoreEl) scoreEl.innerText = score;
    if (comboEl) comboEl.innerText = combo;
}

function updateTimer() {
    if (audio.paused || audio.ended) return;
    const timerBar = document.getElementById('timer-bar');
    if (timerBar && audio.duration) {
        let progress = (audio.currentTime / audio.duration) * 100;
        timerBar.style.width = Math.max(0, 100 - progress) + "%";
    }
    requestAnimationFrame(updateTimer);
}

/**
 * 结算与段位判定
 */
function showResults() {
    document.body.className = 'result-mode';
    
    // 综合评价点 (PTS) = 总加权分 / 总挑战数
    // 无论选 10 题还是 100 题，只要平均表现好，PTS 就高
    const finalRating = Math.round(totalWeightedScore / gamePool.length);
    const accuracy = Math.round((correctCount / gamePool.length) * 100);
    
    document.getElementById('final-score').innerText = finalRating;
    
    // 段位名称
    let rank = "";
    if (finalRating >= 500) rank = "永世名人級 (S+)";
    else if (finalRating >= 400) rank = "閃光の達人 (A)";
    else if (finalRating >= 250) rank = "五段 (B)";
    else rank = "修行中 (C)";
    
    document.getElementById('result-rank').innerText = `段位：${rank}`;

    const shareText = generateShareText(finalRating, rank, accuracy, combo, gamePool.length);
    // 可在此处绑定点击分享按钮事件
}

function generateShareText(score, rank, acc, maxCombo, total) {
    // 校验位逻辑
    const vCode = ((score * 17) % 1000).toString(16).toUpperCase().padStart(3, '0');
    
    return `【閃光の試練】競技記録証明
--------------------------
総合評価点：${score} pts
段位：${rank}
正確度：${acc}% (${total}首中)
最大連撃：${maxCombo}
--------------------------
認証コード: ${vCode}
#競技かるた #閃光の試練 #五色百人一首
https://yourgame.link`;
}