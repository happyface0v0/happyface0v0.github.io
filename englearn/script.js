document.addEventListener("DOMContentLoaded", () => {
    createParticleBackground();
});

// 粒子背景（流星 + 闪光）
function createParticleBackground() {
    const canvas = document.createElement("canvas");
    canvas.id = "particle-background";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3,
            speed: Math.random() * 2 + 0.5
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.speed;
            if (p.y > canvas.height) p.y = 0;
            ctx.fillStyle = "#0ff";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// 触发烟花 + 扭曲冲击
function markKnown(word) {
    localStorage.setItem("knownWords", JSON.stringify(word));

    let wordCard = document.querySelector(".word-card");
    wordCard.classList.add("explode");

    // 屏幕冲击
    document.body.classList.add("distort");
    setTimeout(() => document.body.classList.remove("distort"), 300);

    // 烟花效果
    showCyberFirework();

    // 按钮冲击波
    document.querySelector("button.known").classList.add("shockwave");
    setTimeout(() => document.querySelector("button.known").classList.remove("shockwave"), 300);

    setTimeout(() => {
        wordCard.remove();
        nextWord();
    }, 500);
}

// 霓虹风烟花效果
function showCyberFirework() {
    const firework = document.createElement("div");
    firework.className = "firework";
    document.body.appendChild(firework);

    firework.style.left = Math.random() * 100 + "vw";
    firework.style.top = Math.random() * 100 + "vh";
    firework.style.background = `radial-gradient(circle, rgba(0,255,255,1) 0%, rgba(0,0,0,0) 80%)`;

    setTimeout(() => firework.remove(), 1000);
}

// 随机触发多个烟花
function maybeShowCyberFireworks() {
    if (Math.random() < 0.5) {
        for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
            showCyberFirework();
        }
    }
}
