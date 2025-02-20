let words = [];
let currentIndex = 0;
let knownWords = JSON.parse(localStorage.getItem("knownWords")) || [];
let order = "normal";
let combo = 0;

document.addEventListener("DOMContentLoaded", () => {
    loadDefaultWords();
    initParticleAnimation();
});

function loadDefaultWords() {
    fetch("words.txt")
        .then(response => response.text())
        .then(text => {
            words = text.split(/\r?\n/).map(word => word.trim()).filter(word => word.length > 0);
            applyOrder();
            document.getElementById("word-box").style.display = "block";
            currentIndex = 0;
            showWord();
        });
}

function applyOrder() {
    if (order === "reverse") words.reverse();
    else if (order === "random") words = shuffleArray(words);
}

function changeOrder() {
    order = document.getElementById("orderSelect").value;
    reloadWords();
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showWord() {
    if (currentIndex >= words.length) {
        document.getElementById("word-list").innerHTML = "<p>🎉 所有单词已学习完毕！</p>";
        return;
    }
    let word = words[currentIndex];

    if (knownWords.includes(word)) {
        currentIndex++;
        showWord();
        return;
    }

    document.getElementById("word-list").innerHTML = `
        <div class="word-card">
            <strong id="word-text">${word}</strong>
            <p>你知道这个单词吗？</p>
            <button class="known" onclick="markKnown('${word}')">✔ 知道</button>
            <button class="unknown" onclick="markUnknown('${word}')">❌ 不知道</button>
        </div>
    `;
}

function markKnown(word) {
    knownWords.push(word);
    localStorage.setItem("knownWords", JSON.stringify(knownWords));

    document.getElementById("word-text").classList.add("explode");
    document.body.classList.add("shake");

    combo++;
    if (Math.random() < 0.5) showFirework();

    setTimeout(() => {
        document.body.classList.remove("shake");
        nextWord();
    }, 300);
}

function markUnknown(word) {
    window.open(`https://www.google.com/search?q=${word}+meaning`, "_blank");
}

function nextWord() {
    currentIndex++;
    showWord();
}

/* 🎆 烟花特效 */
function showFirework() {
    let canvas = document.getElementById("fireworkCanvas");
    let ctx = canvas.getContext("2d");

    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height / 2;
    
    ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

/* ✨ 粒子背景 */
function initStarfield() {
    let canvas = document.getElementById("particleCanvas");
    let ctx = canvas.getContext("2d");
    let w, h, stars = [];
    const numStars = 5000; // 星星数量
    let speed = 50; // 飞船前进速度
    let angleX = 0, angleY = 0; // 旋转角度

    function resize() {
        canvas.width = w = window.innerWidth;
        canvas.height = h = window.innerHeight;
        stars = [];
        for (let i = 0; i < numStars; i++) {
            let x = (Math.random() - 0.5) * 10000;
            let y = (Math.random() - 0.5) * 10000;
            let z = Math.random() * 5000 + 500;
            stars.push({x, y, z});
        }
    }

    function updateStars() {
        angleX += (Math.random() - 0.5) * 0.005;
        angleY += (Math.random() - 0.5) * 0.005;

        ctx.clearRect(0, 0, w, h);

        for (let star of stars) {
            // 模拟飞船前进
            star.z -= speed;
            if (star.z < 0) {
                star.x = (Math.random() - 0.5) * 10000;
                star.y = (Math.random() - 0.5) * 10000;
                star.z = 5000;
            }

            // 3D 旋转（让飞船摇摆）
            let tempX = star.x * Math.cos(angleY) - star.z * Math.sin(angleY);
            let tempZ = star.x * Math.sin(angleY) + star.z * Math.cos(angleY);
            let tempY = star.y * Math.cos(angleX) - tempZ * Math.sin(angleX);
            let finalZ = star.y * Math.sin(angleX) + tempZ * Math.cos(angleX);

            // 透视投影
            if (finalZ > 0) {
                scale = 1000 / finalZ;
            } else {
                scale = 0; // 或者设置为其他合适的值，比如一个默认的缩放比例
            }
            let screenX = tempX * scale + w / 2;
            let screenY = tempY * scale + h / 2;

            // 计算星星亮度
            let brightness = Math.max(0, 255 - (finalZ / 5000) * 255);
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;

            // 绘制星星（近的星星更大）
            ctx.beginPath();
            ctx.arc(screenX, screenY, Math.max(0, scale * 2), 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(updateStars);
    }

    window.addEventListener("resize", resize);
    resize();
    updateStars();
}

// 在页面加载后启动星空背景
document.addEventListener("DOMContentLoaded", () => {
    initStarfield();
});
