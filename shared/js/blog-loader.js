class BlogLoader {
    constructor() {
        this.blogContainer = document.getElementById('posts');
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'loading-indicator';
        this.loadingIndicator.textContent = 'Loading...';
        
        this.posts = [];
        this.filteredPosts = [];
        
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

    filterPosts(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        this.filteredPosts = this.posts.filter(post => {
            return post.title.toLowerCase().includes(searchTerm) ||
                   post.excerpt.toLowerCase().includes(searchTerm) ||
                   post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        });
        this.displayPosts();
    }

    async loadPosts() {
        if (!this.blogContainer) return;
        
        this.loading = true;
        this.blogContainer.appendChild(this.loadingIndicator);

        try {
            const response = await fetch('/blog-content/posts/posts.json');
            if (!response.ok) throw new Error('Failed to load posts');

            const data = await response.json();
            this.posts = data.posts || [];
            this.filteredPosts = [...this.posts];
            
            this.displayPosts();
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.loadingIndicator.textContent = 'Error loading blog posts. Please try again.';
        } finally {
            this.loading = false;
            if (this.loadingIndicator.parentNode) {
                this.loadingIndicator.parentNode.removeChild(this.loadingIndicator);
            }
        }
    }

    displayPosts() {
        if (!this.blogContainer) return;

        const postsToShow = this.filteredPosts;

        this.blogContainer.innerHTML = postsToShow.map(post => {
            const date = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            return `
                <article class="post-card">
                    <h2 class="post-title">
                        <a href="/posts/${post.slug}">${post.title}</a>
                    </h2>
                    <div class="post-meta">
                        ${date} · ${post.readingTime} min read
                    </div>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<a href="/tags#${tag}" class="tag">${tag}</a>`).join('')}
                    </div>
                </article>
            `;
        }).join('');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BlogLoader();
});
