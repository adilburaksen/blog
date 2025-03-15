# Terminal-Themed Personal Blog

A minimalist, terminal-themed blog built with 11ty (Eleventy) static site generator. The site features a retro terminal aesthetic with multiple color schemes and responsive design.

Live demo: [hackwith.me](https://hackwith.me)

## Features

- 🖥️ Terminal-like interface
- 🎨 Multiple color themes:
  - Matrix (Classic green)
  - Cyber (Neon blue)
  - Amber (Retro orange)
  - Neon (Purple)
- 🔍 Full-text search functionality
- 📱 Responsive design
- 💾 Local storage for theme preferences
- ⌨️ Terminal-style navigation
- 📝 Markdown support for blog posts
- 🏷️ Tag system for posts

## Tech Stack

- [11ty](https://www.11ty.dev/) - Static Site Generator
- [Nunjucks](https://mozilla.github.io/nunjucks/) - Templating Engine
- HTML/CSS/JavaScript
- [Font Awesome](https://fontawesome.com/) - Icons
- [Fira Code](https://github.com/tonsky/FiraCode) - Monospace Font

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adilburaksen/blog.git
cd blog
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm start
```

The site will be available at `http://localhost:8080`

### Building

To build the site for production:

```bash
npm run build
```

## Blog Post Format

Create new blog posts in the `posts` directory using the following frontmatter format:

```markdown
---
layout: post.njk
title: Your Post Title
description: Brief description of your post
date: YYYY-MM-DD
tags:
  - tag1
  - tag2
---

Your post content here...
```

## Deployment

This site is deployed on Netlify. The `netlify.toml` file contains the necessary build configurations.

## License

MIT License - feel free to use this code for your own projects.

## Author

Adil Burak ŞEN
- LinkedIn: [adilburaksen](https://linkedin.com/in/adilburaksen)
- GitHub: [adilburaksen](https://github.com/adilburaksen)
- X: [adilburaksen](https://x.com/adilburaksen)

## Acknowledgments

- Inspired by retro terminal interfaces
- Built with modern web technologies
- Focused on user experience and accessibility 