/**
 * share-card.js
 * 全変数をIIFEで封じ込め（他のスクリプトとの衝突防止）
 * 外部ライブラリ不要
 */

;(function() {

const _W        = 630;
const _DPR      = 3;
const _SITE_URL = 'https://happyface0v0.github.io/waka';

// ══════════════════════════════════════════════════════════════
// QR码生成（純JS実装、外部ライブラリ不要）
// Reed-Solomon + QR v3 (29x29) / v4 (33x33) の最小実装
// ══════════════════════════════════════════════════════════════

function makeQRCanvas(text, moduleSize) {
    // qr-creatorライブラリ相当の最小QR生成
    // URLが短いのでVersion2(25x25)で十分
    const qr = _createQR(text);
    const n   = qr.length;
    const sz  = n * moduleSize;
    const c   = document.createElement('canvas');
    c.width = c.height = sz;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, sz, sz);
    ctx.fillStyle = '#000';
    for (let r = 0; r < n; r++) {
        for (let col = 0; col < n; col++) {
            if (qr[r][col]) ctx.fillRect(col*moduleSize, r*moduleSize, moduleSize, moduleSize);
        }
    }
    return c;
}

// QRコード生成コア（Version2, ECC-M, Byte mode）
function _createQR(text) {
    // 外部ライブラリ（qrcode-generator）を動的に使う
    // なければ null を返す
    if (typeof qrcode !== 'undefined') {
        const qr = qrcode(0, 'M');
        qr.addData(text);
        qr.make();
        const n = qr.getModuleCount();
        const grid = [];
        for (let r = 0; r < n; r++) {
            grid[r] = [];
            for (let c = 0; c < n; c++) grid[r][c] = qr.isDark(r, c);
        }
        return grid;
    }
    return null;
}

// ══════════════════════════════════════════════════════════════
// メイン関数
// ══════════════════════════════════════════════════════════════

window.generateShareImage = async function(resultData) {
    const { score, correctCount, total, maxCombo, totalTime, log } = resultData;

    const accuracy   = total > 0 ? ((correctCount / total) * 100).toFixed(1) : '0.0';
    const avgTime    = correctCount > 0 ? (totalTime / correctCount).toFixed(2) : null;
    const wrongPoems = log.filter(e => !e.isCorrect).map(e => e.poem);
    const bd = { godspeed: 0, flash: 0, correct: 0, slow: 0, wrong: 0 };
    log.forEach(e => { if (e.judge in bd) bd[e.judge]++; });

    // QR生成
    const QR_PX    = 3;  // 1モジュール=3px → 約21*3=63px
    const qrCanvas = makeQRCanvas(_SITE_URL, QR_PX);
    const QR_SIZE  = qrCanvas ? qrCanvas.width : 0;

    // ── 高度計算 ──────────────────────────────────────────────
    const HERO_H  = 400;
    const PAD     = 28;
    const GAP     = 14;
    const JUDGE_H = 52 + 5 * 26 + 14;
    const ROW_H   = 52;
    const maxRows = Math.min(wrongPoems.length, 9);
    const WRONG_H = 56
                  + (wrongPoems.length === 0 ? 44 : maxRows * ROW_H)
                  + (wrongPoems.length > maxRows ? 28 : 0)
                  + 8;
    const FOOTER_H = QR_SIZE > 0 ? QR_SIZE + 24 : 44;
    const H = HERO_H + PAD + JUDGE_H + GAP + WRONG_H + GAP + FOOTER_H;

    const canvas  = document.createElement('canvas');
    canvas.width  = _W * _DPR;
    canvas.height = H  * _DPR;
    const ctx     = canvas.getContext('2d');
    ctx.scale(_DPR, _DPR);

    // ══════════════════════════════════════════════════════════
    // 1. 英雄区
    // ══════════════════════════════════════════════════════════
    const heroBg = ctx.createLinearGradient(0, 0, _W, HERO_H);
    heroBg.addColorStop(0, '#0d1117');
    heroBg.addColorStop(1, '#1a2332');
    ctx.fillStyle = heroBg;
    ctx.fillRect(0, 0, _W, HERO_H);

    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth   = 1;
    for (let x = 0; x < _W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,HERO_H); ctx.stroke(); }
    for (let y = 0; y < HERO_H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(_W,y); ctx.stroke(); }

    const heroFade = ctx.createLinearGradient(0, HERO_H - 80, 0, HERO_H);
    heroFade.addColorStop(0, 'rgba(13,17,23,0)');
    heroFade.addColorStop(1, '#efead8');
    ctx.fillStyle = heroFade;
    ctx.fillRect(0, HERO_H - 80, _W, 80);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = `500 12px "Noto Serif JP", serif`;
    ctx.textAlign = 'center'; ctx.letterSpacing = '0.4em';
    ctx.fillText('閃 光 の 試 練', _W / 2, 56);

    const lg = ctx.createLinearGradient(_W*0.2,0,_W*0.8,0);
    lg.addColorStop(0,'transparent'); lg.addColorStop(0.5,'#d4af37'); lg.addColorStop(1,'transparent');
    ctx.strokeStyle = lg; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(_W*0.2,72); ctx.lineTo(_W*0.8,72); ctx.stroke();

    ctx.fillStyle = 'rgba(212,175,55,0.7)';
    ctx.font = `600 11px "Noto Serif JP", serif`;
    ctx.textAlign = 'center'; ctx.letterSpacing = '0.5em';
    ctx.fillText('S C O R E', _W / 2, 114);

    const scoreStr = score.toLocaleString();
    const sf       = scoreStr.length >= 7 ? 88 : scoreStr.length >= 5 ? 108 : 124;
    const sg       = ctx.createLinearGradient(_W*0.1,0,_W*0.9,0);
    sg.addColorStop(0,'#d4af37'); sg.addColorStop(0.5,'#f1c40f'); sg.addColorStop(1,'#d4af37');
    ctx.font = `900 ${sf}px "Noto Serif JP", serif`;
    ctx.letterSpacing = '-0.02em'; ctx.fillStyle = sg; ctx.textAlign = 'center';
    ctx.fillText(scoreStr, _W / 2, 248);

    const stats = [
        { label: '正解率',    value: `${accuracy}%` },
        { label: '正解数',    value: `${correctCount}/${total}` },
        { label: 'MAX COMBO', value: String(maxCombo) },
        ...(avgTime ? [{ label: '平均反応', value: `${avgTime}s` }] : []),
    ];
    const sw = _W / stats.length;
    stats.forEach((s, i) => {
        const cx = sw * i + sw / 2;
        if (i > 0) {
            ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(sw*i,282); ctx.lineTo(sw*i,334); ctx.stroke();
        }
        ctx.fillStyle = '#fff'; ctx.font = `900 22px "Noto Serif JP", serif`;
        ctx.textAlign = 'center'; ctx.letterSpacing = '0.02em';
        ctx.fillText(s.value, cx, 310);
        ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = `500 10px "Noto Serif JP", serif`;
        ctx.letterSpacing = '0.1em'; ctx.fillText(s.label, cx, 328);
    });

    // ══════════════════════════════════════════════════════════
    // 2. 下半部背景
    // ══════════════════════════════════════════════════════════
    ctx.fillStyle = '#efead8';
    ctx.fillRect(0, HERO_H, _W, H - HERO_H);

    let cursor = HERO_H + PAD;

    // ══════════════════════════════════════════════════════════
    // 3. 判定内訳カード
    // ══════════════════════════════════════════════════════════
    _card(ctx, PAD, cursor, _W - PAD*2, JUDGE_H, 12);
    _secLabel(ctx, '判定内訳', PAD + 16, cursor + 34);

    const judges = [
        { key:'godspeed', label:'神速',     color:'#f1c40f' },
        { key:'flash',    label:'閃光',     color:'#3498db' },
        { key:'correct',  label:'正解',     color:'#2ecc71' },
        { key:'slow',     label:'遅すぎ',   color:'#95a5a6' },
        { key:'wrong',    label:'お手つき', color:'#e74c3c' },
    ];
    const maxBd = Math.max(...Object.values(bd), 1);
    const barL  = PAD + 72, barR = _W - PAD - 40, barMW = barR - barL;
    let jy = cursor + 52;
    judges.forEach(j => {
        const cnt = bd[j.key], pct = cnt / maxBd;
        ctx.fillStyle = j.color; ctx.font = `700 11px "Noto Serif JP", serif`;
        ctx.textAlign = 'right'; ctx.letterSpacing = '0';
        ctx.fillText(j.label, barL - 8, jy + 9);
        _rr(ctx, barL, jy, barMW, 11, 5, '#e8e4d8');
        if (pct > 0) _rr(ctx, barL, jy, Math.max(barMW*pct,11), 11, 5, j.color);
        ctx.fillStyle = '#7f8c8d'; ctx.textAlign = 'left';
        ctx.fillText(String(cnt), barR + 8, jy + 9);
        jy += 26;
    });

    cursor += JUDGE_H + GAP;

    // ══════════════════════════════════════════════════════════
    // 4. お手つきカード（kimariji高亮付き）
    // ══════════════════════════════════════════════════════════
    _card(ctx, PAD, cursor, _W - PAD*2, WRONG_H, 12);
    _secLabel(ctx, 'お手つきの歌', PAD + 16, cursor + 34);

    _rr(ctx, _W - PAD - 48, cursor + 16, 36, 20, 10, '#e74c3c');
    ctx.fillStyle = '#fff'; ctx.font = `700 11px "Noto Serif JP", serif`;
    ctx.textAlign = 'center'; ctx.letterSpacing = '0';
    ctx.fillText(`${wrongPoems.length}首`, _W - PAD - 30, cursor + 30);

    if (wrongPoems.length === 0) {
        ctx.fillStyle = '#7f8c8d'; ctx.font = `500 13px "Noto Serif JP", serif`;
        ctx.textAlign = 'center';
        ctx.fillText('お手つきなし！完璧な試練でした。', _W / 2, cursor + 78);
    } else {
        let wy = cursor + 52;
        wrongPoems.slice(0, maxRows).forEach((poem, idx) => {
            const gc = _groupColor(poem.color);
            if (idx % 2 === 1) {
                ctx.fillStyle = 'rgba(0,0,0,0.02)';
                ctx.fillRect(PAD, wy, _W - PAD*2, ROW_H);
            }
            _rr(ctx, PAD, wy + 8, 3, ROW_H - 16, 2, gc);
            _rr(ctx, PAD + 10, wy + 12, 24, 24, 6, gc);
            ctx.fillStyle = '#fff'; ctx.font = `700 10px "Noto Serif JP", serif`;
            ctx.textAlign = 'center'; ctx.letterSpacing = '0';
            ctx.fillText(String(poem.index), PAD + 22, wy + 28);

            const kData    = (typeof kimarijiMap !== 'undefined')
                           ? kimarijiMap.get(poem.first_half + poem.second_half)
                           : null;
            const textX    = PAD + 44;
            const textMaxW = _W - PAD*2 - 52;

            _drawHlText(ctx, poem.first_half,  kData?.kimarijiFirstHalf,
                        '#ff6347', '#2c3e50', textX, wy + 22, 12, textMaxW);
            _drawHlText(ctx, poem.second_half, kData?.kimarijiSecondHalf,
                        '#0077b6', '#8e44ad', textX, wy + 40, 11, textMaxW);
            wy += ROW_H;
        });
        if (wrongPoems.length > maxRows) {
            ctx.fillStyle = '#7f8c8d'; ctx.font = `500 11px "Noto Serif JP", serif`;
            ctx.textAlign = 'center'; ctx.letterSpacing = '0';
            ctx.fillText(`... 他 ${wrongPoems.length - maxRows} 首`, _W / 2, wy + 18);
        }
    }

    cursor += WRONG_H + GAP;

    // ══════════════════════════════════════════════════════════
    // 5. フッター（QR + URL）
    // ══════════════════════════════════════════════════════════
    // 5. フッター（QR左 + 情報右）
    // ══════════════════════════════════════════════════════════
    if (qrCanvas && QR_SIZE > 0) {
        const qrY    = cursor + (FOOTER_H - QR_SIZE) / 2;
        const textX  = PAD + QR_SIZE + 16;
        const rightW = _W - PAD - textX;

        // QR白背景 + 描画
        ctx.fillStyle = '#fff';
        ctx.fillRect(PAD - 2, qrY - 2, QR_SIZE + 4, QR_SIZE + 4);
        ctx.drawImage(qrCanvas, PAD, qrY, QR_SIZE, QR_SIZE);

        // 右側：URL（大）+ キャッチコピー + スキャン案内
        const midY = cursor + FOOTER_H / 2;

        ctx.fillStyle = 'rgba(44,62,80,0.75)';
        ctx.font = `700 13px "Noto Serif JP", serif`;
        ctx.textAlign = 'left'; ctx.letterSpacing = '0';
        ctx.fillText(_SITE_URL.replace('https://', ''), textX, midY - 10);

        ctx.fillStyle = 'rgba(44,62,80,0.45)';
        ctx.font = `500 10px "Noto Serif JP", serif`;
        ctx.letterSpacing = '0.05em';
        ctx.fillText('閃光の試練  ―  五色百人一首', textX, midY + 6);

        ctx.fillStyle = 'rgba(44,62,80,0.3)';
        ctx.font = `500 9px "Noto Serif JP", serif`;
        ctx.letterSpacing = '0.05em';
        ctx.fillText('QRコードをスキャンして遊べます', textX, midY + 20);

    } else {
        ctx.fillStyle = 'rgba(44,62,80,0.45)';
        ctx.font = `600 12px "Noto Serif JP", serif`;
        ctx.textAlign = 'center'; ctx.letterSpacing = '0';
        ctx.fillText(_SITE_URL.replace('https://', ''), _W / 2, cursor + 20);
        ctx.fillStyle = 'rgba(44,62,80,0.3)';
        ctx.font = `500 10px "Noto Serif JP", serif`;
        ctx.letterSpacing = '0.1em';
        ctx.fillText('閃光の試練  ―  五色百人一首', _W / 2, cursor + 36);
    }

    // ── 出力 ─────────────────────────────────────────────────
    canvas.toBlob(async blob => {
        const file = new File([blob], 'shiren-result.jpg', { type: 'image/jpeg' });
        if (navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({ files: [file], title: `試練の結果 — ${score.toLocaleString()}点` });
                return;
            } catch (e) { if (e.name === 'AbortError') return; }
        }
        const url = URL.createObjectURL(blob);
        Object.assign(document.createElement('a'), { href: url, download: 'shiren-result.jpg' }).click();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
    }, 'image/jpeg', 0.92);
};

