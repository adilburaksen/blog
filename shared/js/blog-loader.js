class BlogLoader {
    constructor() {
        this.blogContainer = document.getElementById('blog-content');
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'loading-indicator';
        this.loadingIndicator.textContent = 'Loading...';
        
        this.currentPage = 1;
        this.postsPerPage = 5;
        this.loading = false;
        this.allLoaded = false;
        
        // Infinite scroll
        this.setupInfiniteScroll();
    }

    setupInfiniteScroll() {
        window.addEventListener('scroll', () => {
            if (this.loading || this.allLoaded) return;

            const scrollPosition = window.innerHeight + window.scrollY;
            const contentHeight = document.body.offsetHeight;

            if (scrollPosition >= contentHeight - 800) { // 800px before bottom
                this.loadMorePosts();
            }
        });
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
            const posts = data.posts;
            
            if (!posts || posts.length === 0) {
                this.allLoaded = true;
                return;
            }

            if (posts.length < this.postsPerPage) {
                this.allLoaded = true;
            }

            await this.renderPosts(posts);
            this.currentPage++;
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.loadingIndicator.textContent = 'Error loading posts. Please try again.';
        } finally {
            this.loading = false;
            if (this.loadingIndicator.parentNode) {
                this.loadingIndicator.parentNode.removeChild(this.loadingIndicator);
            }
        }
    }

    async renderPosts(posts) {
        const fragment = document.createDocumentFragment();

        for (const post of posts) {
            const article = document.createElement('article');
            article.className = 'blog-post';
            
            const date = new Date(post.date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            article.innerHTML = `
                <h2><a href="/posts/${post.slug}">${post.title}</a></h2>
                <div class="post-meta">
                    <span class="date">${date}</span>
                    <span class="author">${post.author}</span>
                    <span class="reading-time">${post.readingTime} okuma süresi</span>
                </div>
                <div class="post-excerpt">${post.excerpt}</div>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;

            // Lazy load images if any
            const images = article.getElementsByTagName('img');
            Array.from(images).forEach(img => {
                img.loading = 'lazy';
                img.decoding = 'async';
            });

            fragment.appendChild(article);
        }

        this.blogContainer.appendChild(fragment);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const blogLoader = new BlogLoader();
    blogLoader.loadMorePosts(); // Load initial posts
});
