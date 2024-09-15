document.addEventListener('DOMContentLoaded', () => {
    const gradientOverlay = document.getElementById('gradient-overlay');
    const welcomeMessage = document.getElementById('welcome-message');

    // 检查是否第一次访问
    if (!localStorage.getItem('hasVisited')) {
        // 设置欢迎动画的可见性
        gradientOverlay.style.visibility = 'visible';

        // 播放渐变动画
        gradientOverlay.style.animation = 'fadeInOut 4s ease-out forwards';

        // 设置欢迎文字的动画
        welcomeMessage.style.opacity = '1';

        // 设置已访问标记
        localStorage.setItem('hasVisited', 'true');

        // 在动画完成后隐藏渐变层
        setTimeout(() => {
            gradientOverlay.style.visibility = 'hidden';
        }, 4000); // 动画时长
    } else {
        // 如果不是第一次访问，直接隐藏渐变层
        gradientOverlay.style.visibility = 'hidden';
    }
});
