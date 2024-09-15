// 获取用户的系统语言
const userLanguage = navigator.language || navigator.userLanguage;

// 语言映射
const translations = {
    en: {
        title: "Welcome to my website",
        description: "This is a simple and elegant start page.",
        button: "Start Exploring"
    },
    zh: {
        title: "欢迎来到我的网站",
        description: "这是一个简洁而优雅的开始界面。",
        button: "开始探索"
    }
};

// 设置页面语言
function setLanguage(lang) {
    const title = document.getElementById("heroTitle");
    const description = document.getElementById("heroDesc");
    const button = document.getElementById("startButton");

    title.textContent = translations[lang].title;
    description.textContent = translations[lang].description;
    button.textContent = translations[lang].button;
}

// 检查系统语言并设置
if (userLanguage.includes("zh")) {
    setLanguage("zh");
} else {
    setLanguage("en");
}

// 语言选择器
document.getElementById("language").addEventListener("change", function() {
    setLanguage(this.value);
});
