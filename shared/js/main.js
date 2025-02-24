// Theme handling
function initTheme() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || (prefersDarkMode ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update initial icon if theme toggle exists
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        // Show sun icon in dark mode (to switch to light), moon icon in light mode (to switch to dark)
        themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        // Show sun icon in dark mode (to switch to light), moon icon in light mode (to switch to dark)
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});
