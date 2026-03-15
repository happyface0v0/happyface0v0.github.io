/**
 * result.js — URL参数版
 * URL格式: result.html?d=<base64url>
 */

// ── 编解码 ───────────────────────────────────────────────────

const JUDGE_CHAR = { godspeed: 'g', flash: 'f', correct: 'c', slow: 's', wrong: 'w' };
const CHAR_JUDGE = { g: 'godspeed', f: 'flash', c: 'correct', s: 'slow', w: 'wrong' };

function pad(n, len, radix = 36) {
    return n.toString(radix).padStart(len, '0');
}

/**
 * 编码结果数据为URL参数（供 game.js 调用，需复制过去）
 * 格式: score|correctCount|total|maxCombo|totalTime*100|logStr|cfgStr
 * 每条log: stdNum(2位base36) + judge(1字符) + time*100(4位base36或"----") + isCorrect(0/1)
 */
function encodeResultToURL(data) {
    const { score, correctCount, total, maxCombo, totalTime, log, trialConfig } = data;

    const logStr = log.map(entry => {
        const stdPart  = pad(entry.poem.standardNumber, 2);
        const judPart  = JUDGE_CHAR[entry.judge] || 'w';
        const timePart = (entry.time >= 0) ? pad(Math.round(entry.time * 100), 4) : '----';
        const corPart  = entry.isCorrect ? '1' : '0';
        return stdPart + judPart + timePart + corPart;
    }).join(';');

    const cfg    = trialConfig || {};
    const cfgStr = btoa(
        (cfg.audioOnly ? '1' : '0') +
        (cfg.invertedView ? '1' : '0') +
        '|' + (cfg.poolIds || []).join(',')
    );

    const main = [score, correctCount, total, maxCombo, Math.round((totalTime || 0) * 100), logStr, cfgStr].join('|');
    return btoa(unescape(encodeURIComponent(main))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * 从URL参数解码结果数据
 */
function decodeResultFromURL(encoded) {
    try {
        const raw   = decodeURIComponent(escape(atob(encoded.replace(/-/g, '+').replace(/_/g, '/'))));
        const parts = raw.split('|');

        const score        = parseInt(parts[0]);
        const correctCount = parseInt(parts[1]);
        const total        = parseInt(parts[2]);
        const maxCombo     = parseInt(parts[3]);
        const totalTime    = parseInt(parts[4]) / 100;
        const logStr       = parts[5] || '';
        const cfgStr       = parts[6] || '';

        const log = logStr.split(';').map(s => {
            if (s.length < 8) return null;
            const stdNum    = parseInt(s.slice(0, 2), 36);
            const judge     = CHAR_JUDGE[s[2]] || 'wrong';
            const timePart  = s.slice(3, 7);
            const time      = (timePart === '----') ? -1 : parseInt(timePart, 36) / 100;
            const isCorrect = s[7] === '1';
            const poem      = mainData.find(p => p.standardNumber === stdNum) || null;
            return poem ? { poem, judge, time, isCorrect } : null;
        }).filter(Boolean);

        let trialConfig = {};
        if (cfgStr) {
            try {
                const cfgRaw = atob(cfgStr).split('|');
                trialConfig  = {
                    audioOnly:    cfgRaw[0]?.[0] === '1',
                    invertedView: cfgRaw[0]?.[1] === '1',
                    poolIds:      cfgRaw[1] ? cfgRaw[1].split(',').map(Number).filter(Boolean) : []
                };
            } catch (e) {}
        }

        return { score, correctCount, total, maxCombo, totalTime, log, trialConfig };
    } catch (e) {
        console.error('URL decode failed:', e);
        return null;
    }
}

// ── 学習状態管理 ─────────────────────────────────────────────

const STATUS_CYCLE = ['none', 'learning', 'mastered'];

function getSavedStatus(stdNum) {
    return JSON.parse(localStorage.getItem('waka_progress') || '{}')[stdNum] || 'none';
}

function saveStatus(stdNum, status) {
    const data = JSON.parse(localStorage.getItem('waka_progress') || '{}');
    if (status && status !== 'none') { data[stdNum] = status; } else { delete data[stdNum]; }
    localStorage.setItem('waka_progress', JSON.stringify(data));
}

function toggleStatus(stdNum) {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(getSavedStatus(stdNum)) + 1) % STATUS_CYCLE.length];
    saveStatus(stdNum, next);

    document.querySelectorAll(`.status-marker[data-std="${stdNum}"]`).forEach(marker => {
        STATUS_CYCLE.forEach(s => marker.classList.remove(`status-${s}`));
        if (next !== 'none') marker.classList.add(`status-${next}`);
    });
    document.querySelectorAll(`.wrong-card[data-std="${stdNum}"]`).forEach(card => {
        STATUS_CYCLE.forEach(s => card.classList.remove(`status-${s}`));
        if (next !== 'none') card.classList.add(`status-${next}`);
    });
}

