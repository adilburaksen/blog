class PostLoader {
    constructor() {
        this.postContent = document.getElementById('post-content');
        this.relatedPostsContainer = document.getElementById('related-posts-container');
        this.prevPostLink = document.querySelector('.prev-post');
        this.nextPostLink = document.querySelector('.next-post');
        
        this.currentSlug = new URLSearchParams(window.location.search).get('slug');
        this.currentPost = null;
        this.allPosts = [];
        
        this.init();
    }

    async init() {
        try {
            await this.loadAllPosts();
            await this.loadCurrentPost();
            this.setupNavigation();
            this.loadRelatedPosts();
        } catch (error) {
            console.error('Error initializing post:', error);
            this.showError();
        }
    }

    async loadAllPosts() {
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            try {
                const response = await fetch(`/blog-content/posts/page-${page}.json`);
                if (!response.ok) {
                    if (response.status === 404) {
                        hasMore = false;
                        break;
                    }
                    throw new Error('Failed to load posts');
                }

                const data = await response.json();
                this.allPosts = [...this.allPosts, ...data.posts];
                page++;
            } catch (error) {
                hasMore = false;
            }
        }

        // Sort posts by date
        this.allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    async loadCurrentPost() {
        this.currentPost = this.allPosts.find(post => post.slug === this.currentSlug);

        if (!this.currentPost) {
            throw new Error('Post not found');
        }

        // Update page metadata
        document.title = `${this.currentPost.title} | Adil Burak`;
        const metaDesc = document.querySelector('meta[name="description"]');
        metaDesc.content = this.currentPost.excerpt;

        // Load and render the full post content
        try {
            const response = await fetch(`/blog-content/posts/${this.currentPost.slug}.md`);
            if (!response.ok) throw new Error('Failed to load post content');
            
            const content = await response.text();
            this.renderPost(content);
        } catch (error) {
            console.error('Error loading post content:', error);
            this.renderPost(this.currentPost.excerpt);
        }
    }

    renderPost(content) {
        const date = new Date(this.currentPost.date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        this.postContent.innerHTML = `
            <h1>${this.currentPost.title}</h1>
            <div class="post-meta">
                <span class="date">${date}</span>
                <span class="author">${this.currentPost.author}</span>
                <span class="reading-time">${this.currentPost.readingTime} okuma süresi</span>
            </div>
            <div class="post-content">
                ${this.markdownToHtml(content)}
            </div>
            <div class="post-tags">
                ${this.currentPost.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
    }

    setupNavigation() {
        const currentIndex = this.allPosts.findIndex(post => post.slug === this.currentSlug);
        
        if (currentIndex > 0) {
            const prevPost = this.allPosts[currentIndex - 1];
            this.prevPostLink.href = `/posts/${prevPost.slug}`;
            this.prevPostLink.style.display = 'block';
        }

        if (currentIndex < this.allPosts.length - 1) {
            const nextPost = this.allPosts[currentIndex + 1];
            this.nextPostLink.href = `/posts/${nextPost.slug}`;
            this.nextPostLink.style.display = 'block';
        }
    }

    loadRelatedPosts() {
        const currentTags = new Set(this.currentPost.tags);
        
        const relatedPosts = this.allPosts
            .filter(post => post.slug !== this.currentSlug)
            .map(post => ({
                post,
                relevance: post.tags.filter(tag => currentTags.has(tag)).length
            }))
            .filter(item => item.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 3);

        if (relatedPosts.length > 0) {
            const html = relatedPosts.map(({post}) => `
                <div class="related-post">
                    <h4><a href="/posts/${post.slug}">${post.title}</a></h4>
                    <div class="post-meta">
                        <span class="reading-time">${post.readingTime} okuma süresi</span>
                    </div>
                </div>
            `).join('');
            
            this.relatedPostsContainer.innerHTML = html;
        } else {
            document.querySelector('.related-posts').style.display = 'none';
        }
    }

    showError() {
        this.postContent.innerHTML = `
            <div class="error-message">
                <h1>Yazı Bulunamadı</h1>
                <p>Üzgünüz, aradığınız yazı bulunamadı.</p>
                <p><a href="/">← Ana Sayfaya Dön</a></p>
            </div>
        `;
    }

    markdownToHtml(markdown) {
        // Basic markdown to HTML conversion
        // You might want to use a proper markdown library like marked.js
        return markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/^\s*>\s*(.*)$/gm, '<blockquote>$1</blockquote>')
            .replace(/(?:^|\n)([^\n]+)\n/g, '<p>$1</p>');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PostLoader();
});
