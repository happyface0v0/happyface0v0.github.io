/**
 * game.js - 纯净对战版
 * 适配仅有 battle-screen 的 HTML 结构
 */

// --- 游戏状态变量 ---
let gamePool = [];      // 题目池
let currentIndex = 0;   // 当前题目指针
let currentPoem = null; // 当前题目对象
let score = 0;
let combo = 0;
let maxCombo = 0;
let correctCount = 0;
let audio = new Audio();
let canClick = false;
let startTime = 0;
let totalTime = 0;
let activeTimeouts = [];

// --- 判定阈值配置 ---
const JUDGE_CONFIG = {
    SYLLABLE_TIME: 0.3,       // 每个音节耗时
    BASE_REACTION: 1.25,       // 基础反应宽限期
    FLASH_WINDOW: 3.0,        // 闪光评价的额外窗口时间
    FAIL_LIMIT: 10.0          // 10秒强制线
};

// 页面加载完成后立即初始化
window.addEventListener('load', () => {
    initGame();
});

// --- 修改后的初始化逻辑 ---

function initGame() {
    if (typeof mainData === 'undefined' || mainData.length === 0) {
        console.error("数据加载失败: data.js 未正确加载");
        return;
    }

    // --- 新增：刷新校验逻辑 ---
    // 检查是否有合法的“入场券”
    const entryTicket = sessionStorage.getItem('trial_active');
    
    if (!entryTicket) {
        // 如果没有券（说明是直接刷新或手动输入地址），跳回首页
        window.location.href = 'index.html';
        return;
    }
    // 立即销毁凭证：确保下一次刷新时凭证已失效
    sessionStorage.removeItem('trial_active');

    // 1. 获取配置
    const savedConfig = sessionStorage.getItem('trial_config');
    let poolIds = [];
    let isAudioOnly = false;
    let isInverted = false;

    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        poolIds = config.poolIds || [];
        isAudioOnly = config.audioOnly || false;
        isInverted = config.invertedView || false;
    }

    // 2. 根据 ID 池过滤题目
    if (poolIds.length > 0) {
        // 仅包含用户在选择页面筛选出的 ID
        gamePool = mainData.filter(p => poolIds.includes(p.standardNumber));
    } else {
        // 如果没有 ID 池（预防意外），则使用全部
        gamePool = [...mainData];
    }

    // 3. 获取遮罩元素
    const intro = document.getElementById('intro-overlay');
    
    // 4. 动画结束后自动移除
    if (intro) {
        setTimeout(() => {
            intro.classList.add('intro-hidden');
            // 动画彻底结束后从 DOM 移除，节省性能
            setTimeout(() => intro.remove(), 1000);
        }, 2500); // 对应动画 logoReveal 的时间
    }

    // 5. 核心修改：让第一题稍微等一下再开始
    // 这样不会出现“遮罩还在黑屏，声音就开始读”的情况
    setTimeout(() => {
        applySpecialModes(isAudioOnly, isInverted);
        shufflePool(gamePool);
        resetGame();
        nextQuestion();
    }, 2500); // 在 Logo 亮起之后开始读题
}

/**
 * 处理“仅音频”和“倒置视角”模式
 */
function applySpecialModes(audioOnly, inverted) {
    const body = document.body;
    
    // 调试用：看看 sessionStorage 到底给了什么
    console.log("模式检查:", { audioOnly, inverted });

    if (audioOnly) {
        const kami = document.getElementById('kami-no-ku');
        if (kami) kami.style.display = 'none';
    }

    // 重点：强制转换为布尔值判断
    const shouldInvert = String(inverted) === 'true';

    if (shouldInvert) {
        body.classList.add('inverted-view');
        console.log("已成功添加 inverted-view 类名");
    } else {
        body.classList.remove('inverted-view');
    }
}

function shufflePool(pool) {
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
}

function resetGame() {
    score = 0;
    combo = 0;
    maxCombo = 0;
    currentIndex = 0;
    correctCount = 0;
    totalTime = 0;
    updateUI();
}

// --- 核心游戏流程 ---

/**
 * 加载下一题
 */