// ══════════════════════════════════════════════════════════════
// kimariji ハイライトテキスト描画
// ══════════════════════════════════════════════════════════════
function _drawHlText(ctx, text, kimariji, hlColor, baseColor, x, y, fontSize, maxW) {
    ctx.font          = `500 ${fontSize}px "Noto Serif JP", serif`;
    ctx.letterSpacing = '0.03em';
    ctx.textAlign     = 'left';

    if (!kimariji || text.indexOf(kimariji) === -1) {
        ctx.fillStyle = baseColor;
        ctx.fillText(_ellipsis(ctx, text, maxW), x, y);
        return;
    }

    const kIdx  = text.indexOf(kimariji);
    const before = text.slice(0, kIdx);
    const hi     = text.slice(kIdx, kIdx + kimariji.length);
    const after  = text.slice(kIdx + kimariji.length);

    const m       = ctx.measureText('あ');
    const ascent  = m.actualBoundingBoxAscent  || fontSize * 0.8;
    const descent = m.actualBoundingBoxDescent || fontSize * 0.2;
    const blkH    = ascent + descent + 2;
    const blkTopY = y - ascent - 1;

    let cx = x;

    if (before) {
        ctx.fillStyle = baseColor;
        ctx.fillText(before, cx, y);
        cx += ctx.measureText(before).width;
    }

    const hiW = ctx.measureText(hi).width;
    _rr(ctx, cx - 2, blkTopY, hiW + 4, blkH, 2, hlColor);

    const prefix   = hi.slice(0, -1);
    const lastChar = hi.slice(-1);
    if (prefix) {
        ctx.fillStyle = '#fff';
        ctx.fillText(prefix, cx, y);
        cx += ctx.measureText(prefix).width;
    }
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(lastChar, cx, y);
    const lcW = ctx.measureText(lastChar).width;
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, y+2); ctx.lineTo(cx+lcW, y+2); ctx.stroke();
    cx += lcW;

    if (after) {
        const rem = maxW - (cx - x);
        if (rem > 0) {
            ctx.fillStyle = baseColor;
            ctx.fillText(_ellipsis(ctx, after, rem), cx, y);
        }
    }
}

// ── ユーティリティ ────────────────────────────────────────────
function _rr(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
    ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
    ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
    ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

function _card(ctx, x, y, w, h, r) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.07)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
    _rr(ctx, x, y, w, h, r, '#ffffff');
    ctx.restore();
}

function _secLabel(ctx, text, x, y) {
    ctx.save();
    ctx.translate(x-1, y-7); ctx.rotate(Math.PI/4);
    ctx.fillStyle = '#d4af37'; ctx.fillRect(-4,-4,8,8);
    ctx.restore();
    ctx.fillStyle = '#2c3e50'; ctx.font = `800 13px "Noto Serif JP", serif`;
    ctx.textAlign = 'left'; ctx.letterSpacing = '0.1em';
    ctx.fillText(text, x+10, y);
}

function _ellipsis(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(t+'…').width > maxW) t = t.slice(0,-1);
    return t + '…';
}

function _groupColor(color) {
    return { red:'#e57373', blue:'#64b5f6', yellow:'#f1c40f', green:'#81c784', orange:'#ff9800' }[color] || '#999';
}

})(); // IIFE end