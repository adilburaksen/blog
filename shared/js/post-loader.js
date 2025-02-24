class PostLoader {
    constructor() {
        this.posts = [];
        this.currentTag = new URLSearchParams(window.location.search).get('tag');
        console.log('PostLoader initialized', {
            currentTag: this.currentTag,
            path: window.location.pathname
        });
    }

    async loadPosts() {
        try {
            console.log('Loading posts...');
            const years = ['2025']; // Add more years as needed
            this.posts = [];

            for (const year of years) {
                const url = `/blog-content/posts/${year}/posts.json`;
                console.log(`Fetching posts from ${url}`);
                
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log('Received data:', data);
                    
                    if (data && data.posts && Array.isArray(data.posts)) {
                        this.posts.push(...data.posts);
                        console.log(`Added ${data.posts.length} posts from ${year}`);
                    } else {
                        console.error(`Invalid posts data format for year ${year}`, data);
                    }
                } catch (error) {
                    console.error(`Failed to load posts for year ${year}:`, error);
                }
            }

            console.log(`Total posts loaded: ${this.posts.length}`);

            // Sort posts by date in descending order
            this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Filter by tag if one is selected
            if (this.currentTag) {
                this.posts = this.posts.filter(post => 
                    post.tags && post.tags.includes(this.currentTag)
                );
                console.log(`Filtered posts by tag "${this.currentTag}": ${this.posts.length} posts`);
            }

            return this.posts;
        } catch (error) {
            console.error('Error in loadPosts:', error);
            throw error; // Re-throw to be handled by displayPosts
        }
    }

    async displayPosts() {
        try {
            console.log('Displaying posts...');
            const postsContainer = document.getElementById('posts-grid');
            
            if (!postsContainer) {
                throw new Error('Posts container (#posts-grid) not found');
            }

            const posts = await this.loadPosts();

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
                        · ${post.readingTime} min read
                    </div>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => 
                            `<a href="/blog-content/tags.html?tag=${tag}" class="tag">${tag}</a>`
                        ).join('')}
                    </div>
                </article>
            `).join('');
            
            console.log('Posts displayed successfully');
        } catch (error) {
            console.error('Error displaying posts:', error);
            const container = document.querySelector('.container');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <h2>Failed to load blog posts</h2>
                        <p>Please try again later. If the problem persists, contact the site administrator.</p>
                        <p class="error-details">${error.message}</p>
                    </div>
                `;
            }
        }
    }

    async loadPostContent() {
        try {
            const pathParts = window.location.pathname.split('/');
            const year = pathParts[pathParts.length - 2];
            const slug = pathParts[pathParts.length - 1];

            console.log('Loading post content:', { year, slug });

            // Load post metadata
            const response = await fetch(`/blog-content/posts/${year}/posts.json`);
            if (!response.ok) throw new Error('Failed to load post metadata');
            
            const data = await response.json();
            console.log('Post metadata loaded:', data);

            const post = data.posts.find(p => p.slug === slug);
            if (!post) throw new Error('Post not found');

            // Load post content
            const contentResponse = await fetch(`/blog-content/posts/${year}/${slug}.md`);
            if (!contentResponse.ok) throw new Error('Failed to load post content');
            
            const content = await contentResponse.text();
            console.log('Post content loaded');
            
            // Display post
            this.displayPost(post, content);
            
        } catch (error) {
            console.error('Error loading post:', error);
            this.displayError(error);
        }
    }

    displayPost(post, content) {
        const postContainer = document.querySelector('.blog-post');
        if (!postContainer) {
            console.error('Blog post container not found');
            return;
        }

        // Clear existing content
        postContainer.innerHTML = '';

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
                · ${post.readingTime} min read
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

        console.log('Post displayed successfully');
    }

    displayError(error) {
        const container = document.querySelector('.container');
        if (!container) return;

        container.innerHTML = `
            <div class="error-message">
                <h2>Post Not Found</h2>
                <p>Sorry, the post you're looking for doesn't exist or has been moved.</p>
                <p class="error-details">${error.message}</p>
                <a href="/blog-content/blog.html">← Back to Blog</a>
            </div>
        `;
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing PostLoader');
    const postLoader = new PostLoader();
    
    if (document.querySelector('.blog-post')) {
        console.log('Blog post page detected');
        postLoader.loadPostContent();
    } else if (document.getElementById('posts-grid')) {
        console.log('Blog listing page detected');
        postLoader.displayPosts();
    } else {
        console.warn('No relevant containers found on page');
    }
});
