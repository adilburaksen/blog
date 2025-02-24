# Personal Blog

This repository contains the source code for my personal blog, hosted at [hackwith.me](https://hackwith.me).

## Features

- Clean and minimalist design
- Responsive layout for all devices
- Dark mode support
- Blog with tag-based categorization
- Fast loading and optimized performance
- SEO friendly
- PWA support
- Offline reading capability
- Custom 404 and 500 error pages

## Project Structure

```
blog/
├── blog-content/           # Blog content
│   ├── about.html         # About page
│   ├── blog.html          # Blog listing
│   ├── post.html          # Post template
│   ├── tags.html          # Tags page
│   └── posts/             # Blog posts
│       └── 2025/          # Posts organized by year
│           ├── posts.json # Post metadata
│           └── *.md       # Markdown files
├── shared/                # Shared assets
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   │   ├── blog-loader.js    # Blog listing loader
│   │   ├── post-loader.js    # Post content loader
│   │   ├── service-worker.js # PWA service worker
│   │   └── tags.js          # Tag system
│   ├── favicon/          # Favicon assets
│   ├── 404.html         # 404 error page
│   └── 500.html         # 500 error page
├── index.html           # Home page
├── manifest.json        # PWA manifest
├── robots.txt          # Search engine directives
├── sitemap.xml         # Site map
├── netlify.toml        # Netlify configuration
├── CHANGELOG.md        # Change log
└── README.md           # This file
```

## Technology Stack

- HTML5 & CSS3
- Vanilla JavaScript
- Markdown for content
- PWA (Progressive Web App)
- Service Workers for offline support
- Netlify for hosting and deployment

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/adilburaksen/blog.git
   cd blog
   ```

2. Local Development:
   - Use a local server (e.g., Live Server in VS Code)
   - Or use Python's built-in server:
     ```bash
     python -m http.server 8000
     ```

3. Creating New Posts:
   - Add a new Markdown file in `blog-content/posts/YEAR/`
   - Update `blog-content/posts/YEAR/posts.json` with post metadata
   - Follow the existing post format

## Deployment

The site is automatically deployed to Netlify when changes are pushed to the main branch.

## License

This project is open source and available under the MIT License.
