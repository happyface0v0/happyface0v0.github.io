/**
 * game.js
 */

// ── 游戏状态变量 ─────────────────────────────────────────────

let gamePool     = [];    // 题目池
let currentIndex = 0;     // 当前题目指针
let currentPoem  = null;  // 当前题目对象
let score        = 0;
let combo        = 0;
let maxCombo     = 0;
let correctCount = 0;
let audio        = new Audio();
let canClick     = false;
let startTime    = 0;
let totalTime    = 0;
let activeTimeouts = [];
let judgeLog     = [];    // 全問の判定ログ

// ── 判定阈值配置 ─────────────────────────────────────────────

const JUDGE_CONFIG = {
    SYLLABLE_TIME: 0.3,   // 每个音节耗时
    BASE_REACTION: 1.25,  // 基础反应宽限期
    FLASH_WINDOW:  3.0,   // 闪光评价的额外窗口时间
    FAIL_LIMIT:    10.0   // 10秒强制线
};

// ── 编码工具（供 handleGameOver 使用）────────────────────────

const JUDGE_CHAR_GAME = { godspeed: 'g', flash: 'f', correct: 'c', slow: 's', wrong: 'w' };

function pad(n, len, radix = 36) {
    return n.toString(radix).padStart(len, '0');
}

function encodeResultToURL(data) {
    const { score, correctCount, total, maxCombo, totalTime, log, trialConfig } = data;

    const logStr = log.map(entry => {
        const stdPart  = pad(entry.poem.standardNumber, 2);
        const judPart  = JUDGE_CHAR_GAME[entry.judge] || 'w';
        const timePart = (entry.time >= 0) ? pad(Math.round(entry.time * 100), 4) : '----';
        const corPart  = entry.isCorrect ? '1' : '0';
        return stdPart + judPart + timePart + corPart;
    }).join(';');

    const cfg    = trialConfig || {};
    const cfgStr = btoa(
        (cfg.audioOnly    ? '1' : '0') +
        (cfg.invertedView ? '1' : '0') +
        '|' + (cfg.poolIds || []).join(',')
    );

    const main = [score, correctCount, total, maxCombo, Math.round((totalTime || 0) * 100), logStr, cfgStr].join('|');
    return btoa(unescape(encodeURIComponent(main))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// ── 初始化 ───────────────────────────────────────────────────

window.addEventListener('load', () => {
    initGame();
});

function initGame() {
    if (typeof mainData === 'undefined' || mainData.length === 0) {
        console.error("数据加载失败: data.js 未正确加载");
        return;
    }

    // 检查是否有合法的入场券
    const entryTicket = sessionStorage.getItem('trial_active');
    if (!entryTicket) {
        window.location.href = 'index.html';
        return;
    }
    // 立即销毁凭证，确保下一次刷新时凭证已失效
    sessionStorage.removeItem('trial_active');

    // 获取配置
    const savedConfig = sessionStorage.getItem('trial_config');
    let poolIds     = [];
    let isAudioOnly = false;
    let isInverted  = false;

    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        poolIds     = config.poolIds     || [];
        isAudioOnly = config.audioOnly   || false;
        isInverted  = config.invertedView || false;
    }

    // 根据 ID 池过滤题目
    gamePool = poolIds.length > 0
        ? mainData.filter(p => poolIds.includes(p.standardNumber))
        : [...mainData];

    // intro 动画结束后移除遮罩
    const intro = document.getElementById('intro-overlay');
    if (intro) {
        setTimeout(() => {
            intro.classList.add('intro-hidden');
            setTimeout(() => intro.remove(), 1000);
        }, 2500);
    }

    // 遮罩消失后再开始第一题
    setTimeout(() => {
        applySpecialModes(isAudioOnly, isInverted);
        shufflePool(gamePool);
        resetGame();
        nextQuestion();
    }, 2500);
}

function applySpecialModes(audioOnly, inverted) {
    if (audioOnly) {
        const kami = document.getElementById('kami-no-ku');
        if (kami) kami.style.display = 'none';
    }

    // 强制转换为布尔值
    if (String(inverted) === 'true') {
        document.body.classList.add('inverted-view');
    } else {
        document.body.classList.remove('inverted-view');
    }
}

function shufflePool(pool) {
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
}

function resetGame() {
    score        = 0;
    combo        = 0;
    maxCombo     = 0;
    currentIndex = 0;
    correctCount = 0;
    totalTime    = 0;
    judgeLog     = [];
    updateUI();
}

// ── 核心游戏流程 ─────────────────────────────────────────────

function nextQuestion() {
    if (currentIndex >= gamePool.length) {
        handleGameOver();
        return;
    }

    currentPoem = gamePool[currentIndex];

    const statusLabel = document.getElementById('status-label');
    const cardGrid    = document.getElementById('card-grid');
    const timerBar    = document.getElementById('timer-bar');

    if (statusLabel) {
        statusLabel.innerText = "";
        statusLabel.classList.remove('status-godspeed', 'status-flash', 'status-correct', 'status-wrong');
    }
    if (cardGrid)  cardGrid.classList.remove('locked');
    if (timerBar)  timerBar.style.width = "100%";

    canClick = true;

    renderOptions(currentPoem);

    const stdNum = String(currentPoem.standardNumber).padStart(3, '0');
    audio.src = `assets/audio/a${stdNum}.mp3`;

    const playHandler = () => {
        startTime = Date.now();
        animateTextIn(currentPoem.first_half);
        requestAnimationFrame(updateTimer);
    };

    audio.onplay = playHandler;

    audio.play().catch(() => {
        // 浏览器自动播放被拦截，显示全屏解锁层
        const overlay = document.createElement('div');
        overlay.id = 'audio-unlock-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: '#1a1a1a', zIndex: '10000',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            color: 'white', cursor: 'pointer', textAlign: 'center'
        });
        overlay.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">🔈</div>
            <div style="font-size: 1.5rem; font-weight: bold;">タップして開始</div>
            <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.7;">(音声再生を許可してください)</div>
        `;
        overlay.onclick = () => {
            audio.play().then(() => {
                overlay.remove();
                playHandler();
            }).catch(err => console.error("解锁失败:", err));
        };
        document.body.appendChild(overlay);
    });
}

function renderOptions(correct) {
    const grid = document.getElementById('card-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let options = [correct];
    let usedIds = new Set([correct.standardNumber]);

    function findSimilars(prop, targetValue, count) {
        let currentLen = 2;
        let results = [];
        while (results.length < count && currentLen > 0) {
            const prefix  = targetValue.substring(0, currentLen);
            let matches = mainData.filter(p =>
                !usedIds.has(p.standardNumber) && p[prop].startsWith(prefix)
            );
            while (matches.length > 0 && results.length < count) {
                const picked = matches.splice(Math.floor(Math.random() * matches.length), 1)[0];
                results.push(picked);
                usedIds.add(picked.standardNumber);
            }
            currentLen--;
        }
        return results;
    }

    options.push(...findSimilars('second_half', correct.second_half, 1));
    options.push(...findSimilars('first_half',  correct.first_half,  2));

    while (options.length < 4) {
        const rand = mainData[Math.floor(Math.random() * mainData.length)];
        if (!usedIds.has(rand.standardNumber)) {
            options.push(rand);
            usedIds.add(rand.standardNumber);
        }
    }

    options.sort(() => Math.random() - 0.5);

    options.forEach(poem => {
        const card = document.createElement('div');
        card.className = `karuta-card color-${poem.color}`;
        card.dataset.isCorrect = (poem.standardNumber === correct.standardNumber);

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'card-text-wrapper';

        const fullText = poem.second_half.replace(/[\s　]/g, "");

        if (poem.standardNumber === 21) {
            const p1 = fullText.substring(0, 5);
            const p2 = fullText.substring(5, 10);
            const p3 = fullText.substring(10);
            contentWrapper.innerHTML = `${p1}\n${p2}\n<div style="display: contents; letter-spacing: -0.10em;">${p3}</div>`;
        } else {
            const lines = [];
            for (let i = 0; i < fullText.length; i += 5) {
                lines.push(fullText.substring(i, i + 5));
            }
            contentWrapper.innerText = lines.join("\n");
        }

        card.appendChild(contentWrapper);
        card.onclick = () => handleChoice(poem.standardNumber === correct.standardNumber, card);
        grid.appendChild(card);
    });
}

function handleChoice(isCorrect, cardElement) {
    if (!canClick) return;
    canClick = false;

    document.getElementById('card-grid').classList.add('locked');
    audio.pause();
    currentIndex++;

    const elapsed     = (Date.now() - startTime) / 1000;
    totalTime        += elapsed;

    const statusLabel = document.getElementById('status-label');
    statusLabel.className = '';
    void statusLabel.offsetWidth; // 强制重绘

    if (isCorrect) {
        correctCount++;
        combo++;
        if (combo > maxCombo) maxCombo = combo;

        const fullKey          = currentPoem.first_half + currentPoem.second_half;
        const kData            = kimarijiMap.get(fullKey);
        const kLen             = kData ? kData.kimarijiFirstHalf.length : 1;
        const difficultyWeight = 0.8 + (kLen * 0.2);

        const godspeedThreshold = (kLen * JUDGE_CONFIG.SYLLABLE_TIME) + JUDGE_CONFIG.BASE_REACTION;
        const flashThreshold    = godspeedThreshold + JUDGE_CONFIG.FLASH_WINDOW;
        const failThreshold     = JUDGE_CONFIG.FAIL_LIMIT;

        let judgeName = 'correct';
        let multiplier = 1.0;
        let sfx = 'correct.wav';

        if (elapsed < godspeedThreshold) {
            judgeName = 'godspeed'; multiplier = 3.5; sfx = 'godspeed.wav';
            statusLabel.innerText = "神速！";
            statusLabel.classList.add('status-godspeed');
        } else if (elapsed < flashThreshold) {
            judgeName = 'flash'; multiplier = 2.0; sfx = 'flash.wav';
            statusLabel.innerText = "閃光！";
            statusLabel.classList.add('status-flash');
        } else if (elapsed < failThreshold) {
            judgeName = 'correct'; multiplier = 1.0; sfx = 'correct.wav';
            statusLabel.innerText = "正解！";
            statusLabel.classList.add('status-correct');
        } else {
            judgeName = 'slow'; multiplier = 0.5; sfx = 'slow.wav';
            statusLabel.innerText = "遅すぎ！";
            statusLabel.classList.add('status-slow');
        }

        judgeLog.push({ poem: currentPoem, judge: judgeName, time: elapsed, isCorrect: true });

        const comboBonus = 1 + (combo * 0.05);
        score += Math.round((100 * difficultyWeight * multiplier) * comboBonus);

        cardElement.classList.add('correct');
        new Audio(`assets/sounds/${sfx}`).play().catch(() => {});

    } else {
        combo = 0;
        judgeLog.push({ poem: currentPoem, judge: 'wrong', time: -1, isCorrect: false });
        statusLabel.innerText = "お手つき！";
        statusLabel.className = 'status-wrong';
        cardElement.classList.add('wrong');

        const correctCard = document.querySelector('.karuta-card[data-is-correct="true"]');
        if (correctCard) correctCard.classList.add('highlight-answer');

        new Audio(`assets/sounds/wrong.wav`).play().catch(() => {});
    }

    revealKimariji();
    updateUI();
    setTimeout(nextQuestion, 2000);
}

// ── 視覚補助 ─────────────────────────────────────────────────

function animateTextIn(text) {
    const container = document.getElementById('kami-no-ku');
    if (!container) return;

    container.innerHTML = '';
    activeTimeouts.forEach(clearTimeout);
    activeTimeouts = [];

    let accumulatedDelay = 0;
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.innerText = char;
        container.appendChild(span);

        accumulatedDelay += (i === 0) ? 600 : 300;
        const timer = setTimeout(() => span.classList.add('active'), accumulatedDelay);
        activeTimeouts.push(timer);
    });
}

function revealKimariji() {
    if (!currentPoem) return;

    // 上句アニメーションを即完了
    const kamiContainer = document.getElementById('kami-no-ku');
    if (kamiContainer) {
        kamiContainer.querySelectorAll('span').forEach(s => s.classList.add('active'));
    }
    activeTimeouts.forEach(clearTimeout);
    activeTimeouts = [];

    const fullKey = currentPoem.first_half + currentPoem.second_half;
    const kData   = kimarijiMap.get(fullKey);
    if (!kData) return;

    function applyKimariji(container, kText, highlightClass) {
        if (!container) return;
        let chars = kText.replace(/[\s　]/g, "").split('');

        function walk(node) {
            if (chars.length === 0) return;
            if (node.nodeType === 3) {
                const text     = node.nodeValue;
                const fragment = document.createDocumentFragment();
                let hasChanged = false;

                for (const char of text) {
                    if (/[\s　\n\r]/.test(char)) {
                        fragment.appendChild(document.createTextNode(char));
                        continue;
                    }
                    if (chars.length > 0 && char === chars[0]) {
                        const span = document.createElement('span');
                        span.className   = highlightClass;
                        span.textContent = char;
                        fragment.appendChild(span);
                        chars.shift();
                        hasChanged = true;
                    } else {
                        fragment.appendChild(document.createTextNode(char));
                    }
                }
                if (hasChanged) node.parentNode.replaceChild(fragment, node);
            } else {
                if (node.className !== highlightClass) {
                    Array.from(node.childNodes).forEach(walk);
                }
            }
        }
        walk(container);
    }

    const k1 = kData.kimarijiFirstHalf  || "";
    const k2 = kData.kimarijiSecondHalf || "";
    if (k1 && kamiContainer) applyKimariji(kamiContainer, k1, 'kimariji-display');

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

    const elapsed   = (Date.now() - startTime) / 1000;
    const fullKey   = currentPoem.first_half + currentPoem.second_half;
    const kData     = kimarijiMap.get(fullKey);
    const kLen      = kData ? kData.kimarijiFirstHalf.length : 1;
    const godspeedThreshold = (kLen * JUDGE_CONFIG.SYLLABLE_TIME) + JUDGE_CONFIG.BASE_REACTION;
    const flashThreshold    = godspeedThreshold + JUDGE_CONFIG.FLASH_WINDOW;

    timerBar.className = "";

    if (elapsed < JUDGE_CONFIG.FAIL_LIMIT) {
        timerBar.style.width = Math.max(0, 100 - (elapsed / JUDGE_CONFIG.FAIL_LIMIT) * 100) + "%";
        if      (elapsed < godspeedThreshold) timerBar.classList.add('timer-godspeed');
        else if (elapsed < flashThreshold)    timerBar.classList.add('timer-flash');
        else                                  timerBar.classList.add('timer-correct');
        requestAnimationFrame(updateTimer);
    } else {
        timerBar.style.width = "100%";
        timerBar.classList.add('timer-slow');
    }
}

// ── 游戏结束 ─────────────────────────────────────────────────

function handleGameOver() {
    const encoded = encodeResultToURL({
        score,
        correctCount,
        total:       gamePool.length,
        maxCombo,
        totalTime,
        log:         judgeLog,
        trialConfig: JSON.parse(sessionStorage.getItem('trial_config') || '{}')
    });

    // 结算覆盖层
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position:       'fixed',
        inset:          '0',
        background:     '#1a1a1a',
        zIndex:         '10000',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '24px',
        opacity:        '0',
        transition:     'opacity 0.6s ease',
        fontFamily:     "'Noto Serif JP', serif",
        color:          '#fff',
        userSelect:     'none',
    });

    const accuracy = gamePool.length > 0
        ? ((correctCount / gamePool.length) * 100).toFixed(1)
        : 0;

    overlay.innerHTML = `
        <div style="font-size:0.85rem; letter-spacing:0.4em; color:#888; text-transform:uppercase;">試練終了</div>
        <div id="gameover-score" style="
            font-size: clamp(4rem, 15vw, 8rem);
            font-weight: 900;
            line-height: 1;
            background: linear-gradient(135deg, #d4af37, #f1c40f);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        ">0</div>
        <div style="display:flex; gap:32px; font-size:0.9rem; color:#aaa;">
            <span><b style="color:#fff; font-size:1.1rem;">${correctCount}/${gamePool.length}</b> 正解</span>
            <span><b style="color:#fff; font-size:1.1rem;">${accuracy}%</b> 正解率</span>
            <span><b style="color:#fff; font-size:1.1rem;">${maxCombo}</b> 最大COMBO</span>
        </div>
        <div style="font-size:0.75rem; color:#555; margin-top:8px; letter-spacing:0.2em;">結果画面へ移動中...</div>
    `;

    document.body.appendChild(overlay);

    // フェードイン
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { overlay.style.opacity = '1'; });
    });

    // スコアカウントアップ → 完了後に遷移
    const scoreEl = overlay.querySelector('#gameover-score');
    const duration = 1400;
    const start = performance.now();
    (function countUp(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        scoreEl.textContent = Math.floor(score * eased).toLocaleString();
        if (p < 1) {
            requestAnimationFrame(countUp);
        } else {
            // カウントアップ完了 → 800ms 停留 → 扫光 → 遷移
            setTimeout(() => {
                // 扫光元素
                const sweep = document.createElement('div');
                Object.assign(sweep.style, {
                    position:      'absolute',
                    top:           '0',
                    left:          '-40%',
                    width:         '40%',
                    height:        '100%',
                    background:    'linear-gradient(90deg, transparent, rgba(241,196,15,0.3) 30%, rgba(255,255,255,0.95) 48%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.95) 52%, rgba(241,196,15,0.3) 70%, transparent)',
                    transform:     'skewX(-12deg)',
                    transition:    'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex:        '1',
                    pointerEvents: 'none',
                });
                overlay.style.overflow = 'hidden';
                overlay.appendChild(sweep);

                // 触发扫光
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => { sweep.style.left = '140%'; });
                });

                // 扫光结束后：内容淡出，背景变和纸色，跳转
                setTimeout(() => {
                    Array.from(overlay.children).forEach(el => {
                        if (el !== sweep) {
                            el.style.transition = 'opacity 0.3s ease';
                            el.style.opacity    = '0';
                        }
                    });
                    overlay.style.transition = 'background 0.5s ease';
                    overlay.style.background = '#efead8';
                    // 背景开始变色就立刻跳转，result页面的入场动画填补这段时间
                    setTimeout(() => {
                        window.location.href = `result.html?d=${encoded}`;
                    }, 50);
                }, 800);
            }, 800);
        }
    })(performance.now());
}