/**
 * Portfolio Website JavaScript
 * Vanilla JS implementation with modern ES6+ features
 * Includes navigation, animations, interactivity, and accessibility features
 */

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Load all dynamic content first
    await loadAllData();

    // Initialize all modules after content is loaded
    initNavigation();
    initThemeToggle();
    initTimelineAccordions();
    initProjectLightbox();
    initBlogSearch(); // Keeps its own data loading logic for now
    initPublicationFilters();
    initBackToTop();
    initFormHandling();
    initLazyLoading();
    initKeyboardNavigation();
    initScrollAnimations();

    // Performance: Preload critical resources
    preloadCriticalResources();

    // Initialize meta tag updates
    updateMetaTags();
    window.addEventListener('scroll', updateMetaTags);
    window.addEventListener('resize', updateMetaTags);
}

// ===== DATA LOADING & RENDERING =====
async function loadAllData() {
    try {
        const [configRes, educationRes, experienceRes, projectsRes, publicationsRes] = await Promise.all([
            fetch('data/config.json'),
            fetch('data/education.json'),
            fetch('data/experience.json'),
            fetch('data/projects.json'),
            fetch('data/publications.json')
        ]);

        const config = await configRes.json();
        const education = await educationRes.json();
        const experience = await experienceRes.json();
        const projects = await projectsRes.json();
        const publications = await publicationsRes.json();

        renderHero(config);
        renderAbout(config);
        renderContact(config);
        renderEducation(education);
        renderExperience(experience);
        renderProjects(projects);
        renderPublications(publications);

    } catch (error) {
        console.error('Error loading data:', error);
        // Handle error (e.g., show offline message)
    }
}

function renderHero(config) {
    document.getElementById('hero-name').textContent = config.name;
    document.getElementById('hero-tagline').textContent = config.tagline;
    
    const descContainer = document.getElementById('hero-description');
    descContainer.innerHTML = `<p>${config.description}</p>`;

    const profileContainer = document.querySelector('.profile-container');
    if (config.images && config.images.profile) {
        const img = document.createElement('img');
        img.src = config.images.profile;
        img.alt = `${config.name} - Professional Headshot`;
        img.className = 'profile-photo';
        img.loading = 'eager';
        profileContainer.appendChild(img);
    }
}

function renderAbout(config) {
    const aboutText = document.getElementById('about-text');
    const aboutImageContainer = document.getElementById('about-image-container');

    // Render Bio Paragraphs
    if (config.about && config.about.bio) {
        config.about.bio.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            aboutText.appendChild(p);
        });
    }

    // Render Personal Info Section
    const personalInfo = document.createElement('div');
    personalInfo.className = 'personal-info';
    
    let socialLinksHtml = '';
    if (config.social) {
        socialLinksHtml = config.social.map(link => `
            <a href="${link.url}" target="_blank" rel="noopener" aria-label="${link.name} Profile">
                <span class="social-icon">${link.icon}</span> ${link.name}
            </a>
        `).join('');
    }

    personalInfo.innerHTML = `
        <h3>Contact Information</h3>
        <ul class="contact-list">
            <li><strong>Email:</strong> <a href="mailto:${config.email}">${config.email}</a></li>
            <li><strong>Location:</strong> ${config.location}</li>
            <li><strong>Phone:</strong> <a href="tel:${config.phone.replace(/\D/g,'')}">${config.phone}</a></li>
        </ul>

        <h3>Social Links</h3>
        <div class="social-links">
            ${socialLinksHtml}
        </div>
    `;
    aboutText.appendChild(personalInfo);

    // Render About Image
    if (config.images && config.images.about) {
        const img = document.createElement('img');
        img.src = config.images.about;
        img.alt = `About ${config.name}`;
        img.className = 'about-photo';
        aboutImageContainer.appendChild(img);
    }
}

function renderEducation(education) {
    const timeline = document.getElementById('education-timeline');
    
    education.forEach(item => {
        const el = document.createElement('div');
        el.className = 'timeline-item';
        el.setAttribute('data-expanded', 'false');

        const detailsHtml = item.details.map(detail => {
            if (detail.startsWith('Thesis:') || detail.startsWith('Research') || detail.startsWith('Teaching')) {
                 return `<li>${detail}</li>`; // Just assuming list items for these based on original HTML
            }
            return `<p>${detail}</p>`;
        }).join('');
        
        // Fix list grouping:
        // The original HTML had mixed <p> and <ul>. 
        // JSON structure: "details": ["GPA...", "Spec...", "Thesis...", ...]
        // Let's group list-like items (Thesis, Research, etc.) into a UL if they look like list items.
        // Simple heuristic: if it doesn't start with "GPA" or "Dean's", treat as list item? 
        // Or just output all as <p> or <li> inside a <ul>?
        // Original had <p> for GPA/Specialization and <ul> for others.
        
        let contentHtml = '';

        if (item.overview.length > 0) {
            contentHtml += `${item.overview.map(o => `<p>${o}</p>`).join('')}`;
        }
        if (item.details.length > 0) {
            contentHtml += `<ul>${item.details.map(li => `<li>${li}</li>`).join('')}</ul>`;
        }

        el.innerHTML = `
            <div class="timeline-header" tabindex="0">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-subtitle">${item.subtitle}</p>
                    <span class="timeline-date">${item.date}</span>
                </div>
                <div class="timeline-toggle">
                    <span class="toggle-icon">+</span>
                </div>
            </div>
            <div class="timeline-details">
                ${contentHtml}
            </div>
        `;
        timeline.appendChild(el);
    });
}

