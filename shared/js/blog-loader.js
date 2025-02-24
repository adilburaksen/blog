class BlogLoader {
    constructor() {
        this.blogContainer = document.getElementById('posts-grid');
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'loading-indicator';
        this.loadingIndicator.textContent = 'Loading...';
        
        this.posts = [];
        this.filteredPosts = [];
        
        if (this.blogContainer) {
            this.blogContainer.appendChild(this.loadingIndicator);
        } else {
            console.error('Blog container not found!');
            return;
        }
        
        this.setupSearch();
        this.setupBackToTop();
        this.loadPosts();
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        let debounceTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                this.filterPosts(searchInput.value);
            }, 300);
        });
    }

    setupBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    async loadPosts() {
        try {
            const response = await fetch('/blog/blog-content/posts/index.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.posts = data.posts;
            this.filteredPosts = this.posts;
            this.renderPosts();
        } catch (error) {
            console.error('Error loading posts:', error);
            this.loadingIndicator.textContent = 'Error loading posts. Please try again later.';
        }
    }

    renderPosts() {
        if (!this.blogContainer) return;
        
        this.blogContainer.removeChild(this.loadingIndicator);
        this.blogContainer.innerHTML = '';

        if (this.filteredPosts.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No posts found.';
            this.blogContainer.appendChild(noResults);
            return;
        }

        this.filteredPosts.forEach(post => {
            const postCard = document.createElement('article');
            postCard.className = 'post-card';
            
            const date = new Date(post.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Ensure URLs start with /blog/
            const postUrl = post.url.startsWith('/blog/') ? post.url : '/blog' + post.url;

            postCard.innerHTML = `
                <h2 class="post-title">
                    <a href="${postUrl}">${post.title}</a>
                </h2>
                <div class="post-meta">
                    <span class="post-date">${formattedDate}</span>
                    ${post.tags ? `<span class="post-tags">${post.tags.map(tag => `#${tag}`).join(' ')}</span>` : ''}
                </div>
                ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ''}
            `;
            
            this.blogContainer.appendChild(postCard);
        });
    }

    filterPosts(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        
        this.filteredPosts = this.posts.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(searchTerm);
            const tagsMatch = post.tags ? post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) : false;
            const excerptMatch = post.excerpt ? post.excerpt.toLowerCase().includes(searchTerm) : false;
            
            return titleMatch || tagsMatch || excerptMatch;
        });
        
        this.renderPosts();
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        new BlogLoader();
    });
}
