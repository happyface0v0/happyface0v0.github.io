document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    
    // Apply welcome message animation
    welcomeMessage.style.opacity = 1;
    setTimeout(() => {
        welcomeMessage.style.opacity = 0;
        welcomeMessage.style.visibility = 'hidden';
    }, 4000);
});
