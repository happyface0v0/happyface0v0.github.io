/**
 * 百人一首学习系统 - 核心逻辑脚本
 * 功能：数据标准化、决定字计算、动态渲染、搜索过滤及学习进度管理
 */

// --- 1. 全局状态与基础配置 ---
let currentAudio = null;            // 当前正在播放的音频实例
let currentActiveAudioId = null;    // 当前活跃的音频编号 (001-100)
const STATUS_CYCLE = ['none', 'learning', 'mastered']; // 学习状态循环：未学习 -> 学习中 -> 已掌握

// 五色组名映射 (用于弹窗标签显示)
const colorNamesJP = {
    'red': '赤グループ',
    'blue': '青グループ',
    'yellow': '黄グループ',
    'green': '緑グループ',
    'orange': '橙グループ'
};

// --- 3. 学习进度管理 (LocalStorage) ---

/**
 * 从本地存储获取诗句的学习状态
 * @param {number} stdNum - 歌编号 (Standard Number)
 */
function getSavedStatus(stdNum) {
    const data = JSON.parse(localStorage.getItem('waka_progress') || '{}');
    return data[stdNum] || 'none';
}

/**
 * 将学习状态保存至本地存储
 * @param {number} stdNum - 歌编号
 * @param {string} status - 状态值 ('none', 'learning', 'mastered')
 */
function saveStatusToLocal(stdNum, status) {
    let data = JSON.parse(localStorage.getItem('waka_progress') || '{}');
    if (status && status !== 'none') {
        data[stdNum] = status;
    } else {
        delete data[stdNum]; // 如果是 none 则移除，节省空间
    }
    localStorage.setItem('waka_progress', JSON.stringify(data));
}

/**
 * 切换学习状态并同步 UI (核心功能：点击改色并保存)
 * 绑定在 window 上以便 HTML 里的 onclick 调用
 */
window.toggleLearnStatus = function(element, stdNum) {
    // 1. 获取当前状态并计算下一个状态
    let currentStatus = getSavedStatus(stdNum) || 'none';
    let nextIndex = (STATUS_CYCLE.indexOf(currentStatus) + 1) % STATUS_CYCLE.length;
    let nextStatus = STATUS_CYCLE[nextIndex];

    // 2. 核心修复：找到页面上所有该编号的卡片
    // 这包括：主列表、Kanji弹窗、以及您说的 Kimariji 相似列表弹窗
    const allMatchingItems = document.querySelectorAll(`[data-standard-number="${stdNum}"]`);

    allMatchingItems.forEach(item => {
        // 移除所有旧的状态类
        STATUS_CYCLE.forEach(s => item.classList.remove(`status-${s}`));
        // 添加新状态类
        if (nextStatus !== 'none') {
            item.classList.add(`status-${nextStatus}`);
        }
    });

    // 3. 执行持久化保存
    saveStatusToLocal(stdNum, nextStatus);
    
    // 4. 如果有进度统计功能，在此更新
    if (typeof updateProgressUI === 'function') updateProgressUI();
};

/**
 * 页面加载时应用已保存的学习状态
 */
function applySavedStatuses() {
    const progressData = JSON.parse(localStorage.getItem('waka_progress') || '{}');
    const allItems = document.querySelectorAll('.poem-item');
    
    allItems.forEach(item => {
        const stdNum = item.dataset.standardNumber;
        const status = progressData[stdNum];
        STATUS_CYCLE.forEach(s => item.classList.remove(`status-${s}`));
        if (status && status !== 'none') {
            item.classList.add(`status-${status}`);
        }
    });
}

/**
 * --- 学习进度导出与导入逻辑 ---
 */

// 导出功能：将状态对象转为 Base64 字符串并复制
window.exportProgress = function() {
    const data = localStorage.getItem('waka_progress');
    if (!data || data === '{}') {
        alert("保存された学習進捗がありません。");
        return;
    }

    try {
        // 使用 Base64 编码，方便在社交软件或网页间传输，避免特殊字符干扰
        const base64Data = btoa(unescape(encodeURIComponent(data)));
        
        // 复制到剪贴板
        navigator.clipboard.writeText(base64Data).then(() => {
            alert("進捗データをコピーしました！\n他のサイトの「読み込み」で貼り付けてください。");
        }).catch(err => {
            console.error('Copy failed:', err);
            alert("コピーに失敗しました。手動でコピーしてください: " + base64Data);
        });
    } catch (e) {
        alert("データの書き出しに失敗しました。");
    }
};

