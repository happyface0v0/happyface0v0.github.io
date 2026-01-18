/**
 * game.js - 竞技专业版 (多维度过滤 + 无重复洗牌)
 */

let gamePool = [];      // 当前选中的题目池
let currentIndex = 0;   // 当前题目指针
let totalWeightedScore = 0; 
let currentPoem = null;
let score = 0;
let combo = 0;
let maxCombo = 0;       // 确保定义了
let correctCount = 0;
let audio = new Audio();
let canClick = false;
let startTime = 0;
let totalTime = 0;      // 确保定义了
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
        statusLabel.innerText = "";
        // 不要用 className = ''，而是移除特定的特效类
        statusLabel.classList.remove('status-godspeed', 'status-flash', 'status-correct', 'status-wrong');
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
 * 渲染卡片选项 - 核心：嵌套循环缩减前缀，强行挖掘友札
 */
function renderOptions(correct) {
    const grid = document.getElementById('card-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // 1. 获取决句数据
    const fullKey = correct.first_half + correct.second_half;
    const kData = kimarijiMap.get(fullKey);
    const kLen = kData ? kData.kimarijiFirstHalf.length : 1;

    // 2. 初始截取长度判定
    let offset = (kLen >= 8) ? 2 : 1;
    let currentLen = Math.max(1, kLen - offset);
    
    let options = [correct];
    let usedIds = new Set([correct.standardNumber]);

    // 3. 嵌套循环：只要选项不够 4 个，且前缀长度还没减到 0，就继续搜
    while (options.length < 4 && currentLen > 0) {
        const prefix = correct.second_half.substring(0, currentLen);
        
        // 筛选当前前缀下的新朋友
        let friends = mainData.filter(p => 
            !usedIds.has(p.standardNumber) && 
            p.second_half.startsWith(prefix)
        );

        // 将搜到的朋友随机加入选项
        while (friends.length > 0 && options.length < 4) {
            const randomIndex = Math.floor(Math.random() * friends.length);
            const picked = friends.splice(randomIndex, 1)[0];
            options.push(picked);
            usedIds.add(picked.standardNumber);
        }

        // 缩减长度，准备下一轮更宽泛的搜索
        currentLen--;
    }

    // 4. 如果搜干了前缀还是不够 4 个（极端情况），用纯随机补齐
    while (options.length < 4) {
        let rand = mainData[Math.floor(Math.random() * mainData.length)];
        if (!usedIds.has(rand.standardNumber)) {
            options.push(rand);
            usedIds.add(rand.standardNumber);
        }
    }

    // 5. 洗牌与渲染 (保持原有的特殊排版逻辑)
    options.sort(() => Math.random() - 0.5);

    options.forEach(poem => {
        const card = document.createElement('div');
        card.className = `karuta-card color-${poem.color}`;
        card.dataset.isCorrect = (poem.standardNumber === correct.standardNumber);
        
        const fullText = poem.second_half.replace(/[\s　]/g, "");

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
    currentIndex++;

    const elapsed = (Date.now() - startTime) / 1000;
    totalTime += elapsed; 

    const statusLabel = document.getElementById('status-label');

    if (isCorrect) {
        correctCount++;
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        
        // --- 核心：计算这一题的得分 ---
        const fullKey = currentPoem.first_half + currentPoem.second_half;
        const kData = kimarijiMap.get(fullKey);
        const kLen = (kData ? kData.kimarijiFirstHalf.length : 1);
        
        // 1. 难度权重 (决句越短/越难 分数越高)
        let weight = 1.0; 
        if (kLen === 1) weight = 2.0; // 一字决最难
        else if (kLen === 2) weight = 1.8;
        else if (kLen === 3) weight = 1.6;
        else if (kLen === 6 || kLen === 7) weight = 1.2; // 大山札虽长但易辨认，权重设为1.2

        // 强制浏览器重绘（可选，确保第二次连续答对动画依然触发）
        void statusLabel.offsetWidth;

        // 2. 速度倍率
        let multiplier = 1.0;
        let sfx = 'correct.wav';
        if (elapsed < 2.5) { multiplier = 3.0; sfx = 'godspeed.wav'; statusLabel.innerText = "神速！"; statusLabel.classList.add('status-godspeed'); }
        else if (elapsed < 5.0) { multiplier = 2.0; sfx = 'flash.wav'; statusLabel.innerText = "閃光！"; statusLabel.classList.add('status-flash'); }
        else { statusLabel.innerText = "正解！"; statusLabel.classList.add('status-correct'); }

        // 3. 连击增益
        const comboBonus = 1 + Math.min(combo * 0.02, 0.50); // 每连击+2%，最高+50%
        
        // 计算本题分数并累加到全局 score
        const thisPoint = Math.round((100 * weight * multiplier) * comboBonus);
        score += thisPoint; 
        
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
    updateUI(); // 实时更新界面上的 Score

    setTimeout(nextQuestion, 2000);
}

/**
 * 优化后的显示决意字（Kimariji）
 * 采用文本节点替换法，绝对不破坏 HTML 标签结构和换行排版
 */
function revealKimariji() {
    if (!currentPoem) return;
    activeTimeouts.forEach(clearTimeout);

    const fullKey = currentPoem.first_half + currentPoem.second_half;
    const kData = kimarijiMap.get(fullKey);
    if (!kData) return;

    // 1. 上句处理 (保持不变)
    const kamiContainer = document.getElementById('kami-no-ku');
    if (kamiContainer) {
        const k1 = kData.kimarijiFirstHalf || "";
        const rest1 = currentPoem.first_half.substring(k1.length);
        kamiContainer.innerHTML = `<span class="active kimariji-display">${k1}</span><span class="active">${rest1}</span>`;
    }

    // 2. 下句卡片高亮 (采用 TextNode 精准覆盖)
    const correctCard = document.querySelector('.karuta-card[data-is-correct="true"]');
    if (!correctCard) return;

    const k2 = kData.kimarijiSecondHalf || "";
    if (!k2) return;

    let k2Chars = k2.split(''); // 待匹配的决定字数组
    
    function walk(node) {
        if (k2Chars.length === 0) return;

        if (node.nodeType === 3) { // 文本节点
            let text = node.nodeValue;
            let fragment = document.createDocumentFragment();
            let changed = false;

            for (let char of text) {
                if (k2Chars.length > 0 && char === k2Chars[0]) {
                    let span = document.createElement('span');
                    span.className = 'card-kimariji';
                    span.style.color = 'var(--accent-color)'; // 双重保险
                    span.style.fontWeight = 'bold';
                    span.textContent = char;
                    fragment.appendChild(span);
                    k2Chars.shift();
                    changed = true;
                } else {
                    fragment.appendChild(document.createTextNode(char));
                }
            }

            if (changed) {
                node.parentNode.replaceChild(fragment, node);
            }
        } else {
            // 继续遍历子节点
            let children = Array.from(node.childNodes);
            children.forEach(walk);
        }
    }

    walk(correctCard);
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
 * 结算与全维度数据判定
 */
function showResults() {
    document.body.className = 'result-mode';

    const total = gamePool.length;
    if (!total || total === 0) return;

    const accuracy = ((correctCount / total) * 100).toFixed(1);
    const avgSpeed = (totalTime / total).toFixed(2);
    
    // 最终分数直接等于游戏里实时显示的 score
    const finalRating = score; 

    setResultValue('res-total-count', total);
    setResultValue('res-correct-count', correctCount);
    setResultValue('res-accuracy', accuracy + '%');
    setResultValue('res-max-combo', maxCombo);
    setResultValue('res-avg-speed', avgSpeed + 's');
    
    // 更新证书大字
    const scoreEl = document.getElementById('final-score');
    if (scoreEl) {
        scoreEl.innerText = finalRating.toLocaleString(); // 加上千分位，好看
    }

    // 段位判定 (基于总分)
    const rankInfo = getRankInfo(finalRating, total); 
    const rankEl = document.getElementById('result-rank');
    if (rankEl) {
        rankEl.innerText = rankInfo.name;
        rankEl.style.color = rankInfo.color;
    }

    const gradeEl = document.getElementById('result-grade');
    if (gradeEl) gradeEl.innerText = getGrade(parseFloat(accuracy));
}

/**
 * 辅助函数：安全填充 DOM
 */
function setResultValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

/**
 * 段位判定逻辑
 */
function getRankInfo(totalScore, totalQuestions) {
    const avgPerQuestion = totalScore / totalQuestions + totalQuestions * 0.5;

    // 假设满分评价（平均每题通过加权和神速能拿 400分以上）
    if (avgPerQuestion >= 600) return { name: "永世名人級", color: "#FFD700" };
    if (avgPerQuestion >= 300) return { name: "閃光の達人", color: "#FF4500" };
    if (avgPerQuestion >= 150) return { name: "有段者", color: "#1E90FF" };
    if (avgPerQuestion >= 80) return { name: "修行中", color: "#2ecc71" };
    return { name: "門下生", color: "#808080" };
}

/**
 * 基于正确率的评级
 */
function getGrade(acc) {
    if (acc >= 100) return "PERFECT";
    if (acc >= 95) return "S";
    if (acc >= 85) return "A";
    if (acc >= 70) return "B";
    return "C";
}

/**
 * 性能标签（趣味称号逻辑）
 */
function getPerformanceTag(acc, speed, maxCombo, total) {
    if (acc >= 100 && speed < 2.0) return "神速の精密機械";
    if (acc >= 100) return "完全制覇";
    if (speed < 1.5) return "閃光のリアクション";
    if (maxCombo >= total / 2 && maxCombo > 1) return "連撃の鬼";
    if (acc < 50 && speed < 2.0) return "猪突猛進";
    return "不撓不屈";
}

/**
 * 修正 resetGame：确保所有统计量归零
 */
function resetGame() {
    score = 0;
    combo = 0;
    maxCombo = 0;       // 必须重置
    currentIndex = 0;
    correctCount = 0;
    totalWeightedScore = 0;
    totalTime = 0;      // 必须重置
    updateUI();
}

document.addEventListener('DOMContentLoaded', () => {
    // 获取需要动画的元素
    const logo = document.querySelector('.logo');
    const subtitle = document.querySelector('.subtitle');
    const settings = document.querySelector('.deck-settings');
    const info = document.querySelector('.deck-info');
    const btn = document.querySelector('#start-btn');

    // 设定一个简单的延迟序列，营造“依次跳出”的效果
    setTimeout(() => {
        if(logo) logo.classList.add('animate-in');
    }, 100);

    setTimeout(() => {
        if(subtitle) subtitle.classList.add('animate-in');
    }, 300);

    setTimeout(() => {
        if(settings) settings.classList.add('animate-in');
    }, 500);

    setTimeout(() => {
        if(info) info.classList.add('animate-in');
    }, 700);

    setTimeout(() => {
        if(btn) btn.classList.add('animate-pop'); // 按钮用缩放效果，更醒目
    }, 900);
});

/* ============================================================
   统一载入控制 (替换原有末尾冲突代码)
   ============================================================ */
window.addEventListener('load', () => {
    // 1. 清除可能导致干扰的旧类名，确保环境干净
    document.body.classList.remove('battle-mode', 'result-mode');
    
    // 2. 触发 setup-mode。
    // 只要 body 加上这个类，CSS 中定义的“body.setup-mode .logo”等动画就会自动依次播放
    setTimeout(() => {
        document.body.classList.add('setup-mode');
    }, 100);
});

// 确保计数器在页面一打开时就是准确的
updateCount();

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'share-btn') {
        generateShareText();
    }
});

function generateShareText() {
    const finalScore = document.getElementById('final-score').innerText;
    const rank = document.getElementById('result-rank').innerText;
    const grade = document.getElementById('result-grade').innerText;
    const speed = document.getElementById('res-avg-speed').innerText;
    const gameUrl = window.location.href;

    // 精简版文案
    const shareTemplate = `
˚₊‧꒰  閃光の試練  ꒱‧₊˚
百人一首 競技記録
------------------
段位：${rank}
評価：[ ${grade} ]
得点：${finalScore} pts
平均反応：${speed}
------------------
${gameUrl}
`.trim();

    // 复制到剪贴板
    navigator.clipboard.writeText(shareTemplate).then(() => {
        const btn = document.getElementById('share-btn');
        btn.innerText = "コピー成功！";
        setTimeout(() => { btn.innerText = "結果をシェア"; btn.style.background = ""; }, 2000);
    });
}