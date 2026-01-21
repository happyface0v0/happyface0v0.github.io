document.addEventListener('DOMContentLoaded', () => {
    // 0. 数据安全检查
    if (typeof mainData === 'undefined' || typeof kimarijiMap === 'undefined') {
        console.error("数据未加载！");
        return;
    }

    // 获取所有 UI 元素
    const statusInputs = document.querySelectorAll('input[name="status-filter"]');
    const colorInputs = document.querySelectorAll('.btn-color input');
    const kInputs = document.querySelectorAll('.k-chip input');
    const startBtn = document.getElementById('start-btn');
    const audioOnlyCheck = document.getElementById('audio-only');
    const invertedViewCheck = document.getElementById('inverted-view');

    // --- 1. 持久化逻辑：保存与读取 ---

    function saveUserPreferences() {
        const configToSave = {
            colors: Array.from(colorInputs).filter(i => i.checked).map(i => i.value),
            klens: Array.from(kInputs).filter(i => i.checked).map(i => i.value),
            status: Array.from(statusInputs).filter(i => i.checked).map(i => i.value),
            audioOnly: audioOnlyCheck?.checked,
            invertedView: invertedViewCheck?.checked
        };
        localStorage.setItem('last_trial_settings', JSON.stringify(configToSave));
    }

    function applySavedConfig() {
        const saved = localStorage.getItem('last_trial_settings');
        if (!saved) return;
        try {
            const config = JSON.parse(saved);
            // 还原颜色
            if (config.colors) colorInputs.forEach(input => input.checked = config.colors.includes(input.value));
            // 还原字数
            if (config.klens) kInputs.forEach(input => input.checked = config.klens.includes(input.value));
            // 还原学习状态筛选
            if (config.status) statusInputs.forEach(input => input.checked = config.status.includes(input.value));
            // 还原模式
            if (audioOnlyCheck && config.audioOnly !== undefined) audioOnlyCheck.checked = config.audioOnly;
            if (invertedViewCheck && config.invertedView !== undefined) invertedViewCheck.checked = config.invertedView;
        } catch (e) { console.error("解析配置失败", e); }
    }

    // --- 2. 核心逻辑：计算数字与过滤池 ---

    function updateSlotCount(count) {
        const countStr = count.toString().padStart(3, '0');
        const digits = countStr.split('');
        const slots = ['slot-100', 'slot-10', 'slot-1'];
        const stepHeight = 4; 

        digits.forEach((digit, index) => {
            const slotEl = document.getElementById(slots[index]);
            if (!slotEl) return;
            const numbersEl = slotEl.querySelector('.numbers');
            if (numbersEl) {
                const moveY = parseInt(digit) * stepHeight;
                numbersEl.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
                numbersEl.style.transform = `translateY(-${moveY}rem)`;
            }
            if (index === 0) count < 100 ? slotEl.classList.add('is-dim') : slotEl.classList.remove('is-dim');
            else if (index === 1) count < 10 ? slotEl.classList.add('is-dim') : slotEl.classList.remove('is-dim');
        });
    }

    function updateSelectedPool() {
        const selectedColors = Array.from(colorInputs).filter(i => i.checked).map(i => i.value);
        const selectedKLens = Array.from(kInputs).filter(i => i.checked).map(i => i.value);
        const selectedStatus = Array.from(statusInputs).filter(i => i.checked).map(i => i.value);

        // 读取来自 /index.html 的进度数据
        const progressData = JSON.parse(localStorage.getItem('waka_progress') || '{}');

        const pool = mainData.filter(p => {
            if (!selectedColors.includes(p.color)) return false;
            
            const fullKey = p.first_half + p.second_half;
            const kData = kimarijiMap.get(fullKey);
            if (!kData) return false;
            const len = kData.kimarijiFirstHalf.length;
            const isLenMatch = selectedKLens.some(val => {
                if (val === 'oyama') return len === 6 || len === 7;
                return parseInt(val) === len;
            });
            if (!isLenMatch) return false;

            // 进度过滤
            const currentStatus = progressData[p.standardNumber] || 'none';
            return selectedStatus.includes(currentStatus);
        });

        updateSlotCount(pool.length);
        saveUserPreferences(); // 只要有变动就存
        return pool;
    }

    /**
     * 更新统计数据：已学习的歌数和进度条
     */
    function updateLearnedStats() {
        const progressData = JSON.parse(localStorage.getItem('waka_progress') || '{}');
        const total = 100;

        // 分别统计
        const masteredCount = Object.values(progressData).filter(s => s === 'mastered').length;
        const learningCount = Object.values(progressData).filter(s => s === 'learning').length;

        // 更新数字 (显示总数)
        const learnedCountEl = document.getElementById('learned-count');
        if (learnedCountEl) {
            learnedCountEl.innerText = masteredCount + learningCount;
        }

        // 更新进度条宽度
        const masteredFill = document.getElementById('progress-fill-mastered');
        const learningFill = document.getElementById('progress-fill-learning');

        if (masteredFill) {
            masteredFill.style.width = `${(masteredCount / total) * 100}%`;
        }
        if (learningFill) {
            learningFill.style.width = `${(learningCount / total) * 100}%`;
        }
    }

    // --- 3. 初始化与事件绑定 ---

    applySavedConfig();
    updateLearnedStats(); // 初始化统计数据
    const currentPool = updateSelectedPool();
    
    // 强制刷新位移
    setTimeout(() => updateSlotCount(currentPool.length), 100);
    setTimeout(() => document.body.classList.add('intro-finished'), 500);

    // 绑定所有输入项
    [...colorInputs, ...kInputs, ...statusInputs].forEach(input => {
        input.addEventListener('change', updateSelectedPool);
    });

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const finalPool = updateSelectedPool();
            if (finalPool.length === 0) return alert("対象の札がありません。");

            // 这一步是关键！发放凭证
            sessionStorage.setItem('trial_active', 'true'); 

            // --- 确保这里读取的是最新的 checked 状态 ---
            const configData = {
                audioOnly: audioOnlyCheck?.checked || false,
                invertedView: invertedViewCheck?.checked || false, // 确认这里是 invertedView
                poolIds: finalPool.map(p => p.standardNumber)
            };

            sessionStorage.setItem('trial_config', JSON.stringify(configData));
            
            // 保存一份到 localStorage 方便下次自动勾选
            saveUserPreferences(); 

            document.body.classList.add('page-leaving');
            setTimeout(() => { window.location.href = 'game.html'; }, 600);
        });
    }

    const navItems = document.querySelectorAll('.nav-item');
    const exitOverlay = document.getElementById('page-exit-overlay');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            
            // 如果是当前页或者是空链接，不触发动画
            if (!targetUrl || targetUrl === '#') return;

            e.preventDefault(); // 阻止立即跳转

            // 仅内容淡出，保留导航栏
            document.body.classList.add('fade-content-only');

            // 延迟跳转，等待动画完成
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 600); // 这里的 600ms 与 CSS transition 时间对应
        });
    });
});
