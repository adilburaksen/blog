class PostLoader {
    constructor() {
        this.posts = [];
        this.currentTag = new URLSearchParams(window.location.search).get('tag');
    }

    async loadPosts() {
        try {
            const years = ['2025']; // Add more years as needed
            this.posts = [];

            for (const year of years) {
                const response = await fetch(`/blog-content/posts/${year}/posts.json`);
                if (!response.ok) {
                    console.error(`Failed to load posts for year ${year}`);
                    continue;
                }
                const yearPosts = await response.json();
                this.posts.push(...yearPosts);
            }

            // Sort posts by date in descending order
            this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Filter by tag if one is selected
            if (this.currentTag) {
                this.posts = this.posts.filter(post => 
                    post.tags && post.tags.includes(this.currentTag)
                );
            }

            return this.posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            return [];
        }
    }

    async displayPosts() {
        const posts = await this.loadPosts();
        const postsContainer = document.getElementById('posts-grid');
        
        if (!postsContainer) {
            console.error('Posts container not found');
            return;
        }

        if (this.currentTag) {
            const tagHeader = document.createElement('h2');
            tagHeader.className = 'tag-header';
            tagHeader.textContent = `Posts tagged with "${this.currentTag}"`;
            postsContainer.parentElement.insertBefore(tagHeader, postsContainer);
        }

        if (posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="no-posts">
                    ${this.currentTag ? 
                        `No posts found with tag "${this.currentTag}"` : 
                        'No posts found'}
                </div>`;
            return;
        }

        postsContainer.innerHTML = posts.map(post => `
            <article class="post-card">
                <h2 class="post-title">
                    <a href="/blog-content/posts/${post.date.substring(0, 4)}/${post.slug}">${post.title}</a>
                </h2>
                <div class="post-meta">
                    <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</time>
                    · ${post.readingTime} read
                </div>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => 
                        `<a href="/blog-content/tags.html?tag=${tag}" class="tag">${tag}</a>`
                    ).join('')}
                </div>
            </article>
        `).join('');
    }

    async loadPostContent() {
        try {
            const pathParts = window.location.pathname.split('/');
            const year = pathParts[pathParts.length - 2];
            const slug = pathParts[pathParts.length - 1];

            // Load post metadata
            const response = await fetch(`/blog-content/posts/${year}/posts.json`);
            if (!response.ok) throw new Error('Failed to load post metadata');
            
            const posts = await response.json();
            const post = posts.find(p => p.slug === slug);
            
            if (!post) throw new Error('Post not found');

            // Load post content
            const contentResponse = await fetch(`/blog-content/posts/${year}/${slug}.md`);
            if (!contentResponse.ok) throw new Error('Failed to load post content');
            
            const content = await contentResponse.text();
            
            // Display post
            this.displayPost(post, content);
            
        } catch (error) {
            console.error('Error loading post:', error);
            this.displayError();
        }
    }

    displayPost(post, content) {
        const postContainer = document.querySelector('.blog-post');
        if (!postContainer) return;

        // Update page title
        document.title = `${post.title} · Blog`;

        // Display post header
        const header = document.createElement('header');
        header.className = 'post-header';
        header.innerHTML = `
            <h1>${post.title}</h1>
            <div class="post-meta">
                <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</time>
                · ${post.readingTime} read
            </div>
            <div class="post-tags">
                ${post.tags.map(tag => 
                    `<a href="/blog-content/tags.html?tag=${tag}" class="tag">${tag}</a>`
                ).join('')}
            </div>
        `;
        postContainer.appendChild(header);

        // Display post content
        const postBody = document.createElement('div');
        postBody.className = 'post-body';
        postBody.innerHTML = marked.parse(content);
        postContainer.appendChild(postBody);
    }

    displayError() {
        const container = document.querySelector('.container');
        if (!container) return;

        container.innerHTML = `
            <div class="error-message">
                <h2>Post Not Found</h2>
                <p>Sorry, the post you're looking for doesn't exist or has been moved.</p>
                <a href="/blog-content/blog.html">← Back to Blog</a>
            </div>
        `;
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const postLoader = new PostLoader();
    
    if (document.querySelector('.blog-post')) {
        postLoader.loadPostContent();
    } else if (document.querySelector('.posts-grid')) {
        postLoader.displayPosts();
    }
});
