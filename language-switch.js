document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');

    // 翻译字典
    const translations = {
        "en": {
            'about_me': 'About Me',
            'welcome_msg': 'Welcome to My Website!',
            'welcome_text': 'Welcome to my personal website! This is a space to showcase my creations, projects, and personal interests. Whether you’re here to learn about my latest work or are interested in my projects, I hope you find what you’re looking for.',
        },
        "zh": {
            'about_me': '关于我',
            'welcome_msg': '欢迎来到我的个人网站！',
            'welcome_text': '欢迎来到我的个人网站！这是一个展示我的创作、项目和个人兴趣的空间。无论你是来这里了解我的最新工作，还是对我的项目感兴趣，希望你能找到你所需的内容。',
        },
        "zh-tw": {
            'about_me': '關於我',
            'welcome_msg': '歡迎來到我的個人網站！',
            'welcome_text': '歡迎來到我的個人網站！這是一個展示我的創作、專案和個人興趣的空間。不管你是來這裡了解我的最新工作，還是對我的專案感興趣，希望你能找到你所需的內容。',
        },
        "ja": {
            'about_me': '自己紹介',
            'welcome_msg': '私のウェブサイトへようこそ！',
            'welcome_text': '私の個人ウェブサイトへようこそ！ここは、私の創作物、プロジェクト、そして個人的な興味を展示するためのスペースです。最新の作品について知りたい方や、プロジェクトに興味がある方は、ぜひご覧ください。',
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
