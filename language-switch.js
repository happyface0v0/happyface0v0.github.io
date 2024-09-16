document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');

    // 翻译字典
    const translations = {
        "en": {
            'about_me': 'About Me',
            'my_mission': 'My Mission',
            'my_projects': 'My Projects',
            'welcome_msg': 'Welcome to My Website!',
            'welcome_text': 'Welcome to my personal website! This is a space to showcase my creations, projects, and personal interests. Whether you’re here to learn about my latest work or are interested in my projects, I hope you find what you’re looking for.',
            'mission_text': 'My mission is to share my creations and ideas, and to connect with people around the world. I am passionate about creating engaging and useful content, and I hope it inspires and helps you.',
            'game_dev': 'Game Development: I am developing a unique game that explores the fusion of mechanical and natural elements, offering a fresh gaming experience.',
            'web_design': 'Website Design: I design and maintain this personal website to share my projects and achievements.'
        },
        "zh": {
            'about_me': '关于我',
            'my_mission': '我的使命',
            'my_projects': '我的项目',
            'welcome_msg': '欢迎来到我的个人网站！',
            'welcome_text': '欢迎来到我的个人网站！这是一个展示我的创作、项目和个人兴趣的空间。无论你是来这里了解我的最新工作，还是对我的项目感兴趣，希望你能找到你所需的内容。',
            'mission_text': '我的使命是分享我的创作和想法，与全球各地的人们联系。我热衷于创造引人入胜和有用的内容，希望能启发和帮助你。',
            'game_dev': '游戏开发：我正在开发一个独特的游戏，探索机械和自然元素的融合，提供全新的游戏体验。',
            'web_design': '网站设计：我设计和维护这个个人网站，以展示我的项目和成就。'
        },
        "zh-tw": {
            'about_me': '關於我',
            'my_mission': '我的使命',
            'my_projects': '我的專案',
            'welcome_msg': '歡迎來到我的個人網站！',
            'welcome_text': '歡迎來到我的個人網站！這是一個展示我的創作、專案和個人興趣的空間。不管你是來這裡了解我的最新工作，還是對我的專案感興趣，希望你能找到你所需的內容。',
            'mission_text': '我的使命是分享我的創作和想法，並與世界各地的人們交流。我熱衷於創造有趣和有用的內容，希望這些能為你帶來靈感和幫助。',
            'game_dev': '遊戲開發：我正在開發一個獨特的遊戲，探索機械與自然的結合，帶來新穎的遊戲體驗。',
            'web_design': '網站設計：我設計和維護這個個人網站，分享我的專案和成果。'
        },
        "ja": {
            'about_me': '自己紹介',
            'my_mission': '私の使命',
            'my_projects': '私のプロジェクト',
            'welcome_msg': '私のウェブサイトへようこそ！',
            'welcome_text': '私の個人ウェブサイトへようこそ！ここは、私の創作物、プロジェクト、そして個人的な興味を展示するためのスペースです。最新の作品について知りたい方や、プロジェクトに興味がある方は、ぜひご覧ください。',
            'mission_text': '私の使命は、私の創作物やアイデアを共有し、世界中の人々とつながることです。魅力的で有用なコンテンツを作ることに情熱を注いでおり、それが皆さんにインスピレーションと助けをもたらすことを願っています。',
            'game_dev': 'ゲーム開発：機械的要素と自然の要素が融合したユニークなゲームを開発しており、新しいゲーム体験を提供しています。',
            'web_design': 'ウェブサイトデザイン：この個人ウェブサイトをデザインし、管理しています。プロジェクトや成果を共有するためのものです。'
        }
    };

    function updateLanguage(language) {
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[language][key]) {
                element.textContent = translations[language][key];
            }
        });
    }

    languageSelector.addEventListener('change', () => {
        const selectedLanguage = languageSelector.value;
        localStorage.setItem('language', selectedLanguage);
        updateLanguage(selectedLanguage);
    });

    const savedLanguage = localStorage.getItem('language') || 'en';
    languageSelector.value = savedLanguage;
    updateLanguage(savedLanguage);
});