// ── メインロジック ───────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    const encoded = new URLSearchParams(window.location.search).get('d');
    if (!encoded) { window.location.href = 'index.html'; return; }

    const data = decodeResultFromURL(encoded);
    if (!data)  { window.location.href = 'index.html'; return; }

    const { score, correctCount, total, maxCombo, totalTime, log, trialConfig } = data;

    // 历史记录存储（只在首次加载时存，防止刷新重复写入）
    if (!sessionStorage.getItem(`saved_${encoded.slice(0, 16)}`)) {
        saveHistory(encoded, { score, correctCount, total, maxCombo, totalTime });
        sessionStorage.setItem(`saved_${encoded.slice(0, 16)}`, '1');
    }

    // ① スコアカウントアップ
    animateCount(document.getElementById('final-score'), 0, score, 1200);

    // ② サマリー
    setText('accuracy',    total > 0 ? `${((correctCount / total) * 100).toFixed(1)}%` : '0%');
    setText('max-combo',   maxCombo);
    setText('avg-time',    correctCount > 0 ? `${(totalTime / correctCount).toFixed(2)}s` : '—');
    setText('total-count', `${correctCount}/${total}`);

    // ③ 判定内訳バー
    const bd = { godspeed: 0, flash: 0, correct: 0, slow: 0, wrong: 0 };
    log.forEach(e => { if (e.judge in bd) bd[e.judge]++; });
    const maxBd = Math.max(...Object.values(bd), 1);
    setTimeout(() => {
        Object.keys(bd).forEach(key => {
            const bar = document.getElementById(`bar-${key}`);
            const cnt = document.getElementById(`cnt-${key}`);
            if (bar) bar.style.width = `${(bd[key] / maxBd) * 100}%`;
            if (cnt) cnt.textContent = bd[key];
        });
    }, 600);

    // ④ お手つきの歌
    const wrongPoems = log.filter(e => !e.isCorrect).map(e => e.poem);
    const wrongList  = document.getElementById('wrong-list');
    document.getElementById('wrong-badge').textContent = `${wrongPoems.length}首`;

    if (wrongPoems.length === 0) {
        wrongList.innerHTML = `<div class="no-wrong">お手つきなし！完璧な試練でした。</div>`;
    } else {
        wrongPoems.forEach(poem => {
            if (!poem) return;
            const kData     = kimarijiMap.get(poem.first_half + poem.second_half);
            const kamiHtml  = highlightKimariji(poem.first_half,  kData?.kimarijiFirstHalf,  'left');
            const shimoHtml = highlightKimariji(poem.second_half, kData?.kimarijiSecondHalf, 'right');
            const status    = getSavedStatus(poem.standardNumber);

            const card = document.createElement('div');
            card.className = `wrong-card${status !== 'none' ? ` status-${status}` : ''}`;
            card.dataset.std = poem.standardNumber;
            card.innerHTML = `
                <div class="wc-marker status-action-zone" title="学習状態を切り替え">
                    <div class="status-marker${status !== 'none' ? ` status-${status}` : ''}" data-std="${poem.standardNumber}"></div>
                </div>
                <div class="wc-num color-${poem.color}">${poem.index}</div>
                <div class="wc-kami">${kamiHtml}</div>
                <div class="wc-shimo">${shimoHtml}</div>
            `;
            card.querySelector('.wc-marker').addEventListener('click', () => toggleStatus(poem.standardNumber));
            wrongList.appendChild(card);
        });
    }

    // ⑤ 全問詳細ログ
    const tbody   = document.getElementById('log-tbody');
    const judgeJP = { godspeed: '神速', flash: '閃光', correct: '正解', slow: '遅すぎ', wrong: 'お手つき' };

    log.forEach((entry, i) => {
        if (!entry?.poem) return;
        const { poem, judge, time, isCorrect } = entry;
        const tr        = document.createElement('tr');
        if (!isCorrect) tr.classList.add('row-wrong');

        const timeStr   = time >= 0 ? `${time.toFixed(2)}s` : '—';
        const kData     = kimarijiMap.get(poem.first_half + poem.second_half);
        const kamiHtml  = highlightKimariji(poem.first_half,  kData?.kimarijiFirstHalf,  'left');
        const shimoHtml = highlightKimariji(poem.second_half, kData?.kimarijiSecondHalf, 'right');
        const status    = getSavedStatus(poem.standardNumber);

        tr.innerHTML = `
            <td>${i + 1}</td>
            <td class="td-marker">
                <div class="status-action-zone" title="学習状態を切り替え">
                    <div class="status-marker${status !== 'none' ? ` status-${status}` : ''}" data-std="${poem.standardNumber}"></div>
                </div>
            </td>
            <td>${kamiHtml}</td>
            <td>${shimoHtml}</td>
            <td><span class="judge-badge ${judge}">${judgeJP[judge] || judge}</span></td>
            <td class="log-time">${timeStr}</td>
        `;
        tr.querySelector('.status-action-zone').addEventListener('click', e => {
            e.stopPropagation();
            toggleStatus(poem.standardNumber);
        });
        tbody.appendChild(tr);
    });

    // ⑥ ログ折りたたみ
    const logToggle  = document.getElementById('log-toggle');
    const logWrapper = document.getElementById('log-table-wrapper');
    logToggle?.addEventListener('click', () => {
        const isOpen = logWrapper.classList.toggle('open');
        logToggle.classList.toggle('open', isOpen);
    });

    // ⑦ ボタン
    document.getElementById('btn-retry')?.addEventListener('click', () => {
        sessionStorage.setItem('trial_active', 'true');
        sessionStorage.setItem('trial_config', JSON.stringify(trialConfig));
        fadeOut(() => { window.location.href = 'game.html'; });
    });
    document.getElementById('btn-setup')?.addEventListener('click', () => {
        fadeOut(() => { window.location.href = 'index.html'; });
    });
    document.getElementById('btn-share')?.addEventListener('click', () => {
        const btn = document.getElementById('btn-share');
        btn.disabled = true;
        btn.textContent = '生成中...';
        generateShareImage(data).finally(() => {
            btn.disabled = false;
            btn.textContent = '画像で共有';
        });
    });

    document.getElementById('btn-list')?.addEventListener('click', () => {
        fadeOut(() => { window.location.href = '../index.html'; });
    });

    // 入場アニメーション開始
    requestAnimationFrame(() => {
        setTimeout(() => document.body.classList.add('page-loaded'), 50);
    });
});