// 导入功能：从用户输入的字符串恢复状态
window.importProgress = function() {
    const input = prompt("進捗文字列（コード）を貼り付けてください:");
    if (!input) return;

    try {
        // 解码 Base64
        const decodedData = decodeURIComponent(escape(atob(input.trim())));
        const parsed = JSON.parse(decodedData);

        // 验证数据格式
        if (typeof parsed !== 'object') throw new Error("Invalid format");

        if (confirm("現在の進捗を上書きして読み込みますか？")) {
            localStorage.setItem('waka_progress', JSON.stringify(parsed));
            // 重新渲染页面以应用新状态
            renderPoems(getSortedPoems(sortSelect.value));
            alert("読み込みが完了しました！");
        }
    } catch (e) {
        console.error('Import failed:', e);
        alert("エラー：正しい進捗文字列ではありません。");
    }
};

// --- 4. UI 渲染与构建 ---

const poemListContainer = document.querySelector('.poem-list');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');

/**
 * 高亮决定字及其关键末字
 * @param {string} text - 歌句文本
 * @param {string} kimariji - 该句的决定字
 */
function highlightKimariji(text, kimariji, additionalClass = '') {
    if (!kimariji) return text;
    const prefix = kimariji.slice(0, -1); // 决定字的前缀
    const lastChar = kimariji.slice(-1);  // 确定是哪首诗的关键末字
    return text.replace(kimariji,
        `<span class="kimariji-highlight ${additionalClass}" data-kimariji="${kimariji}">${prefix}<span class="last-char">${lastChar}</span></span>`
    );
}

/**
 * 构建单条诗句的 DOM 元素
 * @param {Object} poem - 诗句数据对象
 * @param {boolean|null} focusTopHalf - 是否高亮上半句/下半句
 * @param {boolean} isSource - 是否作为搜索起点显示
 */
function createPoemElement(poem, focusTopHalf, isSource = false) {
    const poemItem = document.createElement('div');
    const colorClass = poem.color || 'default';
    
    // 基础类名、五色组颜色类、如果是搜索源则添加 source-item
    poemItem.className = `poem-item color-${colorClass} ${isSource ? 'source-item' : ''}`;
    
    // 绑定 ID 用于页面跳转定位
    if (!isSource && focusTopHalf === null) {
        poemItem.id = `poem-${poem.color}-${poem.index}`;
    }

    // 存储关键数据到 dataset
    poemItem.dataset.poemJson = JSON.stringify(poem);
    poemItem.dataset.standardNumber = poem.standardNumber;

    const kData = kimarijiMap.get(poem.first_half + poem.second_half);
    const audioId = String(poem.standardNumber).padStart(3, '0');
    const audioPath = `./shiren/assets/audio/a${audioId}.mp3`;
    const isPlaying = (typeof currentActiveAudioId !== 'undefined' && currentActiveAudioId === audioId);

    // 加载并应用状态
    const currentStatus = getSavedStatus(poem.standardNumber) || 'none';
    if (currentStatus !== 'none') {
        poemItem.classList.add(`status-${currentStatus}`);
    }

    // HTML 结构构建
    // title 使用日语：切换学习状态 / 查看详情 / 播放停止
    poemItem.innerHTML = `
        <div class="status-action-zone" 
             title="学習状態を切り替え：未学習 / 学習中 / 習得済み"
             onclick="event.stopPropagation(); window.toggleLearnStatus(this.parentElement, ${poem.standardNumber})">
            <div class="status-marker"></div>
        </div>

        <div class="poem-meta" 
             title="詳細を見る"
             onclick="event.stopPropagation(); showKanjiCardPopup(${JSON.stringify(poem).replace(/"/g, '&quot;')})">
            ${poem.index}
        </div>

        <div class="poem-content">
            <div class="half-line left ${focusTopHalf === true ? 'focus-half' : ''}">
                ${highlightKimariji(poem.first_half, kData?.kimarijiFirstHalf, "left")}
            </div>
            <div class="half-line right ${focusTopHalf === false ? 'focus-half' : ''}">
                ${highlightKimariji(poem.second_half, kData?.kimarijiSecondHalf, "right")}
            </div>
        </div>

        <button class="audio-btn ${isPlaying ? 'playing' : ''}" 
                data-audio-id="${audioId}" 
                title="再生/停止"
                onclick="event.stopPropagation(); playWaka('${audioPath}', this)">
        </button>
    `;

    return poemItem;
}

/**
 * 全量渲染诗句列表
 */
