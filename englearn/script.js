let words = []; // 存储所有单词
let currentIndex = 0; // 当前单词索引
let knownWords = JSON.parse(localStorage.getItem("knownWords")) || [];
let order = "normal"; // 学习顺序（默认正序）

document.addEventListener("DOMContentLoaded", () => {
    loadDefaultWords(); // 页面加载时自动加载单词
    setupCanvas(); // 设置粒子动画画布
});

function loadDefaultWords() {
    fetch("words.txt")
        .then(response => response.text())
        .then(text => {
            words = text.split(/\r?\n/).map(word => word.trim()).filter(word => word.length > 0);
            if (words.length === 0) {
                alert("⚠ 默认单词文件为空！");
                return;
            }
            applyOrder();
            document.getElementById("word-box").style.display = "block";
            currentIndex = 0;
            showWord();
        })
        .catch(error => {
            console.error("加载默认单词失败:", error);
            alert("❌ 无法加载默认单词文件！");
        });
}

function applyOrder() {
    if (order === "reverse") {
        words.reverse();
    } else if (order === "random") {
        words = shuffleArray(words);
    }
}

function changeOrder() {
    order = document.getElementById("orderSelect").value;
    reloadWords();
}

function shuffleArray(array) {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function showWord() {
    if (currentIndex >= words.length) {
        alert("🎉 你已经学习完所有单词！");
        document.getElementById("word-list").innerHTML = "<p>所有单词已学习完毕！</p>";
        document.getElementById("next-btn").style.display = "none";
        return;
    }

    const word = words[currentIndex];

    // 如果单词已经学过，自动跳过
    if (knownWords.includes(word)) {
        currentIndex++;
        showWord();
        return;
    }

    document.getElementById("word-list").innerHTML = `
        <div class="word-card" id="wordCard">
            <strong>${word}</strong>
            <p>你知道这个单词吗？</p>
            <button class="known" onclick="markKnown('${word}')">✔ 知道</button>
            <button class="unknown" onclick="markUnknown('${word}')">❌ 不知道</button>
        </div>
    `;
    document.getElementById("next-btn").style.display = "none";
}

function markKnown(word) {
    knownWords.push(word);
    localStorage.setItem("knownWords", JSON.stringify(knownWords));
    explodeWord(); // 添加爆炸特效
    nextWord();
}

function markUnknown(word) {
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(word)}+meaning`;
    window.open(googleSearchUrl, "_blank");
    document.getElementById("next-btn").style.display = "block";
}

function nextWord() {
    currentIndex++;
    showWord();
}

function reloadWords() {
    knownWords = [];
    localStorage.removeItem("knownWords");
    loadDefaultWords();
}

// 粒子动画和烟花效果
const canvas = document.getElementById("fireworkCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function setupCanvas() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animateParticles();
}

function showFirework() {
    for (let i = 0; i < 5; i++) {
        createFirework();
    }
}

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 5 + 5; // 随机烟花大小
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 粒子动画逻辑
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animateParticles);
}

// 添加爆炸特效
function explodeWord() {
    const wordCard = document.getElementById("wordCard");
    wordCard.style.animation = "explode 0.5s forwards";
    setTimeout(() => {
        wordCard.style.animation = "";
    }, 500);
}

// 连击功能
let comboCount = 0;

function checkCombo() {
    comboCount++;
    if (comboCount > 1) {
        showFirework(); // 触发烟花
    }
}
