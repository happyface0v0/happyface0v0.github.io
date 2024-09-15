const translations = {
    en: {
        navAboutMe: "About Me",
        navMyMission: "My Mission",
        navMyProjects: "My Projects",
        aboutMeTitle: "About Me",
        aboutMeText: "Welcome to my personal website! This is a space to showcase my creations, projects, and personal interests. Whether you're here to learn about my latest work or are interested in my projects, I hope you find what you're looking for.",
        myMissionTitle: "My Mission",
        myMissionText: "My mission is to share my creations and ideas, and to engage with people around the world. I am passionate about creating interesting and useful content that I hope will inspire and assist you.",
        myProjectsTitle: "My Projects",
        myProjectsText: "Game Development: I am working on a unique game that explores the combination of mechanical and natural elements, providing a novel gaming experience.<br>Website Design: I design and maintain this personal website to share my projects and achievements.",
        contactTitle: "Contact Me",
        contactText: "If you have any questions or suggestions about my projects or want to discuss collaboration, please contact me through the following:<br>Email: Timothyf20222022@outlook.com<br>I look forward to hearing from you!",
        footerText: "© 2024 My Company",
        resetButton: "Reset Language"
    },
    zh: {
        navAboutMe: "关于我",
        navMyMission: "我的使命",
        navMyProjects: "我的项目",
        aboutMeTitle: "关于我",
        aboutMeText: "欢迎来到我的个人网站！这是一个展示我的创作、项目和个人兴趣的空间。无论你是来这里了解我的最新工作，还是对我的项目感兴趣，希望你能找到你所需的内容。",
        myMissionTitle: "我的使命",
        myMissionText: "我的使命是分享我的创作和想法，与世界各地的人们交流。我热衷于创造有趣和有用的内容，希望这些能为你带来灵感和帮助。",
        myProjectsTitle: "我的项目",
        myProjectsText: "游戏开发：我正在开发一个独特的游戏，探索机械与自然的结合，带来新颖的游戏体验。<br>网站设计：我设计和维护这个个人网站，分享我的项目和成果。",
        contactTitle: "联系我",
        contactText: "如果你对我的项目有任何问题或建议，或者想要交流合作，请通过以下方式联系我：<br>电子邮件：Timothyf20222022@outlook.com<br>期待你的来信！",
        footerText: "© 2024 My Company",
        resetButton: "重置语言"
    },
    'zh-tw': {
        navAboutMe: "關於我",
        navMyMission: "我的使命",
        navMyProjects: "我的專案",
        aboutMeTitle: "關於我",
        aboutMeText: "歡迎來到我的個人網站！這是一個展示我的創作、專案和個人興趣的空間。無論你是來這裡了解我的最新工作，還是對我的專案感興趣，希望你能找到你所需的內容。",
        myMissionTitle: "我的使命",
        myMissionText: "我的使命是分享我的創作和想法，與世界各地的人們交流。我熱衷於創造有趣和有用的內容，希望這些能為你帶來靈感和幫助。",
        myProjectsTitle: "我的專案",
        myProjectsText: "遊戲開發：我正在開發一個獨特的遊戲，探索機械與自然的結合，帶來新穎的遊戲體驗。<br>網站設計：我設計和維護這個個人網站，分享我的專案和成果。",
        contactTitle: "聯絡我",
        contactText: "如果你對我的專案有任何問題或建議，或者想要交流合作，請通過以下方式聯絡我：<br>電子郵件：Timothyf20222022@outlook.com<br>期待你的來信！",
        footerText: "© 2024 My Company",
        resetButton: "重置語言"
    },
    ja: {
        navAboutMe: "私について",
        navMyMission: "私の使命",
        navMyProjects: "私のプロジェクト",
        aboutMeTitle: "私について",
        aboutMeText: "私の個人ウェブサイトへようこそ！ここは私の創作物、プロジェクト、個人の興味を紹介するスペースです。私の最新の作品について知りたい場合や、私のプロジェクトに興味がある場合、あなたが探している内容が見つかることを願っています。",
        myMissionTitle: "私の使命",
        myMissionText: "私の使命は、私の創作物やアイデアを共有し、世界中の人々と交流することです。面白くて役に立つコンテンツを作ることに情熱を注いでおり、これらがあなたにインスピレーションと助けを提供できることを願っています。",
        myProjectsTitle: "私のプロジェクト",
        myProjectsText: "ゲーム開発：私は、機械と自然の要素の組み合わせを探求するユニークなゲームに取り組んでおり、新しいゲーム体験を提供しています。<br>ウェブサイトデザイン：私はこの個人ウェブサイトをデザインし、維持しています。プロジェクトや成果を共有するためのものです。",
        contactTitle: "お問い合わせ",
        contactText: "私のプロジェクトについて質問や提案がある場合、またはコラボレーションについて話したい場合は、以下の方法でご連絡ください：<br>メール：Timothyf20222022@outlook.com<br>お待ちしております！",
        footerText: "© 2024 My Company",
        resetButton: "言語リセット"
    }
};

// 获取本地存储中的语言设置
const savedLanguage = localStorage.getItem('language') || 'en';
setLanguage(savedLanguage);

// 语言选择下拉框变化事件
document.getElementById('language-selector').addEventListener('change', (event) => {
    const language = event.target.value;
    setLanguage(language);
});

// 重置语言按钮点击事件
document.getElementById('reset-language').addEventListener('click', () => {
    localStorage.removeItem('language');
    setLanguage('en');
});

// 设置语言函数
function setLanguage(language) {
    // 获取所有需要翻译的元素
    document.querySelector('#nav-about-me').textContent = translations[language].navAboutMe;
    document.querySelector('#nav-my-mission').textContent = translations[language].navMyMission;
    document.querySelector('#nav-my-projects').textContent = translations[language].navMyProjects;
    document.querySelector('#about-me .title').textContent = translations[language].aboutMeTitle;
    document.querySelector('#about-me p').innerHTML = translations[language].aboutMeText;
    document.querySelector('#my-mission .title').textContent = translations[language].myMissionTitle;
    document.querySelector('#my-mission p').innerHTML = translations[language].myMissionText;
    document.querySelector('#my-projects .title').textContent = translations[language].myProjectsTitle;
    document.querySelector('#my-projects p').innerHTML = translations[language].myProjectsText;
    document.querySelector('#contact .title').textContent = translations[language].contactTitle;
    document.querySelector('#contact p').innerHTML = translations[language].contactText;
    document.querySelector('footer p').textContent = translations[language].footerText;
    document.querySelector('#reset-language').textContent = translations[language].resetButton;
    
    // 设置语言选择框的值
    document.getElementById('language-selector').value = language;
}