function renderPoems(poems) {
    if (!poemListContainer) return;
    poemListContainer.innerHTML = '';
    poems.forEach(p => poemListContainer.appendChild(createPoemElement(p, null)));
    applySavedStatuses();
}

// --- 5. 排序与搜索逻辑 ---

/**
 * 获取排序后的数据副本
 */
function getSortedPoems(sortType) {
    const poems = [...mainData];
    switch (sortType) {
        case 'fiveColors': return mainData; // 五色组默认序
        case 'kanaFirst': return poems.sort((a, b) => a.first_half.localeCompare(b.first_half, 'ja'));
        case 'kanaSecond': return poems.sort((a, b) => a.second_half.localeCompare(b.second_half, 'ja'));
        case 'default': 
            return poems.sort((a, b) => {
                const idxA = kanaToStandardMap.get((a.first_half + a.second_half).replace(/[\s　]/g, ""));
                const idxB = kanaToStandardMap.get((b.first_half + b.second_half).replace(/[\s　]/g, ""));
                return idxA - idxB;
            });
        case 'kimarijiFirst': return sortByKimariji(poems, 'first');
        case 'kimarijiSecond': return sortByKimariji(poems, 'second');
        default: return poems;
    }
}

/**
 * 按决定字长度排序
 */
function sortByKimariji(poems, half) {
    return poems.sort((a, b) => {
        const kA = kimarijiMap.get(a.first_half + a.second_half);
        const kB = kimarijiMap.get(b.first_half + b.second_half);
        const lenA = (half === 'first' ? kA?.kimarijiFirstHalf : kA?.kimarijiSecondHalf)?.length || 99;
        const lenB = (half === 'first' ? kB?.kimarijiFirstHalf : kB?.kimarijiSecondHalf)?.length || 99;
        if (lenA !== lenB) return lenA - lenB;
        return (half === 'first' ? a.first_half : a.second_half).localeCompare((half === 'first' ? b.first_half : b.second_half), 'ja');
    });
}

/**
 * 执行实时搜索
 */
function executeSearch(term) {
    const results = [];
    const lowerTerm = term.toLowerCase();

    mainData.forEach(poem => {
        const kData = kimarijiMap.get(poem.first_half + poem.second_half);
        let score = 0;
        let matchPart = null;

        // 优先级：决定字匹配 > 开头匹配 > 包含匹配
        if (kData?.kimarijiFirstHalf?.startsWith(lowerTerm)) {
            score = 1000; matchPart = 'top';
        } else if (kData?.kimarijiSecondHalf?.startsWith(lowerTerm)) {
            score = 500; matchPart = 'bottom';
        } else if (poem.first_half.startsWith(lowerTerm)) {
            score = 100; matchPart = 'top';
        } else if (poem.second_half.startsWith(lowerTerm)) {
            score = 100; matchPart = 'bottom';
        } else if (poem.first_half.includes(lowerTerm) || poem.second_half.includes(lowerTerm) || String(poem.index) === lowerTerm) {
            score = 10;
        }

        if (score > 0) {
            results.push({ ...poem, searchScore: score, suggestedFocus: matchPart });
        }
    });

    results.sort((a, b) => b.searchScore - a.searchScore || a.index - b.index);
    
    poemListContainer.innerHTML = '';
    results.forEach(p => {
        const focus = p.suggestedFocus === 'top' ? true : (p.suggestedFocus === 'bottom' ? false : null);
        poemListContainer.appendChild(createPoemElement(p, focus));
    });
    searchCount.textContent = `${results.length} 首が一致`;
}

// --- 6. 弹窗交互逻辑 ---

/**
 * 显示汉字卡片详情弹窗
 */
