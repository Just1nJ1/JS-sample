/**
 * Portfolio Website JavaScript
 * Vanilla JS implementation with modern ES6+ features
 * Includes navigation, animations, interactivity, and accessibility features
 */

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all modules
    initNavigation();
    initThemeToggle();
    initTimelineAccordions();
    initProjectLightbox();
    initBlogSearch();
    initPublicationFilters();
    initBackToTop();
    initFormHandling();
    initLazyLoading();
    initKeyboardNavigation();
    initScrollAnimations();

    // Performance: Preload critical resources
    preloadCriticalResources();
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
    const timelineHeaders = document.querySelectorAll('.timeline-header');

    timelineHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const timelineItem = header.closest('.timeline-item');
            const isExpanded = timelineItem.getAttribute('data-expanded') === 'true';

            // Close all other accordions in the same timeline
            const timeline = timelineItem.closest('.timeline');
            const allItems = timeline.querySelectorAll('.timeline-item');

            allItems.forEach(item => {
                item.setAttribute('data-expanded', 'false');
            });

            // Toggle current accordion
            timelineItem.setAttribute('data-expanded', !isExpanded);
        });

        // Keyboard support
        header.addEventListener('keydown', (e) => {
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
    const projectImages = document.querySelectorAll('.project-img');

    let currentImageIndex = 0;
    let imageArray = [];

    // Initialize image array for navigation
    projectImages.forEach((img, index) => {
        imageArray.push({
            src: img.src,
            alt: img.alt,
            index: index
        });

        img.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    function openLightbox(index) {
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

// ===== BLOG SEARCH FUNCTIONALITY =====
function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const searchBtn = document.querySelector('.search-btn');
    const blogGrid = document.getElementById('blogs-grid');
    const blogCards = blogGrid.querySelectorAll('.blog-card');

    let searchTimeout;

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

                // Highlight search terms
                highlightSearchTerms(card, searchTerm);
            } else {
                removeHighlights(card);
            }
        });

        // Show message if no results
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
        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        element.innerHTML = text.replace(regex, '<mark>$1</mark>');
    }

    function removeHighlights(card) {
        const title = card.querySelector('.blog-title');
        const excerpt = card.querySelector('.blog-excerpt');

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

// ===== PUBLICATION FILTERS =====
function initPublicationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationItems = document.querySelectorAll('.publication-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            publicationItems.forEach(item => {
                const year = item.getAttribute('data-year');

                if (filter === 'all' || year === filter) {
                    item.style.display = 'block';
                    // Animate in
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
        });
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
    // Skip to main content link (added via JavaScript for better UX)
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

    // Focus management for accordions
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const focusedElement = document.activeElement;

            // Handle custom focusable elements
            if (focusedElement.classList.contains('timeline-header')) {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });
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
    const animateElements = document.querySelectorAll(
        '.section-header, .about-content, .timeline-item, .project-card, .publication-item, .blog-card'
    );

    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function preloadCriticalResources() {
    // Preload above-the-fold images
    const criticalImages = [
        'assets/profile.jpg',
        'assets/hero-bg.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Could send to error tracking service in production
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to error tracking service in production
});

// ===== ACCESSIBILITY IMPROVEMENTS =====

// High contrast mode detection
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

// Reduced motion preference
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

// ===== BROWSER COMPATIBILITY =====

// Polyfill for older browsers
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
                                Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        let el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// ===== CUSTOMIZATION HELPERS =====
/*
To customize this portfolio:

1. Update personal information:
   - Modify the HTML content in index.html
   - Change contact details, social links, and bio

2. Add new projects/publications/blogs:
   - Copy existing HTML structure
   - Update content and links
   - Ensure proper data attributes for filtering

3. Customize colors:
   - Update CSS variables in styles.css :root section
   - Modify color scheme while maintaining accessibility

4. Add new sections:
   - Create HTML structure with proper semantic markup
   - Add corresponding CSS styles
   - Initialize JavaScript functionality if needed

5. Performance monitoring:
   - Check console for any errors
   - Use browser dev tools for performance analysis
   - Consider code splitting for larger applications

6. Hosting instructions:
   - For local development: python -m http.server 8000
   - For production: Use any static web server
   - Enable gzip compression
   - Set proper cache headers

7. Analytics (optional):
   - Add Google Analytics or similar tracking code
   - Monitor user interactions and performance

Remember to test across different browsers and devices!
*/
