// Get all unique tags from blog posts
function getAllTags() {
    const tags = new Set();
    blogPosts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

// Display all tags in the tag cloud
function displayTagCloud() {
    const tagCloud = document.querySelector('.tag-cloud');
    if (!tagCloud) return;

    const tags = getAllTags();
    const tagCounts = {};

    // Count posts per tag
    blogPosts.forEach(post => {
        post.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    tagCloud.innerHTML = tags.map(tag => `
        <a href="#${tag}" class="tag" data-count="${tagCounts[tag]}">
            ${tag} (${tagCounts[tag]})
        </a>
    `).join('');

    // Add click event listeners to tags
    tagCloud.querySelectorAll('.tag').forEach(tagElement => {
        tagElement.addEventListener('click', (e) => {
            e.preventDefault();
            const tag = tagElement.textContent.split(' ')[0];
            filterPostsByTag(tag);
            updateURL(tag);
        });
    });
}

// Function to create HTML for a single post
function createPostHTML(post) {
    return `
        <article class="post">
            <a href="post.html?slug=${post.slug}" class="post-title">${post.title}</a>
            <div class="post-meta">
                ${post.date} · ${post.readTime} min read
            </div>
            <p class="post-excerpt">${post.excerpt}</p>
            <a href="post.html?slug=${post.slug}" class="read-more">Read this post →</a>
            <div class="post-tags">
                ${post.tags.map(tag => `<a href="#${tag}" class="tag">${tag}</a>`).join('')}
            </div>
        </article>
    `;
}

// Filter and display posts by tag
function filterPostsByTag(tag) {
    const filteredPosts = blogPosts.filter(post => post.tags.includes(tag));
    const filteredPostsSection = document.querySelector('.filtered-posts');
    
    if (filteredPosts.length === 0) {
        filteredPostsSection.innerHTML = `<p>No posts found with tag "${tag}"</p>`;
        return;
    }

    filteredPostsSection.innerHTML = `
        <h2>Posts tagged with "${tag}"</h2>
        ${filteredPosts.map(post => createPostHTML(post)).join('')}
    `;

    // Add click event listeners to tag links in filtered posts
    filteredPostsSection.querySelectorAll('.tag').forEach(tagElement => {
        tagElement.addEventListener('click', (e) => {
            e.preventDefault();
            const newTag = tagElement.textContent;
            filterPostsByTag(newTag);
            updateURL(newTag);
        });
    });
}

// Search functionality
function searchPosts(query) {
    if (!query.trim()) {
        document.querySelector('.filtered-posts').innerHTML = '';
        return;
    }

    const searchQuery = query.toLowerCase();
    const filteredPosts = blogPosts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(searchQuery);
        const contentMatch = post.content.toLowerCase().includes(searchQuery);
        const excerptMatch = post.excerpt.toLowerCase().includes(searchQuery);
        const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        
        return titleMatch || contentMatch || excerptMatch || tagsMatch;
    });

    const filteredPostsSection = document.querySelector('.filtered-posts');
    
    if (filteredPosts.length === 0) {
        filteredPostsSection.innerHTML = `<p>No posts found matching "${query}"</p>`;
        return;
    }

    filteredPostsSection.innerHTML = `
        <h2>Search results for "${query}"</h2>
        ${filteredPosts.map(post => createPostHTML(post)).join('')}
    `;
}

// Update URL with the selected tag
function updateURL(tag) {
    window.location.hash = tag;
}

// Check for tag in URL on page load
function checkURLForTag() {
    const tag = window.location.hash.slice(1);
    if (tag) {
        filterPostsByTag(tag);
    }
}

// Event listeners for search
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    searchPosts(e.target.value);
});

document.getElementById('searchButton')?.addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput');
    searchPosts(searchInput.value);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayTagCloud();
    checkURLForTag();
});