function showKanjiCardPopup(poem) {
    const popup = document.getElementById('kimarijiPopup');
    const kanjiContainer = document.getElementById('kanjiCardContent');
    const similarContainer = document.getElementById('similarListContent');

    const standardNumber = poem.standardNumber || '??';
    const standardIdx = (typeof standardNumber === 'number' && standardNumber !== 999) ? standardNumber - 1 : undefined;

    let kanjiData = { first_half: '---', second_half: '---' };
    if (standardIdx !== undefined && typeof hyakuninIsshuKanji !== 'undefined') {
        kanjiData = hyakuninIsshuKanji[standardIdx];
    }

    const kData = kimarijiMap.get(poem.first_half + poem.second_half);
    const audioId = String(poem.standardNumber).padStart(3, '0');
    const isCurrentlyPlaying = (currentActiveAudioId === audioId && currentAudio && !currentAudio.paused);

    kanjiContainer.style.display = 'block';
    similarContainer.style.display = 'none';
    
    // 渲染日语标签：歌番号、上の句、下の句
    kanjiContainer.innerHTML = `
        <div class="kanji-display-card" data-standard-number="${standardNumber}">
            <div class="kanji-card-header">
                <div class="badge-row">
                    <span class="group-badge color-${poem.color}">${colorNamesJP[poem.color]} No.${poem.index}</span>
                    <span class="standard-badge">歌番号 ${standardNumber}</span>
                </div>
            </div>
            <div class="kanji-card-body">
                <div class="kanji-row">
                    <span class="part-label">【上の句】</span>
                    <p class="kana-text">${highlightKimariji(poem.first_half, kData?.kimarijiFirstHalf, "left")}</p>
                    <h2 class="kanji-text">${kanjiData.first_half}</h2>
                </div>
                <div class="kanji-divider-line"></div>
                <div class="kanji-row">
                    <span class="part-label">【下の句】</span>
                    <p class="kana-text">${highlightKimariji(poem.second_half, kData?.kimarijiSecondHalf, "right")}</p>
                    <h2 class="kanji-text">${kanjiData.second_half}</h2>
                </div>
                <button class="audio-btn big-audio-btn ${isCurrentlyPlaying ? 'playing' : ''}" 
                        data-audio-id="${audioId}" 
                        title="再生/停止"
                        onclick="playWaka('./shiren/assets/audio/a${audioId}.mp3', this)">
                </button>
            </div>
        </div>
    `;

    popup.classList.add('show');
    popup.style.display = 'flex';
    document.body.classList.add('modal-open');
}

/**
 * 显示相似决定字弹窗
 */
function showKimarijiPopup(similarPoems, isTopHalf, sourcePoem) {
    const popup = document.getElementById('kimarijiPopup');
    const kanjiContainer = document.getElementById('kanjiCardContent');
    const similarContainer = document.getElementById('similarListContent');
    const list = document.getElementById('kimarijiPoemsList');

    kanjiContainer.style.display = 'none';
    similarContainer.style.display = 'block';

    list.innerHTML = '<h3>検索の起点:</h3>';
    list.appendChild(createPoemElement(sourcePoem, isTopHalf, true));
    list.innerHTML += '<hr><h3>類似の歌:</h3>';

    if (similarPoems.length === 0) {
        list.innerHTML += `<div class="no-poems-message">類似の歌は見つかりませんでした。</div>`;
    } else {
        similarPoems.forEach(p => list.appendChild(createPoemElement(p, isTopHalf, false)));
    }

    popup.classList.add('show');
    popup.style.display = 'flex';
    document.body.classList.add('modal-open');
}

/**
 * 关闭弹窗
 */
function closePopup() {
    const popup = document.getElementById('kimarijiPopup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => { popup.style.display = 'none'; }, 300);
        document.body.classList.remove('modal-open');
    }
}

// --- 7. 音频播放控制 ---

/**
 * 播放/暂停咏唱音频
 */
window.playWaka = function(path, clickedBtn) {
    const audioId = clickedBtn.dataset.audioId;

    // 如果点击的是当前正在播放的音频，则暂停
    if (currentAudio && currentActiveAudioId === audioId) {
        if (!currentAudio.paused) {
            currentAudio.pause();
            syncAllButtons(audioId, false);
            return;
        }
    }

    // 停止之前正在播放的音频
    if (currentAudio) {
        currentAudio.pause();
        syncAllButtons(currentActiveAudioId, false);
    }

    const audio = new Audio(path);
    currentAudio = audio;
    currentActiveAudioId = audioId;

    audio.play().then(() => {
        syncAllButtons(audioId, true);
    }).catch(e => console.error("Playback failed:", e));

    audio.onended = () => {
        syncAllButtons(audioId, false);
        currentAudio = null;
        currentActiveAudioId = null;
    };
};

/**
 * 同步所有相同歌编号按钮的播放状态图标
 */
function syncAllButtons(audioId, isPlaying) {
    if (!audioId) return;
    const buttons = document.querySelectorAll(`.audio-btn[data-audio-id="${audioId}"]`);
    buttons.forEach(btn => btn.classList.toggle('playing', isPlaying));
}

// --- 8. 全局事件与跳转动画 ---

/**
 * 弹窗点击编号跳转回主列表对应位置并高亮显示
 */
