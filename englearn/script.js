let words = []; // 存储所有单词
let currentIndex = 0; // 当前单词索引
let knownWords = JSON.parse(localStorage.getItem("knownWords")) || [];
let order = "normal"; // 学习顺序（默认正序）

document.addEventListener("DOMContentLoaded", () => {
    loadDefaultWords(); // 页面加载时自动加载单词
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
        <div class="word-card">
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
    alert(`🎉 你已学会 ${word} ！`);
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
