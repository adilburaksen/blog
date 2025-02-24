class BlogLoader {
    constructor() {
        this.blogContainer = document.getElementById('posts');
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'loading-indicator';
        this.loadingIndicator.textContent = 'Yükleniyor...';
        
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.loading = false;
        this.allLoaded = false;
        this.posts = [];
        this.filteredPosts = [];
        
        this.setupSearch();
        this.setupBackToTop();
        this.setupPagination();
        this.loadInitialPosts();
    }

    setupSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'search-input';
        searchInput.placeholder = 'Blog yazılarında ara...';
        
        searchContainer.appendChild(searchInput);
        this.blogContainer.parentNode.insertBefore(searchContainer, this.blogContainer);

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

    setupPagination() {
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const currentPageSpan = document.getElementById('currentPage');

        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.displayPosts();
                this.updatePaginationUI();
            }
        });

        nextButton.addEventListener('click', () => {
            if (!this.allLoaded) {
                this.currentPage++;
                this.loadMorePosts();
                this.updatePaginationUI();
            }
        });
    }

    updatePaginationUI() {
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const currentPageSpan = document.getElementById('currentPage');

        prevButton.disabled = this.currentPage === 1;
        nextButton.disabled = this.allLoaded;
        currentPageSpan.textContent = this.currentPage;
    }

    filterPosts(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        this.filteredPosts = this.posts.filter(post => {
            return post.title.toLowerCase().includes(searchTerm) ||
                   post.excerpt.toLowerCase().includes(searchTerm) ||
                   post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        });
        this.currentPage = 1;
        this.displayPosts();
        this.updatePaginationUI();
    }

    async loadInitialPosts() {
        this.loading = true;
        this.blogContainer.appendChild(this.loadingIndicator);

        try {
            const response = await fetch('/blog-content/posts/page-1.json');
            if (!response.ok) throw new Error('Failed to load posts');

            const data = await response.json();
            this.posts = data.posts || [];
            this.filteredPosts = [...this.posts];
            
            if (this.posts.length < this.postsPerPage) {
                this.allLoaded = true;
            }

            this.displayPosts();
            this.updatePaginationUI();
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.loadingIndicator.textContent = 'Blog yazıları yüklenirken hata oluştu. Lütfen tekrar deneyin.';
        } finally {
            this.loading = false;
            if (this.loadingIndicator.parentNode) {
                this.loadingIndicator.parentNode.removeChild(this.loadingIndicator);
            }
        }
    }

    async loadMorePosts() {
        if (this.loading || this.allLoaded) return;

        this.loading = true;
        this.blogContainer.appendChild(this.loadingIndicator);

        try {
            const response = await fetch(`/blog-content/posts/page-${this.currentPage}.json`);
            if (!response.ok) {
                if (response.status === 404) {
                    this.allLoaded = true;
                    return;
                }
                throw new Error('Failed to load posts');
            }

            const data = await response.json();
            const newPosts = data.posts || [];
            
            if (newPosts.length === 0 || newPosts.length < this.postsPerPage) {
                this.allLoaded = true;
            }

            this.posts = [...this.posts, ...newPosts];
            this.filteredPosts = [...this.posts];
            this.displayPosts();
            this.updatePaginationUI();
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.loadingIndicator.textContent = 'Daha fazla yazı yüklenirken hata oluştu. Lütfen tekrar deneyin.';
        } finally {
            this.loading = false;
            if (this.loadingIndicator.parentNode) {
                this.loadingIndicator.parentNode.removeChild(this.loadingIndicator);
            }
        }
    }

    displayPosts() {
        if (!this.blogContainer) return;

        const start = (this.currentPage - 1) * this.postsPerPage;
        const end = start + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(start, end);

        this.blogContainer.innerHTML = postsToShow.map(post => {
            const date = new Date(post.date).toLocaleDateString('tr-TR', {
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
                        ${date} · ${post.readingTime} dakika okuma süresi
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
