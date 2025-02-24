class PostLoader {
    constructor() {
        this.postContent = document.getElementById('post-content');
        this.prevPostLink = document.querySelector('.prev-post');
        this.nextPostLink = document.querySelector('.next-post');
        
        // Get slug from URL path
        const pathParts = window.location.pathname.split('/');
        this.currentSlug = pathParts[pathParts.length - 1];
        
        this.currentPost = null;
        this.allPosts = [];
        this.currentYear = new Date().getFullYear();
        this.currentTag = new URLSearchParams(window.location.search).get('tag');
        
        this.init();
    }

    async init() {
        try {
            await this.loadAllPosts();
            await this.loadCurrentPost();
            this.setupNavigation();
        } catch (error) {
            console.error('Error initializing post:', error);
            this.showError();
        }
    }

    async loadAllPosts() {
        try {
            const years = ['2025']; // Add more years as needed
            this.allPosts = [];

            for (const year of years) {
                const response = await fetch(`/blog-content/posts/${year}/posts.json`);
                if (!response.ok) {
                    console.error(`Failed to load posts for year ${year}`);
                    continue;
                }
                const yearPosts = await response.json();
                this.allPosts.push(...yearPosts);
            }

            // Sort posts by date in descending order
            this.allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Filter by tag if one is selected
            if (this.currentTag) {
                this.allPosts = this.allPosts.filter(post => 
                    post.tags && post.tags.includes(this.currentTag)
                );
            }
        } catch (error) {
            throw new Error('Failed to load posts list');
        }
    }

    async loadCurrentPost() {
        if (!this.currentSlug) {
            throw new Error('No post slug specified');
        }

        this.currentPost = this.allPosts.find(post => post.slug === this.currentSlug);
        
        if (!this.currentPost) {
            throw new Error('Post not found');
        }

        try {
            const response = await fetch(`/blog-content/posts/${this.currentYear}/${this.currentSlug}.md`);
            if (!response.ok) {
                throw new Error('Failed to load post content');
            }
            const content = await response.text();
            
            // Convert markdown to HTML
            const html = marked.parse(content);
            
            // Format date
            const date = new Date(this.currentPost.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Post metadata and content
            this.postContent.innerHTML = `
                <div class="post-header">
                    <h1>${this.currentPost.title}</h1>
                    <div class="post-meta">
                        <time datetime="${this.currentPost.date}">${date}</time>
                        · ${this.currentPost.readingTime} min read
                    </div>
                    ${this.currentPost.tags ? `
                        <div class="post-tags">
                            ${this.currentPost.tags.map(tag => `<a href="/tags/${tag}" class="tag">#${tag}</a>`).join(' ')}
                        </div>
                    ` : ''}
                </div>
                <div class="post-body">
                    ${html}
                </div>
            `;
            
            // Update page title
            document.title = `${this.currentPost.title} | Blog`;
            
            // Update meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', this.currentPost.excerpt || '');
            }
        } catch (error) {
            throw new Error('Failed to load post content');
        }
    }

    setupNavigation() {
        const currentIndex = this.allPosts.findIndex(post => post.slug === this.currentSlug);
        
        if (currentIndex > 0) {
            const prevPost = this.allPosts[currentIndex - 1];
            this.prevPostLink.href = `/posts/${prevPost.slug}`;
            this.prevPostLink.style.display = 'inline-block';
            this.prevPostLink.innerHTML = `← ${prevPost.title}`;
        }

        if (currentIndex < this.allPosts.length - 1) {
            const nextPost = this.allPosts[currentIndex + 1];
            this.nextPostLink.href = `/posts/${nextPost.slug}`;
            this.nextPostLink.style.display = 'inline-block';
            this.nextPostLink.innerHTML = `${nextPost.title} →`;
        }
    }

    showError() {
        this.postContent.innerHTML = `
            <div class="error-message">
                <h2>Post Not Found</h2>
                <p>Sorry, the requested post could not be found. Please check the URL or return to the <a href="/blog">blog listing</a>.</p>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PostLoader();
});
