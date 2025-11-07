# Personal Portfolio Website

A modern, responsive personal portfolio website built with vanilla HTML, CSS, and JavaScript. Features a clean design, smooth animations, and excellent performance.

## 🚀 Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Dark Mode**: Toggle between light and dark themes with localStorage persistence
- **Smooth Animations**: Vanilla JavaScript animations with fade-in effects
- **Interactive Elements**:
  - Expandable timeline for education and work experience
  - Lightbox gallery for project screenshots
  - Searchable blog posts with keyword highlighting
  - Filterable publications by year
- **Accessibility**: WCAG AA compliant with ARIA attributes and keyboard navigation
- **Performance**: Optimized loading with lazy loading and minimal file sizes
- **SEO Friendly**: Proper meta tags, semantic HTML, and structured data

## 📁 File Structure

```
portfolio/
├── index.html          # Main HTML file with all sections
├── styles.css          # Complete styling with responsive design
├── script.js           # Vanilla JavaScript functionality
└── README.md          # This documentation file
```

## 🛠️ Quick Start

### Local Development

1. **Clone or download** the files to your local machine
2. **Start a local server** (choose one of the options below):

   ```bash
   # Python 3
   python3 -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (requires http-server)
   npx http-server

   # PHP
   php -S localhost:8000
   ```

3. **Open your browser** and navigate to `http://localhost:8000`

### Hosting

The website is completely static and can be hosted on any web server:

- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Netlify**: Drag and drop the files or connect a Git repository
- **Vercel**: Connect your Git repository for automatic deployment
- **Traditional hosting**: Upload files via FTP to any web host

## 🎨 Customization Guide

### 1. Personal Information

Edit `index.html` to update:

```html
<!-- Hero Section -->
<h1 class="hero-name">Your Name Here</h1>
<p class="hero-tagline">Your Professional Title</p>

<!-- Contact Information -->
<a href="mailto:your.email@example.com">your.email@example.com</a>
<p>Your City, State</p>
<a href="tel:+1234567890">(123) 456-7890</a>
```

### 2. Social Media Links

Update the social links in the About section:

```html
<a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener">
<a href="https://github.com/yourusername" target="_blank" rel="noopener">
<a href="https://twitter.com/yourhandle" target="_blank" rel="noopener">
```

### 3. Colors and Styling

Modify the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #your-primary-color;
    --secondary-color: #your-secondary-color;
    --accent-color: #your-accent-color;
    --background-color: #your-background;
    --text-primary: #your-text-color;
}
```

### 4. Content Sections

#### Projects
Add new projects by copying the existing structure:

```html
<div class="project-card">
    <div class="project-image">
        <img src="your-project-image.jpg" alt="Project Name" class="project-img" loading="lazy">
    </div>
    <div class="project-content">
        <h3 class="project-title">Project Title</h3>
        <p class="project-description">Project description...</p>
        <div class="project-tech">
            <span class="tech-tag">Technology 1</span>
            <span class="tech-tag">Technology 2</span>
        </div>
    </div>
</div>
```

#### Blog Posts
Add new blog posts:

```html
<article class="blog-card">
    <div class="blog-image">
        <img src="blog-image.jpg" alt="Blog post title" class="blog-img" loading="lazy">
    </div>
    <div class="blog-content">
        <div class="blog-meta">
            <span class="blog-date">December 1, 2023</span>
            <span class="blog-category">Category</span>
        </div>
        <h3 class="blog-title">Blog Post Title</h3>
        <p class="blog-excerpt">Post excerpt...</p>
        <a href="#" class="blog-read-more">Read More →</a>
    </div>
</article>
```

#### Publications
Add academic or professional publications:

```html
<div class="publication-item" data-year="2023" data-category="conference">
    <div class="publication-content">
        <h3 class="publication-title">Publication Title</h3>
        <p class="publication-authors">Your Name, Co-author</p>
        <p class="publication-venue">Conference Name, 2023</p>
        <p class="publication-date">Month Year</p>
    </div>
</div>
```

### 5. Images

Replace placeholder images with your own:

1. **Profile Photo**: Replace the SVG in the hero section
2. **Project Screenshots**: Update `src` attributes in project cards
3. **Blog Images**: Update blog post images
4. **Favicon**: Add a proper favicon.ico file

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (stacked layout, mobile menu)
- **Tablet**: 768px - 1023px (2-column layouts)
- **Desktop**: > 1024px (multi-column layouts)

## 🎯 Performance Optimizations

- **Lazy Loading**: Images load only when needed
- **Minified Code**: CSS and JS are optimized
- **Efficient Animations**: Uses CSS transforms and opacity
- **Preloading**: Critical resources load first
- **No External Dependencies**: Everything is self-contained

## ♿ Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Attributes**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Supports high contrast mode
- **Reduced Motion**: Respects user motion preferences
- **Focus Management**: Visible focus indicators

## 🌙 Dark Mode

The website automatically remembers your theme preference. Toggle using the moon/sun icon in the navigation.

## 🔍 SEO Optimization

- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Structured Data**: Proper semantic markup
- **Fast Loading**: Optimized for Core Web Vitals
- **Mobile Friendly**: Responsive design with proper viewport

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**: Check file paths and ensure images are in the correct directory
2. **JavaScript not working**: Ensure script.js is loaded after the DOM elements
3. **Styling issues**: Check that styles.css is linked properly
4. **Mobile menu not working**: Verify hamburger menu HTML structure

### Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 📞 Support

For customization help or issues:

1. Check the browser console for JavaScript errors
2. Validate HTML using the W3C validator
3. Test responsiveness using browser dev tools
4. Ensure all file paths are correct

## 📄 License

This project is open source and available under the MIT License. Feel free to use it for your own portfolio!

## 🙏 Credits

Built with vanilla HTML, CSS, and JavaScript. No frameworks or external libraries required.

---

**Last Updated**: November 2023
**Version**: 1.0.0
