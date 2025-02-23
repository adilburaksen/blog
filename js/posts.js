// Sample blog posts data
const blogPosts = [
    {
        id: 1,
        title: "Getting Started with Web Development",
        slug: "getting-started-with-web-development",
        date: "2025-02-22",
        readTime: 5,
        excerpt: "Learn the fundamentals of web development and start your journey into the world of coding...",
        tags: ["webdev", "programming", "html", "css", "javascript"],
        content: `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
            <h2>The Basics of HTML</h2>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            
            <h2>CSS Fundamentals</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        `
    },
    {
        id: 2,
        title: "Modern JavaScript Features You Should Know",
        slug: "modern-javascript-features",
        date: "2025-02-21",
        readTime: 7,
        excerpt: "Explore the modern features of JavaScript that every developer should be familiar with...",
        tags: ["javascript", "es6", "programming", "webdev"],
        content: `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.</p>
            
            <h2>Arrow Functions</h2>
            <p>Ut aliquam sollicitudin leo, vitae ultricies erat dapibus quis. Sed vehicula tempus lacus, vel efficitur enim rutrum in. Donec dictum tincidunt erat vel dapibus.</p>
            
            <h2>Destructuring</h2>
            <p>Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        `
    },
    {
        id: 3,
        title: "Building Responsive Layouts with CSS Grid",
        slug: "responsive-layouts-css-grid",
        date: "2025-02-20",
        readTime: 6,
        excerpt: "Master CSS Grid to create modern, responsive web layouts that work across all devices...",
        tags: ["css", "webdev", "responsive", "design"],
        content: `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.</p>
            
            <h2>Grid Basics</h2>
            <p>Ut aliquam sollicitudin leo, vitae ultricies erat dapibus quis. Sed vehicula tempus lacus, vel efficitur enim rutrum in. Donec dictum tincidunt erat vel dapibus.</p>
            
            <h2>Responsive Design</h2>
            <p>Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        `
    },
    {
        id: 4,
        title: "Introduction to React Hooks",
        slug: "introduction-to-react-hooks",
        date: "2025-02-19",
        readTime: 8,
        excerpt: "Learn how to use React Hooks to manage state and side effects in your functional components...",
        tags: ["react", "javascript", "webdev", "programming"],
        content: `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
            
            <h2>useState Hook</h2>
            <p>Ut aliquam sollicitudin leo, vitae ultricies erat dapibus quis. Sed vehicula tempus lacus, vel efficitur enim rutrum in.</p>
            
            <h2>useEffect Hook</h2>
            <p>Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis.</p>
        `
    },
    {
        id: 5,
        title: "TypeScript Best Practices",
        slug: "typescript-best-practices",
        date: "2025-02-18",
        readTime: 6,
        excerpt: "Discover the best practices for writing clean and maintainable TypeScript code...",
        tags: ["typescript", "javascript", "programming"],
        content: `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
            
            <h2>Type Annotations</h2>
            <p>Ut aliquam sollicitudin leo, vitae ultricies erat dapibus quis.</p>
            
            <h2>Interfaces vs Types</h2>
            <p>Cras mattis consectetur purus sit amet fermentum.</p>
        `
    }
];

// Function to convert title to URL-friendly slug
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Display blog posts with pagination
const postsPerPage = 5;
let currentPage = 1;

function displayPosts(page) {
    const postsContainer = document.getElementById('posts');
    if (!postsContainer) return;

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = blogPosts.slice(start, end);

    postsContainer.innerHTML = paginatedPosts.map(post => `
        <article class="post-card">
            <h2><a href="post.html?slug=${post.slug}">${post.title}</a></h2>
            <div class="post-meta">
                <span class="date">${post.date}</span>
                <span class="read-time">${post.readTime} min read</span>
            </div>
            <p class="excerpt">${post.excerpt}</p>
            <div class="tags">
                ${post.tags.map(tag => `
                    <a href="tags.html?tag=${tag}" class="tag">${tag}</a>
                `).join('')}
            </div>
        </article>
    `).join('');

    // Update current page display
    const currentPageSpan = document.getElementById('currentPage');
    if (currentPageSpan) {
        currentPageSpan.textContent = page;
    }

    updatePaginationButtons(page);
}

function updatePaginationButtons(page) {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const totalPages = Math.ceil(blogPosts.length / postsPerPage);
    
    if (prevButton) prevButton.disabled = page <= 1;
    if (nextButton) nextButton.disabled = page >= totalPages;
}

// Event listeners for pagination buttons
document.getElementById('prevPage')?.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPosts(currentPage);
    }
});

