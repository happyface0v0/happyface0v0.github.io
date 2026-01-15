/**
 * game.js - 竞技平衡版
 */

let gamePool = [];      // 过滤后的题库
let questionCount = 0;  // 已挑战题数
let totalWeightedScore = 0; // 累计加权总分
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
const checkboxes = document.querySelectorAll('input[name="color-pick"]');

// 更新显示选中的题目数量
function updateCount() {
    const selectedColors = Array.from(checkboxes).filter(i => i.checked).map(i => i.value);
    const count = mainData.filter(p => selectedColors.includes(p.color)).length;
    document.getElementById('selected-count').innerText = count;
}
checkboxes.forEach(box => box.addEventListener('change', updateCount));

if (startBtn) {
    startBtn.addEventListener('click', () => {
        const selectedColors = Array.from(checkboxes).filter(i => i.checked).map(i => i.value);
        gamePool = mainData.filter(p => selectedColors.includes(p.color));
        
        if (gamePool.length === 0) {
            alert("札を少なくとも一色選んでください。");
            return;
        }

        document.body.className = 'battle-mode';
        resetGame();
        nextQuestion();
    });
}

function resetGame() {
    score = 0;
    combo = 0;
    questionCount = 0;
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
    // 1. 随机选题 (修正了原代码中写死的 [86])
    const randIdx = Math.floor(Math.random() * mainData.length);
    currentPoem = mainData[randIdx];

    // 2. UI 状态重置
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

    // 3. 渲染选项
    renderOptions(currentPoem);

    // 4. 音频处理
    const stdNum = String(currentPoem.standardNumber).padStart(3, '0');
    audio.src = `assets/audio/a${stdNum}.mp3`;
    
    audio.onplay = () => {
        startTime = Date.now();
        animateTextIn(currentPoem.first_half);
        requestAnimationFrame(updateTimer);
    };
    
    // 自动播放处理
    let playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(e => {
            console.warn("等待用户交互后播放音频");
            // 降级处理：即使音频不响，也要让游戏继续
            startTime = Date.now();
            animateTextIn(currentPoem.first_half);
        });
    }
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
    questionCount++;

    const elapsed = (Date.now() - startTime) / 1000;
    const statusLabel = document.getElementById('status-label');

    if (isCorrect) {
        correctCount++;
        combo++;
        
        // 1. 决定字长度加权 (根据你的数据结构取长度)
        const fullKey = currentPoem.first_half + currentPoem.second_half;
        const kData = kimarijiMap.get(fullKey);
        const kLen = (kData ? kData.kimarijiFirstHalf.length : 1);
        
        // 平衡系数：字数越多，大脑检索负担越重，分数越高
        let weight = 1.0; 
        if (kLen === 2) weight = 1.2;
        else if (kLen === 3) weight = 1.4;
        else if (kLen >= 4) weight = 1.7; // 4-6字决属于高级难度

        // 2. 速度倍率 (神速/闪光/正解)
        let multiplier = 1.0;
        let sfx = 'correct.wav';
        if (elapsed < 3.0) {
            multiplier = 3.0; // 神速 3 倍
            sfx = 'godspeed.wav';
            statusLabel.innerText = "神速！";
            statusLabel.className = 'status-godspeed';
        } else if (elapsed < 6.5) {
            multiplier = 2.0; // 闪光 2 倍
            sfx = 'flash.wav';
            statusLabel.innerText = "閃光！";
            statusLabel.className = 'status-flash';
        } else {
            statusLabel.innerText = "正解！";
            statusLabel.className = 'status-correct';
        }

        // 3. 连击加成：每增加 1 Combo，提供 1% 的微小增益，上限 20%
        const comboBonus = 1 + Math.min(combo * 0.01, 0.20);
        
        // 计算评价点
        const point = Math.round((weight * multiplier) * comboBonus * 100);
        totalWeightedScore += point;
        score += point; // 这里的 score 用于页面顶部的实时动画展示
        
        cardElement.classList.add('correct');
        new Audio(`assets/sounds/${sfx}`).play().catch(()=>{});
    } else {
        // 错误惩罚：连击中断，该题得分为 0
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

    if (questionCount >= gamePool.length) {
        setTimeout(showResults, 2000);
    } else {
        setTimeout(nextQuestion, 2000);
    }
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
    
    // 综合评价点 = 总权重点 / 总题数
    const finalRating = Math.round(totalWeightedScore / questionCount);
    const accuracy = Math.round((correctCount / questionCount) * 100);
    
    document.getElementById('final-score').innerText = finalRating;
    
    let rank = "";
    if (finalRating >= 450) rank = "閃光の鬼神 (S+)";
    else if (finalRating >= 350) rank = "疾風の達人 (A)";
    else if (finalRating >= 200) rank = "修行中の身 (B)";
    else rank = "駆け出し (C)";
    
    document.getElementById('result-rank').innerText = `段位：${rank}`;

    // 生成分享文本
    const shareText = generateShareText(finalRating, rank, accuracy, combo);
    
    // 你可以在结果页面加个按钮调用下面的 copyToClipboard(shareText)
}

function generateShareText(score, rank, acc, maxCombo) {
    // 简易校验码 (Hash)，防止小白改分
    const checkCode = btoa(`${score}|${acc}`).substring(0, 8);
    
        return `【閃光の試練】戦績証明書
                総合評価点：${score} pts
                ランク：${rank}
                正解率：${acc}% / 最大コンボ：${maxCombo}
                #競技かるた #閃光の試练 #五色百人一首
                認証コード: ${checkCode}
                https://yourgame.link`;
}