// ── ユーティリティ ───────────────────────────────────────────

function highlightKimariji(text, kimariji, side) {
    if (!kimariji) return text;
    const prefix   = kimariji.slice(0, -1);
    const lastChar = kimariji.slice(-1);
    return text.replace(kimariji,
        `<span class="kimariji-highlight ${side}">${prefix}<span class="last-char">${lastChar}</span></span>`
    );
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function animateCount(el, from, to, duration) {
    if (!el) return;
    const start = performance.now();
    (function step(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(from + (to - from) * (1 - Math.pow(1 - p, 4))).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
    })(performance.now());
}

function fadeOut(callback) {
    document.body.classList.add('page-leaving');
    setTimeout(callback, 500);
}

// ── ページ入場 & Nav ─────────────────────────────────────────

// 主页同款：100ms後に page-loaded を付けて入場アニメーション発火
setTimeout(() => document.body.classList.add('page-loaded'), 100);

// Nav クリック：コンテナだけフェードして遷移
document.querySelectorAll('.nav-item').forEach(item => {
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

// ── 历史记录存储 ─────────────────────────────────────────────

const HISTORY_KEY = 'waka_history';

function saveHistory(encoded, data) {
    const list = getHistory();
    list.unshift({
        ts:           Date.now(),
        d:            encoded,
        score:        data.score,
        correctCount: data.correctCount,
        total:        data.total,
        maxCombo:     data.maxCombo,
        totalTime:    data.totalTime
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 100)));
}

function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch (e) { return []; }
}