function nextQuestion() {
    // 游戏结束判定
    if (currentIndex >= gamePool.length) {
        handleGameOver();
        return;
    }

    currentPoem = gamePool[currentIndex];

    const statusLabel = document.getElementById('status-label');
    const cardGrid = document.getElementById('card-grid');
    const timerBar = document.getElementById('timer-bar');
    
    // 重置界面状态
    if (statusLabel) {
        statusLabel.innerText = "";
        statusLabel.classList.remove('status-godspeed', 'status-flash', 'status-correct', 'status-wrong');
    }
    if (cardGrid) cardGrid.classList.remove('locked');
    if (timerBar) timerBar.style.width = "100%";
    
    canClick = true; 

    // 渲染卡片
    renderOptions(currentPoem);

    // 播放音频与文字动画
    const stdNum = String(currentPoem.standardNumber).padStart(3, '0');
    audio.src = `assets/audio/a${stdNum}.mp3`;
    
    // 音频播放回调
    const playHandler = () => {
        startTime = Date.now();
        animateTextIn(currentPoem.first_half);
        requestAnimationFrame(updateTimer);
    };

    audio.onplay = playHandler;
    
    // 尝试播放 (处理浏览器自动播放策略)
    audio.play().catch(e => {
        console.warn("自动播放被拦截，显示全屏解锁层");

        // 1. 创建全屏遮罩
        const overlay = document.createElement('div');
        overlay.id = 'audio-unlock-overlay';
        
        // 2. 样式（确保盖住一切）
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: '#1a1a1a', zIndex: '10000',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            color: 'white', cursor: 'pointer', textAlign: 'center'
        });

        // 3. 内容
        overlay.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">🔈</div>
            <div style="font-size: 1.5rem; font-weight: bold;">タップして開始</div>
            <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.7;">(音声再生を許可してください)</div>
        `;

        // 4. 点击解锁逻辑
        overlay.onclick = () => {
            audio.play().then(() => {
                // 只有成功出声了，才移除遮罩并开始动画
                overlay.remove();
                playHandler(); 
            }).catch(err => {
                console.error("解锁失败:", err);
            });
        };

        document.body.appendChild(overlay);
    });
}

/**
 * 渲染卡片选项 - 核心：挖掘友札逻辑
 */
function renderOptions(correct) {
    const grid = document.getElementById('card-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // 获取决句长度
    const fullKey = correct.first_half + correct.second_half;
    const kData = kimarijiMap.get(fullKey); // 依赖 data.js 中的 kimarijiMap
    const kLen = kData ? kData.kimarijiFirstHalf.length : 1;

    // 寻找混淆项逻辑
    let offset = (kLen >= 8) ? 2 : 1;
    let currentLen = Math.max(1, kLen - offset);
    
    let options = [correct];
    let usedIds = new Set([correct.standardNumber]);

    // 尝试寻找前缀相似的“友札”
    while (options.length < 4 && currentLen > 0) {
        const prefix = correct.second_half.substring(0, currentLen);
        
        let friends = mainData.filter(p => 
            !usedIds.has(p.standardNumber) && 
            p.second_half.startsWith(prefix)
        );

        while (friends.length > 0 && options.length < 4) {
            const randomIndex = Math.floor(Math.random() * friends.length);
            const picked = friends.splice(randomIndex, 1)[0];
            options.push(picked);
            usedIds.add(picked.standardNumber);
        }
        currentLen--;
    }

    // 如果还不够4张，随机补齐
    while (options.length < 4) {
        let rand = mainData[Math.floor(Math.random() * mainData.length)];
        if (!usedIds.has(rand.standardNumber)) {
            options.push(rand);
            usedIds.add(rand.standardNumber);
        }
    }

    // 选项洗牌
    options.sort(() => Math.random() - 0.5);

    // 生成 DOM
    options.forEach(poem => {
        const card = document.createElement('div');
        card.className = `karuta-card color-${poem.color}`;
        card.dataset.isCorrect = (poem.standardNumber === correct.standardNumber);
        
        // 关键：创建一个文字包装层
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'card-text-wrapper'; // 给它一个类名

        const fullText = poem.second_half.replace(/[\s　]/g, "");

        if (poem.standardNumber === 21) {
            const p1 = fullText.substring(0, 5);
            const p2 = fullText.substring(5, 10);
            const p3 = fullText.substring(10);
            // 注意这里赋值给 contentWrapper
            contentWrapper.innerHTML = `${p1}\n${p2}\n<div style="display: contents; letter-spacing: -0.10em;">${p3}</div>`;
        } else {
            let lines = [];
            for (let i = 0; i < fullText.length; i += 5) {
                lines.push(fullText.substring(i, i + 5));
            }
            // 注意这里赋值给 contentWrapper
            contentWrapper.innerText = lines.map(line => line.length === 4 ? line + "\n" : line).join("\n");
        }

        card.appendChild(contentWrapper); // 先把文字塞进包装层，再塞进卡片
        card.onclick = () => handleChoice(poem.standardNumber === correct.standardNumber, card);
        grid.appendChild(card);
    });
}

/**
 * 处理玩家点击
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
    statusLabel.className = ''; // 重置样式
    void statusLabel.offsetWidth; // 强制重绘

    if (isCorrect) {
        correctCount++;
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        
        // 1. 基础参数与难度权重 (长牌高分)
        const fullKey = currentPoem.first_half + currentPoem.second_half;
        const kData = kimarijiMap.get(fullKey);
        const kLen = (kData ? kData.kimarijiFirstHalf.length : 1);
        const difficultyWeight = 0.8 + (kLen * 0.2); 

        // 2. 动态阈值设定
        const godspeedThreshold = (kLen * JUDGE_CONFIG.SYLLABLE_TIME) + JUDGE_CONFIG.BASE_REACTION;
        const flashThreshold = godspeedThreshold + JUDGE_CONFIG.FLASH_WINDOW;
        const failThreshold = JUDGE_CONFIG.FAIL_LIMIT;

        let multiplier = 1.0;
        let sfx = 'correct.wav';

        // 3. 四个等级判定
        if (elapsed < godspeedThreshold) { 
            multiplier = 3.5;
            sfx = 'godspeed.wav'; 
            statusLabel.innerText = "神速！"; 
            statusLabel.classList.add('status-godspeed'); 
        } else if (elapsed < flashThreshold) { 
            multiplier = 2.0; 
            sfx = 'flash.wav'; 
            statusLabel.innerText = "閃光！"; 
            statusLabel.classList.add('status-flash'); 
        } else if (elapsed < failThreshold) {
            multiplier = 1.0; 
            sfx = 'correct.wav'; 
            statusLabel.innerText = "正解！"; 
            statusLabel.classList.add('status-correct'); 
        } else {
            // 第四等级：太慢了，虽然选对了但不给倍率，评价为“緩慢”
            multiplier = 0.5; // 只有一半分数，甚至可以给 0
            sfx = 'slow.wav'; 
            statusLabel.innerText = "遅すぎ！"; 
            statusLabel.classList.add('status-slow'); // 需要在 CSS 增加这个类
        }

        // 4. 分数计算
        const comboBonus = 1 + (combo * 0.05); 
        const thisPoint = Math.round((100 * difficultyWeight * multiplier) * comboBonus);
        score += thisPoint; 
        
        cardElement.classList.add('correct');
        new Audio(`assets/sounds/${sfx}`).play().catch(()=>{});

    } else {
        // お手つき逻辑维持不变
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

// --- 辅助视觉逻辑 ---

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

        let delay = (i === 0) ? 600 : 300; 
        accumulatedDelay += delay;

        const timer = setTimeout(() => {
            span.classList.add('active');
        }, accumulatedDelay);
        activeTimeouts.push(timer);
    });
}

/**
 * 核心逻辑：显示决意字（Kimariji）
 * 修改点：匹配时自动跳过文本中的空格和换行符
 */
function revealKimariji() {
    if (!currentPoem) return;
    
    // 1. 瞬间完成上句动画
    const kamiContainer = document.getElementById('kami-no-ku');
    if (kamiContainer) {
        const spans = kamiContainer.querySelectorAll('span');
        spans.forEach(span => span.classList.add('active'));
    }

    activeTimeouts.forEach(clearTimeout);
    activeTimeouts = [];

    const fullKey = currentPoem.first_half + currentPoem.second_half;
    const kData = kimarijiMap.get(fullKey);
    if (!kData) return;

    function applyKimariji(container, kText, highlightClass) {
        if (!container) return;
        // 过滤掉决意字配置里可能存在的空格，确保匹配队列纯净
        let chars = kText.replace(/[\s　]/g, "").split('');
        
        function walk(node) {
            if (chars.length === 0) return;
            
            if (node.nodeType === 3) { // 文本节点
                const text = node.nodeValue;
                const fragment = document.createDocumentFragment();
                let hasChanged = false;

                for (let char of text) {
                    // 如果当前文本字符是空格或换行
                    if (/[\s　\n\r]/.test(char)) {
                        fragment.appendChild(document.createTextNode(char));
                        // 注意：这里不消耗 chars 队列，直接进入下一个循环
                        continue; 
                    }

                    // 如果当前字符匹配决意字队列的首字
                    if (chars.length > 0 && char === chars[0]) {
                        const span = document.createElement('span');
                        span.className = highlightClass;
                        span.textContent = char;
                        fragment.appendChild(span);
                        
                        chars.shift(); // 匹配成功，弹出队列
                        hasChanged = true;
                    } else {
                        // 字符不匹配且不是空格，直接保留原样
                        fragment.appendChild(document.createTextNode(char));
                    }
                }
                
                if (hasChanged) {
                    node.parentNode.replaceChild(fragment, node);
                }
            } else {
                // 递归处理子节点，跳过已经高亮过的节点
                if (node.className !== highlightClass) {
                    Array.from(node.childNodes).forEach(walk);
                }
            }
        }
        walk(container);
    }

    // 处理上句和下句
    const k1 = kData.kimarijiFirstHalf || "";
    if (k1 && kamiContainer) applyKimariji(kamiContainer, k1, 'kimariji-display');

    const k2 = kData.kimarijiSecondHalf || "";
    const correctCard = document.querySelector('.karuta-card[data-is-correct="true"]');
    if (k2 && correctCard) applyKimariji(correctCard, k2, 'card-kimariji');
}

function updateUI() {
    const scoreEl = document.getElementById('score');
    const comboEl = document.getElementById('combo');
    if (scoreEl) scoreEl.innerText = score;
    if (comboEl) comboEl.innerText = combo;
}

function updateTimer() {
    if (!canClick || !startTime) return;
    
    const timerBar = document.getElementById('timer-bar');
    if (!timerBar) return;

    const elapsed = (Date.now() - startTime) / 1000;
    
    // 动态计算阈值（建议将这些计算提到全局，避免每帧重复计算）
    const fullKey = currentPoem.first_half + currentPoem.second_half;
    const kData = kimarijiMap.get(fullKey);
    const kLen = kData ? kData.kimarijiFirstHalf.length : 1;
    const godspeedThreshold = (kLen * JUDGE_CONFIG.SYLLABLE_TIME) + JUDGE_CONFIG.BASE_REACTION;
    const flashThreshold = godspeedThreshold + JUDGE_CONFIG.FLASH_WINDOW;

    timerBar.className = ""; // 重置类名

    if (elapsed < JUDGE_CONFIG.FAIL_LIMIT) {
        // 10秒内：正常倒退
        const progress = (elapsed / JUDGE_CONFIG.FAIL_LIMIT) * 100;
        timerBar.style.width = Math.max(0, 100 - progress) + "%";

        // 颜色状态切换
        if (elapsed < godspeedThreshold) {
            timerBar.classList.add('timer-godspeed');
        } else if (elapsed < flashThreshold) {
            timerBar.classList.add('timer-flash');
        } else {
            timerBar.classList.add('timer-correct');
        }

        requestAnimationFrame(updateTimer);
    } else {
        // --- 核心修改：超时逻辑 ---
        timerBar.style.width = "100%"; // 直接充满
        timerBar.classList.add('timer-slow'); // 变成红色发光
        // 停止 requestAnimationFrame，因为它已经达到终止状态
    }
}

/**
 * 游戏结束处理
 * 因 HTML 无结算界面，仅做简单提示
 */
function handleGameOver() {
    const total = gamePool.length;
    const accuracy = total > 0 ? ((correctCount / total) * 100).toFixed(1) : 0;
    
    // 简单的结束反馈，防止报错
    alert(`試合終了！\nSCORE: ${score}\n正解率: ${accuracy}%`);
    
    // 可以在这里选择重新开始
    // window.location.reload(); 
}