function renderExperience(experience) {
    const timeline = document.getElementById('experience-timeline');
    
    experience.forEach(item => {
        const el = document.createElement('div');
        el.className = 'timeline-item';
        el.setAttribute('data-expanded', 'false');
        
        // Work experience usually has a description (first item) and then bullets.
        // JSON: "details": ["Led dev...", "Architected...", ...]
        // First item as <p>, rest as <ul>
        
        let contentHtml = '';
        if (item.overview.length > 0) {
            contentHtml += `${item.overview.map(o => `<p>${o}</p>`).join('')}`;
        }
        if (item.details.length > 0) {
            contentHtml += `<ul>${item.details.map(li => `<li>${li}</li>`).join('')}</ul>`;
        }
        // if (item.details.length > 0) {
        //     contentHtml += `<p>${item.details[0]}</p>`;
        //     if (item.details.length > 1) {
        //         contentHtml += `<ul>${item.details.slice(1).map(li => `<li>${li}</li>`).join('')}</ul>`;
        //     }
        // }

        el.innerHTML = `
            <div class="timeline-header" tabindex="0">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-subtitle">${item.subtitle}</p>
                    <span class="timeline-date">${item.date}</span>
                </div>
                <div class="timeline-toggle">
                    <span class="toggle-icon">+</span>
                </div>
            </div>
            <div class="timeline-details">
                ${contentHtml}
            </div>
        `;
        timeline.appendChild(el);
    });
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    
    projects.forEach(project => {
        const el = document.createElement('div');
        el.className = 'project-card';
        
        const techTags = project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
        
        el.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy">
                <div class="project-overlay">
                    <div class="project-links">
                        <a href="${project.links.demo}" class="project-link" aria-label="View live demo">🔗 Live Demo</a>
                        <a href="${project.links.code}" target="_blank" rel="noopener" class="project-link" aria-label="View GitHub repo">💻 Code</a>
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${techTags}
                </div>
            </div>
        `;
        grid.appendChild(el);
    });
}

function renderPublications(publications) {
    const list = document.getElementById('publications-list');
    const filtersContainer = document.getElementById('publication-filters');
    
    // Extract unique years for filters
    const years = [...new Set(publications.map(p => {
        // Extract year from date string (e.g., "July 2023" -> "2023")
        const match = p.date.match(/\d{4}/);
        return match ? match[0] : '';
    }))].filter(y => y).sort().reverse();

    // Render filters
    let filtersHtml = `<button class="filter-btn active" data-filter="all">All</button>`;
    years.forEach(year => {
        filtersHtml += `<button class="filter-btn" data-filter="${year}">${year}</button>`;
    });
    filtersContainer.innerHTML = filtersHtml;

    // Render items
    publications.forEach(pub => {
        const year = pub.date.match(/\d{4}/) ? pub.date.match(/\d{4}/)[0] : '';
        const el = document.createElement('div');
        el.className = 'publication-item';
        el.setAttribute('data-year', year);
        el.setAttribute('data-category', pub.category);
        
        let linksHtml = '';
        if (pub.links) {
            for (const [key, url] of Object.entries(pub.links)) {
                let icon = '🔗';
                let label = key.toUpperCase();
                if (key === 'pdf') icon = '📄';
                if (key === 'cite') icon = '📚';
                
                linksHtml += `<a href="${url}" class="publication-link" aria-label="${label}">${icon} ${label}</a>`;
            }
        }

        el.innerHTML = `
            <div class="publication-content">
                <h3 class="publication-title">${pub.title}</h3>
                <p class="publication-authors">${pub.authors}</p>
                <p class="publication-venue">${pub.venue}</p>
                <p class="publication-date">${pub.date}</p>
                <div class="publication-links">
                    ${linksHtml}
                </div>
            </div>
        `;
        list.appendChild(el);
    });
}

function renderContact(config) {
    const contactInfo = document.getElementById('contact-info');
    contactInfo.innerHTML = `
        <div class="contact-item">
            <h3>📧 Email</h3>
            <p><a href="mailto:${config.email}">${config.email}</a></p>
        </div>
        <div class="contact-item">
            <h3>📍 Location</h3>
            <p>${config.location}</p>
        </div>
        <div class="contact-item">
            <h3>📱 Phone</h3>
            <p><a href="tel:${config.phone.replace(/\D/g,'')}">${config.phone}</a></p>
        </div>
        <div class="contact-item">
            <h3>🕒 Response Time</h3>
            <p>${config.responseTime}</p>
        </div>
    `;
}

function updateMetaTags() {
    // Get all sections
    const sections = document.querySelectorAll('section[id]');
    let currentSection = null;
    let maxVisibleArea = 0;

    // Find the section with the most visible area
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
        const visibleArea = visibleHeight * visibleWidth;

        if (visibleArea > maxVisibleArea) {
            maxVisibleArea = visibleArea;
            currentSection = section;
        }
    });

    if (currentSection) {
        const sectionId = currentSection.id;
        const metaTitle = document.querySelector('title');
        const metaDescription = document.getElementById('meta-description');
        
        // Basic update logic - in a real app, this might come from config too
        const baseTitle = "John Doe - Software Engineer";
        metaTitle.textContent = `${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} | ${baseTitle}`;
        if (metaDescription) {
             metaDescription.content = `View details about ${sectionId} section.`;
        }
    }
}

// ===== NAVIGATION SYSTEM =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navigation with scroll effect
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // Mobile hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Update ARIA attributes
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu after navigation
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== THEME TOGGLE (DARK MODE) =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update icon
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';

        // Update ARIA label
        themeToggle.setAttribute('aria-label',
            theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
        );
    }
}

// ===== TIMELINE ACCORDIONS =====
function initTimelineAccordions() {
    // Since content is dynamic, we need to use event delegation or attach listeners after render.
    // initializeApp calls this AFTER loadAllData, so simple selection works if called there.
    // However, to be safe and robust for future dynamic updates, we can use event delegation on the container.

    const timelines = document.querySelectorAll('.timeline');
    
    timelines.forEach(timeline => {
        timeline.addEventListener('click', (e) => {
            const header = e.target.closest('.timeline-header');
            if (!header) return;

            const timelineItem = header.closest('.timeline-item');
            const isExpanded = timelineItem.getAttribute('data-expanded') === 'true';

            // Close all other accordions in the same timeline
            const allItems = timeline.querySelectorAll('.timeline-item');
            allItems.forEach(item => {
                item.setAttribute('data-expanded', 'false');
            });

            // Toggle current accordion
            timelineItem.setAttribute('data-expanded', !isExpanded);
        });
        
        // Keyboard accessibility for delegation
        timeline.addEventListener('keydown', (e) => {
            const header = e.target.closest('.timeline-header');
            if (!header) return;
            
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

// ===== PROJECT LIGHTBOX =====
function initProjectLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    // Note: projectImages will be empty if called before render, but we call it after.
    // Better to re-query or use delegation.
    
    let currentImageIndex = 0;
    let imageArray = [];

    // We need to rebuild the image array since projects are dynamic
    // This function should be safe to call after renderProjects
    const projectImages = document.querySelectorAll('.project-img');
    
    imageArray = Array.from(projectImages).map((img, index) => {
        // Attach click listener
        img.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
        
        return {
            src: img.src,
            alt: img.alt,
            index: index
        };
    });

    function openLightbox(index) {
        if (index < 0 || index >= imageArray.length) return;
        currentImageIndex = index;
        const imageData = imageArray[index];

        lightboxImg.src = imageData.src;
        lightboxImg.alt = imageData.alt;
        lightboxCaption.textContent = imageData.alt;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Animate in
        requestAnimationFrame(() => {
            lightbox.classList.add('show');
        });
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Reset image after animation
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxCaption.textContent = '';
        }, 300);
    }

    // Close lightbox events
    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });

    function navigateLightbox(direction) {
        currentImageIndex = (currentImageIndex + direction + imageArray.length) % imageArray.length;
        openLightbox(currentImageIndex);
    }
}

// ===== BLOG PAGE GENERATION =====
function generateBlogPageTemplate(blogData, filename) {
    const slug = filename.replace('.json', '');
    const pageTitle = `${blogData.title} | Blog`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${blogData.excerpt}">
    <meta name="keywords" content="blog, ${blogData.category.toLowerCase()}, technology, development">
    <meta name="author" content="John Doe">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${blogData.title}">
    <meta property="og:description" content="${blogData.excerpt}">
    <meta property="og:image" content="${blogData.image}">
    <meta property="og:url" content="https://yourwebsite.com/blogpages/${slug}.html">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${blogData.title}">
    <meta property="twitter:description" content="${blogData.excerpt}">
    <meta property="twitter:image" content="${blogData.image}">

    <title>${pageTitle}</title>

    <!-- Favicon -->
    <link rel="icon" href="../favicon.ico" type="image/x-icon">

    <!-- CSS -->
    <link rel="stylesheet" href="../styles.css">

    <style>
        /* Blog Page Specific Styles */
        .blog-page-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
            color: white;
            padding: 4rem 0 3rem;
            margin-bottom: 3rem;
        }

        .blog-page-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .blog-page-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .blog-page-category {
            background: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 500;
            font-size: 0.85rem;
        }

        .blog-page-content {
            line-height: 1.8;
            font-size: 1.1rem;
            color: var(--text-primary);
        }

        .blog-page-content h2 {
            color: var(--primary-color);
            margin: 2rem 0 1rem;
            font-size: 1.8rem;
        }

        .blog-page-content h3 {
            color: var(--text-primary);
            margin: 1.5rem 0 0.8rem;
            font-size: 1.4rem;
        }

        .blog-page-content p {
            margin-bottom: 1.5rem;
        }

        .blog-page-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 2rem 0;
        }

        .blog-page-content blockquote {
            border-left: 4px solid var(--primary-color);
            margin: 2rem 0;
            padding: 1rem 2rem;
            background: var(--surface-color);
            font-style: italic;
            color: var(--text-secondary);
        }

        .blog-page-content code {
            background: var(--surface-color);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: var(--accent-color);
        }

        .blog-page-content pre {
            background: var(--surface-color);
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 2rem 0;
        }

        .blog-page-content pre code {
            background: none;
            padding: 0;
            color: inherit;
        }

        .blog-page-back {
            display: inline-flex;
            align-items: center;
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            margin-bottom: 2rem;
            transition: color var(--transition-fast);
        }

        .blog-page-back:hover {
            color: var(--accent-color);
        }

        .blog-page-back::before {
            content: '←';
            margin-right: 0.5rem;
        }

        .blog-page-footer {
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
            text-align: center;
            color: var(--text-secondary);
        }

        .blog-page-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 2rem 0;
        }

        .blog-page-tag {
            background: var(--surface-color);
            color: var(--text-secondary);
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
        }

        /* Share buttons */
        .blog-share {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin: 3rem 0;
            padding: 1.5rem;
            background: var(--surface-color);
            border-radius: 12px;
        }

        .blog-share-text {
            font-weight: 500;
            color: var(--text-primary);
        }

        .blog-share-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .share-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            text-decoration: none;
            transition: all var(--transition-fast);
        }

        .share-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--shadow-color);
        }

        .share-button.twitter { background: #1da1f2; }
        .share-button.facebook { background: #4267b2; }
        .share-button.linkedin { background: #0077b5; }
        .share-button.copy { background: var(--accent-color); }

        @media (max-width: 768px) {
            .blog-page-container {
                padding: 0 1rem;
            }

            .blog-page-header {
                padding: 3rem 0 2rem;
            }

            .blog-page-meta {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }

            .blog-page-content {
                font-size: 1rem;
            }

            .blog-share {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>
<body data-theme="light">
    <!-- Skip to content link for accessibility -->
    <a href="#main-content" class="skip-link sr-only">Skip to main content</a>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="../index.html" class="nav-logo">John Doe</a>
            </div>
            <button class="hamburger" id="hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
            <div class="nav-menu" id="nav-menu">
                <ul class="nav-list">
                    <li><a href="../index.html#hero" class="nav-link">Home</a></li>
                    <li><a href="../index.html#about" class="nav-link">About</a></li>
                    <li><a href="../index.html#education" class="nav-link">Education</a></li>
                    <li><a href="../index.html#experience" class="nav-link">Experience</a></li>
                    <li><a href="../index.html#projects" class="nav-link">Projects</a></li>
                    <li><a href="../index.html#publications" class="nav-link">Publications</a></li>
                    <li><a href="../index.html#blogs" class="nav-link">Blogs</a></li>
                    <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
                </ul>
            </div>
            <div class="nav-controls">
                <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
                    <span class="theme-icon">🌙</span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main id="main-content">
        <header class="blog-page-header">
            <div class="blog-page-container">
                <a href="../index.html#blogs" class="blog-page-back">Back to Blogs</a>
                <h1 style="color: white; font-size: 2.5rem; margin-bottom: 1rem; line-height: 1.2;">${blogData.title}</h1>
                <div class="blog-page-meta">
                    <span class="blog-date">${blogData.date}</span>
                    <span class="blog-page-category">${blogData.category}</span>
                </div>
            </div>
        </header>

        <div class="blog-page-container">
            <!-- Blog Image -->
            ${blogData.image ? `
            <div style="margin-bottom: 3rem;">
                <img src="${blogData.image}" alt="${blogData.title}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 20px var(--shadow-color);">
            </div>
            ` : ''}

            <!-- Share Buttons -->
            <div class="blog-share">
                <span class="blog-share-text">Share this article:</span>
                <div class="blog-share-buttons">
                    <a href="#" class="share-button twitter" onclick="shareOnTwitter()" aria-label="Share on Twitter">
                        <span>🐦</span>
                    </a>
                    <a href="#" class="share-button facebook" onclick="shareOnFacebook()" aria-label="Share on Facebook">
                        <span>📘</span>
                    </a>
                    <a href="#" class="share-button linkedin" onclick="shareOnLinkedIn()" aria-label="Share on LinkedIn">
                        <span>💼</span>
                    </a>
                    <a href="#" class="share-button copy" onclick="copyLink()" aria-label="Copy link">
                        <span>📋</span>
                    </a>
                </div>
            </div>

            <!-- Blog Content -->
            <article class="blog-page-content">
                <div id="blog-content">
                    <!-- Content will be loaded here -->
                    <div style="text-align: center; padding: 4rem 0; color: var(--text-secondary);">
                        <p>Loading blog content...</p>
                    </div>
                </div>
            </article>

            <!-- Tags (if available) -->
            ${blogData.tags && blogData.tags.length > 0 ? `
            <div class="blog-page-tags">
                ${blogData.tags.map(tag => `<span class="blog-page-tag">${tag}</span>`).join('')}
            </div>
            ` : ''}

            <!-- Footer -->
            <footer class="blog-page-footer">
                <p>© 2024 John Doe. All rights reserved.</p>
                <p style="margin-top: 0.5rem;">
                    <a href="../index.html#contact" style="color: var(--primary-color); text-decoration: none;">Get in touch</a> |
                    <a href="../index.html#blogs" style="color: var(--primary-color); text-decoration: none;">More articles</a>
                </p>
            </footer>
        </div>
    </main>

    <!-- Scripts -->
    <script src="../script.js"></script>
    <script>
        // Blog-specific JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            // Load blog content from JSON
            fetch('../blogs/${filename}')
                .then(response => response.json())
                .then(blogData => {
                    const contentElement = document.getElementById('blog-content');
                    if (blogData.content) {
                        contentElement.innerHTML = blogData.content;
                    } else {
                        // Generate placeholder content if no content field exists
                        contentElement.innerHTML = generatePlaceholderContent(blogData);
                    }
                })
                .catch(error => {
                    console.error('Error loading blog content:', error);
                    document.getElementById('blog-content').innerHTML = '<p style="color: var(--text-secondary);">Sorry, there was an error loading this blog post.</p>';
                });

            // Initialize theme toggle for blog page
            const themeToggle = document.getElementById('theme-toggle');
            const themeIcon = themeToggle.querySelector('.theme-icon');
            const body = document.body;

            const savedTheme = localStorage.getItem('theme') || 'light';
            setTheme(savedTheme);

            themeToggle.addEventListener('click', () => {
                const currentTheme = body.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
            });

            function setTheme(theme) {
                body.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
                themeToggle.setAttribute('aria-label',
                    theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
                );
            }

            // Share functions
            window.shareOnTwitter = function() {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent('${blogData.title}');
                window.open(\`https://twitter.com/intent/tweet?url=\${url}&text=\${text}\`, '_blank');
            };

            window.shareOnFacebook = function() {
                const url = encodeURIComponent(window.location.href);
                window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${url}\`, '_blank');
            };

            window.shareOnLinkedIn = function() {
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent('${blogData.title}');
                window.open(\`https://www.linkedin.com/sharing/share-offsite/?url=\${url}\`, '_blank');
            };

            window.copyLink = function() {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('Link copied to clipboard!');
                }).catch(() => {
                    alert('Failed to copy link');
                });
            };
        });
    </script>
</body>
</html>`;
}

function generateBlogPageTemplate(blogData, filename) {
    const slug = filename.replace('.json', '');
    const pageTitle = `${blogData.title} | Blog`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${blogData.excerpt}">
    <meta name="keywords" content="blog, ${blogData.category.toLowerCase()}, technology, development">
    <meta name="author" content="John Doe">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${blogData.title}">
    <meta property="og:description" content="${blogData.excerpt}">
    <meta property="og:image" content="${blogData.image}">
    <meta property="og:url" content="https://yourwebsite.com/blogpages/${slug}.html">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${blogData.title}">
    <meta property="twitter:description" content="${blogData.excerpt}">
    <meta property="twitter:image" content="${blogData.image}">

    <title>${pageTitle}</title>

    <!-- Favicon -->
    <link rel="icon" href="../favicon.ico" type="image/x-icon">

    <!-- CSS -->
    <link rel="stylesheet" href="../styles.css">

    <style>
        /* Blog Page Specific Styles */
        .blog-page-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
            color: white;
            padding: 4rem 0 3rem;
            margin-bottom: 3rem;
        }

        .blog-page-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .blog-page-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .blog-page-category {
            background: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 500;
            font-size: 0.85rem;
        }

        .blog-page-content {
            line-height: 1.8;
            font-size: 1.1rem;
            color: var(--text-primary);
        }

        .blog-page-content h2 {
            color: var(--primary-color);
            margin: 2rem 0 1rem;
            font-size: 1.8rem;
        }

        .blog-page-content h3 {
            color: var(--text-primary);
            margin: 1.5rem 0 0.8rem;
            font-size: 1.4rem;
        }

        .blog-page-content p {
            margin-bottom: 1.5rem;
        }

        .blog-page-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 2rem 0;
        }

        .blog-page-content blockquote {
            border-left: 4px solid var(--primary-color);
            margin: 2rem 0;
            padding: 1rem 2rem;
            background: var(--surface-color);
            font-style: italic;
            color: var(--text-secondary);
        }

        .blog-page-content code {
            background: var(--surface-color);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: var(--accent-color);
        }

        .blog-page-content pre {
            background: var(--surface-color);
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 2rem 0;
        }

        .blog-page-content pre code {
            background: none;
            padding: 0;
            color: inherit;
        }

        .blog-page-back {
            display: inline-flex;
            align-items: center;
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            margin-bottom: 2rem;
            transition: color var(--transition-fast);
        }

        .blog-page-back:hover {
            color: var(--accent-color);
        }

        .blog-page-back::before {
            content: '←';
            margin-right: 0.5rem;
        }

        .blog-page-footer {
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
            text-align: center;
            color: var(--text-secondary);
        }

        .blog-page-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 2rem 0;
        }

        .blog-page-tag {
            background: var(--surface-color);
            color: var(--text-secondary);
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
        }

        /* Share buttons */
        .blog-share {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin: 3rem 0;
            padding: 1.5rem;
            background: var(--surface-color);
            border-radius: 12px;
        }

        .blog-share-text {
            font-weight: 500;
            color: var(--text-primary);
        }

        .blog-share-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .share-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            text-decoration: none;
            transition: all var(--transition-fast);
        }

        .share-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--shadow-color);
        }

        .share-button.twitter { background: #1da1f2; }
        .share-button.facebook { background: #4267b2; }
        .share-button.linkedin { background: #0077b5; }
        .share-button.copy { background: var(--accent-color); }

        @media (max-width: 768px) {
            .blog-page-container {
                padding: 0 1rem;
            }

            .blog-page-header {
                padding: 3rem 0 2rem;
            }

            .blog-page-meta {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }

            .blog-page-content {
                font-size: 1rem;
            }

            .blog-share {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>
<body data-theme="light">
    <!-- Skip to content link for accessibility -->
    <a href="#main-content" class="skip-link sr-only">Skip to main content</a>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="../index.html" class="nav-logo">John Doe</a>
            </div>
            <button class="hamburger" id="hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
            <div class="nav-menu" id="nav-menu">
                <ul class="nav-list">
                    <li><a href="../index.html#hero" class="nav-link">Home</a></li>
                    <li><a href="../index.html#about" class="nav-link">About</a></li>
                    <li><a href="../index.html#education" class="nav-link">Education</a></li>
                    <li><a href="../index.html#experience" class="nav-link">Experience</a></li>
                    <li><a href="../index.html#projects" class="nav-link">Projects</a></li>
                    <li><a href="../index.html#publications" class="nav-link">Publications</a></li>
                    <li><a href="../index.html#blogs" class="nav-link">Blogs</a></li>
                    <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
                </ul>
            </div>
            <div class="nav-controls">
                <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
                    <span class="theme-icon">🌙</span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main id="main-content">
        <header class="blog-page-header">
            <div class="blog-page-container">
                <a href="../index.html#blogs" class="blog-page-back">Back to Blogs</a>
                <h1 style="color: white; font-size: 2.5rem; margin-bottom: 1rem; line-height: 1.2;">${blogData.title}</h1>
                <div class="blog-page-meta">
                    <span class="blog-date">${blogData.date}</span>
                    <span class="blog-page-category">${blogData.category}</span>
                </div>
            </div>
        </header>

        <div class="blog-page-container">
            <!-- Blog Image -->
            ${blogData.image ? `
            <div style="margin-bottom: 3rem;">
                <img src="${blogData.image}" alt="${blogData.title}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 20px var(--shadow-color);">
            </div>
            ` : ''}

            <!-- Share Buttons -->
            <div class="blog-share">
                <span class="blog-share-text">Share this article:</span>
                <div class="blog-share-buttons">
                    <a href="#" class="share-button twitter" onclick="shareOnTwitter()" aria-label="Share on Twitter">
                        <span>🐦</span>
                    </a>
                    <a href="#" class="share-button facebook" onclick="shareOnFacebook()" aria-label="Share on Facebook">
                        <span>📘</span>
                    </a>
                    <a href="#" class="share-button linkedin" onclick="shareOnLinkedIn()" aria-label="Share on LinkedIn">
                        <span>💼</span>
                    </a>
                    <a href="#" class="share-button copy" onclick="copyLink()" aria-label="Copy link">
                        <span>📋</span>
                    </a>
                </div>
            </div>

            <!-- Blog Content -->
            <article class="blog-page-content">
                <div id="blog-content">
                    <!-- Content will be loaded here -->
                    <div style="text-align: center; padding: 4rem 0; color: var(--text-secondary);">
                        <p>Loading blog content...</p>
                    </div>
                </div>
            </article>

            <!-- Tags (if available) -->
            ${blogData.tags && blogData.tags.length > 0 ? `
            <div class="blog-page-tags">
                ${blogData.tags.map(tag => `<span class="blog-page-tag">${tag}</span>`).join('')}
            </div>
            ` : ''}

            <!-- Footer -->
            <footer class="blog-page-footer">
                <p>© 2024 John Doe. All rights reserved.</p>
                <p style="margin-top: 0.5rem;">
                    <a href="../index.html#contact" style="color: var(--primary-color); text-decoration: none;">Get in touch</a> |
                    <a href="../index.html#blogs" style="color: var(--primary-color); text-decoration: none;">More articles</a>
                </p>
            </footer>
        </div>
    </main>

    <!-- Scripts -->
    <script src="../script.js"></script>
    <script>
        // Blog-specific JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            // Load blog content from JSON
            fetch('../blogs/${filename}')
                .then(response => response.json())
                .then(blogData => {
                    const contentElement = document.getElementById('blog-content');
                    if (blogData.content) {
                        contentElement.innerHTML = blogData.content;
                    } else {
                        // Generate placeholder content if no content field exists
                        contentElement.innerHTML = generatePlaceholderContent(blogData);
                    }
                })
                .catch(error => {
                    console.error('Error loading blog content:', error);
                    document.getElementById('blog-content').innerHTML = '<p style="color: var(--text-secondary);">Sorry, there was an error loading this blog post.</p>';
                });

            // Initialize theme toggle for blog page
            const themeToggle = document.getElementById('theme-toggle');
            const themeIcon = themeToggle.querySelector('.theme-icon');
            const body = document.body;

            const savedTheme = localStorage.getItem('theme') || 'light';
            setTheme(savedTheme);

            themeToggle.addEventListener('click', () => {
                const currentTheme = body.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
            });

            function setTheme(theme) {
                body.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
                themeToggle.setAttribute('aria-label',
                    theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
                );
            }

            // Share functions
            window.shareOnTwitter = function() {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent('${blogData.title}');
                window.open(\`https://twitter.com/intent/tweet?url=\${url}&text=\${text}\`, '_blank');
            };

            window.shareOnFacebook = function() {
                const url = encodeURIComponent(window.location.href);
                window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${url}\`, '_blank');
            };

            window.shareOnLinkedIn = function() {
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent('${blogData.title}');
                window.open(\`https://www.linkedin.com/sharing/share-offsite/?url=\${url}\`, '_blank');
            };

            window.copyLink = function() {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('Link copied to clipboard!');
                }).catch(() => {
                    alert('Failed to copy link');
                });
            };
        });
    </script>
</body>
</html>`;
}

// ===== BLOG SEARCH FUNCTIONALITY =====
let blogCards = [];
let searchTimeout;
let blogGrid;
let searchInput;
let searchBtn;

function initBlogSearch() {
    searchInput = document.getElementById('blog-search');
    searchBtn = document.querySelector('.search-btn');
    blogGrid = document.getElementById('blogs-grid');

    // Load blogs on initialization
    loadBlogs();

    // Debounced search
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });

    searchBtn.addEventListener('click', performSearch);

    // Clear search on escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            performSearch();
        }
    });
}

async function discoverBlogFiles() {
    const files = [];

    // 1. Try to discover files via directory listing
    try {
        const response = await fetch('blogs/');
        if (response.ok) {
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const anchors = Array.from(doc.querySelectorAll('a'));

            anchors.forEach(anchor => {
                const href = anchor.getAttribute('href');
                // Skip parent directory, query strings, and the manifest file itself
                if (!href || href === '../' || href.startsWith('?') || href.includes('blogs.json')) return;

                if (href.toLowerCase().endsWith('.json')) {
                     // Normalize path: ensure it starts with blogs/ if it's relative
                     let path = href;
                     // If href is just "file.json", prepend blogs/
                     if (!path.includes('/') && !path.startsWith('http')) {
                         path = `blogs/${path}`;
                     }
                     // If it starts with /, remove it for consistency if needed, or keep as absolute
                     // For simple fetch, relative 'blogs/file.json' is usually safest if we are at root
                     if (path.startsWith('/')) {
                         path = path.substring(1);
                     }
                     
                     files.push(path);
                }
            });
        }
    } catch (error) {
        console.warn('Unable to auto-discover blog posts:', error);
    }

    // 2. Fallback to blogs.json if discovery returned nothing (or if we prefer it)
    if (files.length === 0) {
        try {
            const response = await fetch('blogs/blogs.json');
            if (response.ok) {
                const data = await response.json();
                // Handle simple array format
                if (Array.isArray(data)) {
                    return data.map(name => `blogs/${name}.json`);
                }
            }
        } catch (error) {
            console.warn('Fallback to blogs.json failed:', error);
        }
    }

    return [...new Set(files)];
}

// Load blog posts from discovered files
async function loadBlogs() {
    try {
        const blogFiles = await discoverBlogFiles();

        blogGrid.innerHTML = ''; // Clear existing blog cards

        for (const file of blogFiles) {
            try {
                const blogResponse = await fetch(file);
                if (!blogResponse.ok) continue;
                
                const blogData = await blogResponse.json();
                generateBlogPageTemplate(blogData, file);
                const blogCard = document.createElement('article');
                blogCard.className = 'blog-card';
                // Use placeholder image or add logic to load images if they exist in JSON
                blogCard.innerHTML = `
                    <div class="blog-image">
                        <img src="${blogData.image}" alt="${blogData.title}" class="blog-img" loading="lazy">
                    </div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <span class="blog-date">${blogData.date}</span>
                            <span class="blog-category">${blogData.category}</span>
                        </div>
                        <h3 class="blog-title">${blogData.title}</h3>
                        <p class="blog-excerpt">${blogData.excerpt}</p>
                        <a href="${file.replace('.json', '.html').replace('blogs/', 'blogpages/')}" class="blog-read-more">Read More →</a>
                    </div>
                `;

                blogGrid.appendChild(blogCard);
                blogCards.push(blogCard);
            } catch (e) {
                console.error(`Error loading blog file ${file}:`, e);
            }
        }

        performSearch(); // Initial search to display all blogs
    } catch (error) {
        console.error('Error loading blogs:', error);
    }
}

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    blogCards.forEach(card => {
        const title = card.querySelector('.blog-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
        const category = card.querySelector('.blog-category').textContent.toLowerCase();
        const content = title + ' ' + excerpt + ' ' + category;

        const isVisible = searchTerm === '' || content.includes(searchTerm);
        card.style.display = isVisible ? 'block' : 'none';

        if (isVisible) {
            visibleCount++;
            highlightSearchTerms(card, searchTerm);
        } else {
            removeHighlights(card);
        }
    });

    updateNoResultsMessage(visibleCount, searchTerm);
}

function highlightSearchTerms(card, searchTerm) {
    if (!searchTerm) return;

    const title = card.querySelector('.blog-title');
    const excerpt = card.querySelector('.blog-excerpt');

    highlightText(title, searchTerm);
    highlightText(excerpt, searchTerm);
}

function highlightText(element, searchTerm) {
    // Simple safe highlight
    const text = element.textContent;
    if (!searchTerm) {
            element.innerHTML = text;
            return;
    }
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = text.replace(regex, '<mark>$1</mark>');
}

function removeHighlights(card) {
    const title = card.querySelector('.blog-title');
    const excerpt = card.querySelector('.blog-excerpt');

    // Reset to text content to remove markup
    title.innerHTML = title.textContent;
    excerpt.innerHTML = excerpt.textContent;
}

function updateNoResultsMessage(count, searchTerm) {
    let messageElement = blogGrid.querySelector('.no-results');

    if (count === 0 && searchTerm) {
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'no-results';
            messageElement.style.cssText = `
                text-align: center;
                padding: 2rem;
                color: var(--text-secondary);
                font-style: italic;
            `;
            blogGrid.appendChild(messageElement);
        }
        messageElement.textContent = `No blog posts found for "${searchTerm}". Try different keywords.`;
    } else if (messageElement) {
        messageElement.remove();
    }
}