function handleJumpToMain(poemData) {
    if (searchInput.value !== "") {
        searchInput.value = ""; // 清空搜索以显示全表
        searchCount.textContent = "";
        renderPoems(getSortedPoems(sortSelect.value));
    }
    const targetId = `poem-${poemData.color}-${poemData.index}`;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        closePopup();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 播放强调动画效果
        targetElement.style.transition = "none";
        targetElement.style.zIndex = "9999";
        void targetElement.offsetWidth; // 触发重绘
        targetElement.style.transition = "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        targetElement.style.outline = "6px solid #f1c40f";
        targetElement.style.outlineOffset = "12px";
        targetElement.style.boxShadow = "0 0 40px rgba(241, 196, 15, 0.8)";
        targetElement.style.transform = "scale(1.03)";
        setTimeout(() => {
            targetElement.style.transition = "all 0.8s ease-out";
            targetElement.style.outline = "0px solid transparent";
            targetElement.style.boxShadow = "none";
            targetElement.style.transform = "scale(1)";
            setTimeout(() => { targetElement.style.zIndex = ""; }, 800);
        }, 700);
    }
}

/**
 * 全局点击监听：处理决定字点击跳转、编号点击弹窗
 */
document.addEventListener('click', (event) => {
    // 1. 处理决定字点击 (寻找相似句)
    const highlightSpan = event.target.closest('.kimariji-highlight');
    if (highlightSpan) {
        const clickedKimariji = highlightSpan.dataset.kimariji;
        const isTopHalf = highlightSpan.classList.contains('left');
        const parent = highlightSpan.closest('.poem-item');
        const source = JSON.parse(parent.dataset.poemJson);
        
        const similar = mainData.filter(p => {
            // 排除自身
            if (p.first_half === source.first_half && p.second_half === source.second_half) return false;
            const pData = kimarijiMap.get(p.first_half + p.second_half);
            const targetRaw = isTopHalf ? pData?.kimarijiFirstHalf : pData?.kimarijiSecondHalf;
            if (!targetRaw) return false;

            // 匹配逻辑
            if (isTopHalf) {
                const normClicked = normalizeTopHalf(clickedKimariji);
                const normPrefix = normClicked.slice(0, -1);
                const normTarget = normalizeTopHalf(targetRaw);
                return normPrefix === "" ? (normTarget === normClicked) : normTarget.startsWith(normPrefix);
            } else {
                const prefix = clickedKimariji.slice(0, -1);
                return prefix === "" ? (targetRaw === clickedKimariji) : targetRaw.startsWith(prefix);
            }
        });
        showKimarijiPopup(similar, isTopHalf, source);
        return;
    }

    // 2. 处理编号点击 (主页看卡片 / 弹窗回主页)
    const metaElement = event.target.closest('.poem-meta');
    if (metaElement) {
        const parentItem = metaElement.closest('.poem-item');
        const poemData = JSON.parse(parentItem.dataset.poemJson);
        if (metaElement.closest('#kimarijiPopup')) {
            handleJumpToMain(poemData);
        } else {
            showKanjiCardPopup(poemData);
        }
    }

    // 3. 点击弹窗背景关闭
    if (event.target.id === 'kimarijiPopup') closePopup();
});

// --- 9. 初始化绑定 ---

if (sortSelect) {
    sortSelect.addEventListener('change', (e) => renderPoems(getSortedPoems(e.target.value)));
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.trim().toLowerCase();
        if (term === "") {
            renderPoems(getSortedPoems(sortSelect.value));
            searchCount.textContent = "";
        } else {
            executeSearch(term);
        }
    });
}

const popupClose = document.getElementById('kimarijiClose');
if (popupClose) popupClose.onclick = closePopup;

const closeGuideBtn = document.getElementById('closeGuide');
if (closeGuideBtn) {
    closeGuideBtn.onclick = () => { document.getElementById('guidePanel').style.display = 'none'; };
}

// 执行首次渲染
renderPoems(mainData);

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const exitOverlay = document.getElementById('page-exit-overlay');

    // 延迟一小会儿触发，确保浏览器已经准备好渲染，动画更顺滑
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            
            // 如果是当前页或者是空链接，不触发动画
            if (!targetUrl || targetUrl === '#') return;

            e.preventDefault(); // 阻止立即跳转

            if (targetUrl.includes('shiren/index.html')) {
                // 情况 A: 点击“试炼” -> 全屏淡出成黑色
                document.body.classList.add('fade-to-black');
            } else {
                // 情况 B: 点击其他 -> 仅内容淡出，保留导航栏
                document.body.classList.add('fade-content-only');
            }

            // 延迟跳转，等待动画完成
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 600); // 这里的 600ms 与 CSS transition 时间对应
        });
    });
});