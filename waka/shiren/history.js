/**
 * history.js
 * localStorage key: 'waka_history'
 * 格式: [ { ts: timestamp, d: encoded, score, correctCount, total, maxCombo, totalTime }, ... ]
 *
 * result.js 侧需在解码数据后调用 saveHistory(encoded, data)
 */

const HISTORY_KEY = 'waka_history';

// ── 供 result.js 调用的存储函数（复制到 result.js 里）──────
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
    // 最多保留 100 条
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 100)));
}

function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch (e) { return []; }
}

function deleteHistory(ts) {
    const list = getHistory().filter(r => r.ts !== ts);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

// ── 页面渲染 ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
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

    renderList();

    document.getElementById('btn-clear-all').addEventListener('click', () => {
        if (confirm('全ての記録を削除しますか？')) {
            localStorage.removeItem(HISTORY_KEY);
            renderList();
        }
    });
    document.getElementById('empty-item').addEventListener('click', e => {
        e.preventDefault();
        const url = e.currentTarget.getAttribute('href');
        document.body.classList.add('fade-to-black');
        setTimeout(() => { window.location.href = url; }, 600);
    });
});

function renderList() {
    const list      = getHistory();
    const container = document.getElementById('history-list');
    const empty     = document.getElementById('empty-state');
    const clearBtn  = document.getElementById('btn-clear-all');

    container.innerHTML = '';

    if (list.length === 0) {
        empty.style.display    = 'flex';
        clearBtn.style.display = 'none';
        return;
    }

    empty.style.display    = 'none';
    clearBtn.style.display = 'inline-flex';

    list.forEach(record => {
        const accuracy = record.total > 0
            ? ((record.correctCount / record.total) * 100).toFixed(1)
            : 0;
        const avgTime = record.correctCount > 0
            ? (record.totalTime / record.correctCount).toFixed(2)
            : null;
        const date = new Date(record.ts);
        const dateStr = `${date.getFullYear()}/${String(date.getMonth()+1).padStart(2,'0')}/${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <a href="result.html?d=${record.d}" class="history-link">
                <div class="hi-score">${record.score.toLocaleString()}</div>
                <div class="hi-stats">
                    <span class="stat"><em>${accuracy}%</em>正解率</span>
                    <span class="stat"><em>${record.correctCount}/${record.total}</em>問</span>
                    <span class="stat"><em>${record.maxCombo}</em>最大COMBO</span>
                    ${avgTime ? `<span class="stat"><em>${avgTime}s</em>平均</span>` : ''}
                </div>
                <div class="hi-date">${dateStr}</div>
            </a>
            <button class="delete-btn" title="この記録を削除" data-ts="${record.ts}">×</button>
        `;

        item.querySelector('.delete-btn').addEventListener('click', e => {
            e.stopPropagation();
            deleteHistory(record.ts);
            item.classList.add('removing');
            setTimeout(() => renderList(), 300);
        });

        // 記録クリック時も同款アニメーション
        item.querySelector('.history-link').addEventListener('click', e => {
            e.preventDefault();
            const url = e.currentTarget.getAttribute('href');
            document.body.classList.add('fade-content-only');
            setTimeout(() => { window.location.href = url; }, 600);
        });

        container.appendChild(item);
    });
}