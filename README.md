# Personal Website & Blog

This repository contains the source code for my personal website and blog, hosted at [hackwith.me](https://hackwith.me) and [blog.hackwith.me](https://blog.hackwith.me).

## Features

- Clean and minimalist design
- Responsive layout for all devices
- Dark/Light theme support
- Blog with tag-based categorization
- Fast loading and optimized performance
- SEO friendly

## Project Structure

```
blog/
├── main/               # Main website content (hackwith.me)
│   └── index.html
├── blog-content/       # Blog content (blog.hackwith.me)
│   ├── about.html
│   ├── blog.html
│   ├── post.html
│   ├── tag.html
│   └── tags.html
├── shared/            # Shared assets
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   ├── favicon/      # Favicon assets
│   ├── 404.html     # Error pages
│   └── 500.html
└── netlify.toml      # Netlify configuration
```

## Technology Stack

- HTML5
- CSS3 with modern features
- Vanilla JavaScript
- Font Awesome for icons
- Netlify for hosting and deployment

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/adilburaksen/blog.git
   cd blog
   ```

2. Local Development:
   - Use any static file server to serve the files locally
   - Or simply open `main/index.html` in your browser

3. Making Changes:
   - Edit HTML files in `main/` or `blog-content/`
   - Modify styles in `shared/css/style.css`
   - Update JavaScript in `shared/js/`

## Deployment

This site is automatically deployed through Netlify:
1. Push changes to the main branch
2. Netlify will automatically build and deploy the site
3. Changes will be live in a few minutes

## Security

The site implements several security measures:
- HTTPS enforcement
- Strict Content Security Policy
- XSS protection headers
- Frame protection
- Other security best practices

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, feel free to:
- Visit [hackwith.me/about](https://hackwith.me/about)
- Follow me on Twitter [@adilburaksen](https://twitter.com/adilburaksen)
- Connect on LinkedIn [Adil Burak Şen](https://linkedin.com/in/adilburaksen)
