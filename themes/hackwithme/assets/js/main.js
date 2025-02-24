console.log('This site was generated by Hugo.');

// Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Code Copy Button
document.addEventListener('DOMContentLoaded', () => {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(code => {
        const button = document.createElement('button');
        button.className = 'copy-button absolute top-2 right-2 bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600';
        button.textContent = 'Kopyala';
        
        const pre = code.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(code.textContent);
                button.textContent = 'Kopyalandı!';
                setTimeout(() => {
                    button.textContent = 'Kopyala';
                }, 2000);
            } catch (err) {
                console.error('Kopyalama başarısız:', err);
                button.textContent = 'Hata!';
            }
        });
    });
});

// Theme Toggle (Dark/Light mode için hazırlık)
class ThemeToggle {
    constructor() {
        this.theme = 'dark';
        this.init();
    }

    init() {
        // Gelecekte tema değiştirme özelliği eklenecek
    }

    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        // Tema değiştirme mantığı eklenecek
    }
}

// Search functionality (Gelecekte eklenecek)
class Search {
    constructor() {
        this.searchIndex = null;
        this.init();
    }

    init() {
        // Arama fonksiyonları eklenecek
    }

    async search(query) {
        // Arama mantığı eklenecek
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
    new Search();
});
