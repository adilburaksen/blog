// Ana sayfa için genel JavaScript fonksiyonları
document.addEventListener('DOMContentLoaded', () => {
    // Responsive menü için gerekirse hamburger menü eklenebilir
    // Analytics eklenebilir
});

// Sayfa yükleme performansını ölçme
window.addEventListener('load', () => {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Sayfa yükleme süresi: ${pageLoadTime}ms`);
});

// Update theme icon based on current theme
function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Theme Management
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', savedTheme);
    }
    updateThemeIcon(themeIcon, htmlElement.getAttribute('data-theme'));

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeIcon, newTheme);
    });
});