document.getElementById('nextPage')?.addEventListener('click', () => {
    if (currentPage < Math.ceil(blogPosts.length / postsPerPage)) {
        currentPage++;
        displayPosts(currentPage);
    }
});

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Display all unique tags
function displayAllTags() {
    const tagsContainer = document.getElementById('tags-list');
    if (!tagsContainer) return;

    // Get all unique tags
    const allTags = [...new Set(blogPosts.flatMap(post => post.tags))].sort();
    
    // Display tags as buttons
    tagsContainer.innerHTML = allTags.map(tag => `
        <button class="tag-button" onclick="filterPostsByTag('${tag}')">
            ${tag}
        </button>
    `).join('');

    // Add active class to selected tag if any
    const selectedTag = getUrlParameter('tag');
    if (selectedTag) {
        const tagButton = tagsContainer.querySelector(`[onclick="filterPostsByTag('${selectedTag}')"]`);
        if (tagButton) {
            tagButton.classList.add('active');
            filterPostsByTag(selectedTag);
        }
    }
}

// Tag filtering functionality
function filterPostsByTag(tag) {
    const tagPostsSection = document.getElementById('tag-posts');
    const postsContainer = document.getElementById('posts');
    const currentTagSpan = document.getElementById('current-tag');
    
    if (!postsContainer || !tagPostsSection || !currentTagSpan) return;

    // Update URL without page reload
    window.history.pushState({}, '', `?tag=${tag}`);
    
    // Update active tag button
    const tagButtons = document.querySelectorAll('.tag-button');
    tagButtons.forEach(button => button.classList.remove('active'));
    const activeButton = document.querySelector(`[onclick="filterPostsByTag('${tag}')"]`);
    if (activeButton) activeButton.classList.add('active');

    // Show posts section
    tagPostsSection.classList.remove('hidden');
    currentTagSpan.textContent = tag;

    // Filter and display posts
    const filteredPosts = blogPosts.filter(post => post.tags.includes(tag));
    
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts">No posts found with this tag.</div>';
        return;
    }

    postsContainer.innerHTML = filteredPosts.map(post => `
        <article class="post-card">
            <h2><a href="post.html?slug=${post.slug}">${post.title}</a></h2>
            <div class="post-meta">
                <span class="date">${post.date}</span>
                <span class="read-time">${post.readTime} min read</span>
            </div>
            <p class="excerpt">${post.excerpt}</p>
            <div class="tags">
                ${post.tags.map(t => `
                    <button class="tag-link" onclick="filterPostsByTag('${t}'); return false;">
                        ${t}
                    </button>
                `).join('')}
            </div>
        </article>
    `).join('');
}

// Initialize tags display if on tags page
if (window.location.pathname.endsWith('tags.html')) {
    displayAllTags();
    
    // Only show posts if a tag is selected
    const selectedTag = getUrlParameter('tag');
    if (selectedTag) {
        filterPostsByTag(selectedTag);
    }
}

// Initial display
displayPosts(currentPage);

// Search functionality
function searchPosts(query) {
    if (!query.trim()) {
        displayPosts(1);
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

    const postsContainer = document.querySelector('.posts');
    postsContainer.innerHTML = '';

    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="no-results">
                <p>No posts found matching "${query}"</p>
            </div>
        `;
        document.querySelector('.pagination').style.display = 'none';
        return;
    }

    filteredPosts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post';
        postElement.innerHTML = `
            <a href="post.html?slug=${post.slug}" class="post-title">${post.title}</a>
            <div class="post-meta">
                ${post.date} · ${post.readTime} min read
            </div>
            <p class="post-excerpt">${post.excerpt}</p>
            <a href="post.html?slug=${post.slug}" class="read-more">Read this post →</a>
            <div class="post-tags">
                ${post.tags.map(tag => `<a href="tags.html#${tag}" class="tag">${tag}</a>`).join('')}
            </div>
        `;
        postsContainer.appendChild(postElement);
    });

    document.querySelector('.pagination').style.display = 'none';
}

// Event listeners for search
document.getElementById('searchInput').addEventListener('input', (e) => {
    searchPosts(e.target.value);
});

document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput');
    searchPosts(searchInput.value);
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchPosts(e.target.value);
    }
});

// Function to create new post
function createNewPost(title, date, readTime, excerpt, tags, content) {
    const newPost = {
        id: blogPosts.length + 1,
        title,
        slug: slugify(title),
        date,
        readTime,
        excerpt,
        tags,
        content
    };
    blogPosts.push(newPost);
    return newPost;
}