// ===== PUBLICATION FILTERS =====
function initPublicationFilters() {
    const filtersContainer = document.getElementById('publication-filters');
    const publicationsList = document.getElementById('publications-list');
    
    // Use delegation for filter buttons since they are dynamic
    filtersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            const button = e.target;
            const filter = button.getAttribute('data-filter');
            
            // Update active state
            filtersContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const items = publicationsList.querySelectorAll('.publication-item');
            items.forEach(item => {
                const year = item.getAttribute('data-year');
                
                if (filter === 'all' || year === filter) {
                    item.style.display = 'block';
                    // Simple animation reset
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    requestAnimationFrame(() => {
                         item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                         item.style.opacity = '1';
                         item.style.transform = 'translateY(0)';
                    });
                } else {
                    item.style.display = 'none';
                }
            });
        }
    });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== FORM HANDLING =====
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const subject = formData.get('subject');
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Create mailto link
        const mailtoLink = `mailto:john.doe@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        showFormMessage('Message sent! Your email client should open shortly.', 'success');

        // Reset form
        contactForm.reset();
    });

    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 6px;
            font-weight: 500;
            ${type === 'success' ?
                'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' :
                'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;

        contactForm.appendChild(messageElement);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
}

// ===== KEYBOARD NAVIGATION =====
function initKeyboardNavigation() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.className = 'skip-link sr-only';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Show skip link on tab
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            skipLink.classList.remove('sr-only');
        }
    });

    document.addEventListener('click', () => {
        skipLink.classList.add('sr-only');
    });
    
    // Note: Event listeners for dynamic content (like accordions) are handled in their specific init functions via delegation or direct attachment.
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    // We need to re-run this or use MutationObserver if we want to catch elements added dynamically.
    // For now, since we initialize this AFTER content load, it should work fine.
    const animateElements = document.querySelectorAll(
        '.section-header, .about-content, .timeline-item, .project-card, .publication-item, .blog-card'
    );

    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function preloadCriticalResources() {
    // Preload above-the-fold images if possible, though they might be dynamic now.
    // We can rely on the `loading="eager"` attribute on the profile image created in JS.
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
function detectHighContrast() {
    const testElement = document.createElement('div');
    testElement.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;background-color:#000;color:#fff;';
    document.body.appendChild(testElement);

    const computedStyle = window.getComputedStyle(testElement);
    const isHighContrast = computedStyle.backgroundColor === computedStyle.color;

    document.body.removeChild(testElement);

    if (isHighContrast) {
        document.body.classList.add('high-contrast');
    }
}

function respectReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        document.body.classList.add('reduced-motion');

        // Disable animations
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize accessibility features
detectHighContrast();
respectReducedMotion();
