class PostLoader {
    constructor() {
        this.postContent = document.getElementById('post-content');
        this.prevPostLink = document.querySelector('.prev-post');
        this.nextPostLink = document.querySelector('.next-post');
        
        // Get slug from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.currentSlug = urlParams.get('slug');
        this.currentPost = null;
        this.allPosts = [];
        
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
            const response = await fetch('/blog-content/posts/page-1.json');
            if (!response.ok) {
                throw new Error('Failed to load posts');
            }
            const data = await response.json();
            this.allPosts = data.posts;
            
            // Try loading page 2 if exists
            try {
                const response2 = await fetch('/blog-content/posts/page-2.json');
                if (response2.ok) {
                    const data2 = await response2.json();
                    this.allPosts = [...this.allPosts, ...data2.posts];
                }
            } catch (error) {
                // It's okay if page 2 doesn't exist
            }

            // Sort posts by date
            this.allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
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
            const response = await fetch(`/blog-content/posts/${this.currentSlug}.md`);
            if (!response.ok) {
                throw new Error('Failed to load post content');
            }
            const content = await response.text();
            
            // Convert markdown to HTML
            const html = marked.parse(content);
            
            // Post title and content
            this.postContent.innerHTML = `
                <h1>${this.currentPost.title}</h1>
                <div class="post-meta">
                    <time datetime="${this.currentPost.date}">${new Date(this.currentPost.date).toLocaleDateString('en-US')}</time>
                    ${this.currentPost.tags ? `<div class="tags">${this.currentPost.tags.map(tag => `<a href="/tags/${tag}">#${tag}</a>`).join(' ')}</div>` : ''}
                </div>
                <div class="post-body">${html}</div>
            `;
            
            // Update page title
            document.title = `${this.currentPost.title} | Adil Burak`;
            
            // Update meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', this.currentPost.description || '');
            }
        } catch (error) {
            throw new Error('Failed to load post content');
        }
    }

    setupNavigation() {
        const currentIndex = this.allPosts.findIndex(post => post.slug === this.currentSlug);
        
        if (currentIndex > 0) {
            const prevPost = this.allPosts[currentIndex - 1];
            this.prevPostLink.href = `/blog?slug=${prevPost.slug}`;
            this.prevPostLink.style.display = 'inline-block';
        }
        
        if (currentIndex < this.allPosts.length - 1) {
            const nextPost = this.allPosts[currentIndex + 1];
            this.nextPostLink.href = `/blog?slug=${nextPost.slug}`;
            this.nextPostLink.style.display = 'inline-block';
        }
    }

    showError() {
        this.postContent.innerHTML = `
            <div class="error">
                <h1>Post Not Found</h1>
                <p>The post you're looking for could not be found. Please return to the <a href="/blog">blog home page</a>.</p>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PostLoader();
});
