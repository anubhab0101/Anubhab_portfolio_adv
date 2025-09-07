document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- Theme Switcher Logic ---
    const themeToggle = document.getElementById('theme-toggle');

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // --- Apply initial theme on page load ---
    // This logic now defaults to light mode unless the user has explicitly chosen dark mode on a previous visit.
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme('light'); // Force light mode for all new users
    } else {
        applyTheme('light'); // Default to light for all new users
    }

    // --- Show elements now that loader is removed ---
    document.querySelectorAll('.animate-on-load').forEach(el => {
        el.classList.add('is-visible');
    });


    // --- Custom Cursor (Optimized) ---
    const cursor = document.querySelector('.cursor');
    const cursorText = document.querySelector('.cursor-text');
    if (cursor && !window.matchMedia('(max-width: 768px)').matches) {
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        const speed = 0.1;
        let rafId = null;

        const animateCursor = () => {
            const distX = mouseX - cursorX;
            const distY = mouseY - cursorY;
            cursorX += distX * speed;
            cursorY += distY * speed;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            rafId = requestAnimationFrame(animateCursor);
        };

        // Throttled mousemove handler
        let mouseMoveTimeout;
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!rafId) {
                animateCursor();
            }
        }, { passive: true });
        
        // Optimized cursor text handling
        const cursorElements = document.querySelectorAll('[data-cursor-text]');
        cursorElements.forEach(el => {
            el.addEventListener('mouseover', () => {
                cursor.classList.add('active');
                if(cursorText) cursorText.textContent = el.getAttribute('data-cursor-text');
            }, { passive: true });
            el.addEventListener('mouseout', () => {
                cursor.classList.remove('active');
                if(cursorText) cursorText.textContent = '';
            }, { passive: true });
        });
    }

    // --- Navigation & Scrolling ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    function smoothScrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            smoothScrollTo(targetId);
            history.pushState(null, null, targetId);
        });
    });

    window.addEventListener('popstate', (e) => {
        if (e.state === null && window.location.hash) {
            smoothScrollTo(window.location.hash);
        }
    });

    if (window.location.hash) {
        setTimeout(() => {
            smoothScrollTo(window.location.hash);
        }, 500); // Reduced delay after removing loader
    }

    function updateActiveNavLink() {
        let currentSectionId = '';
        const sections = document.querySelectorAll('.full-page-section, #Projects');
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition + window.innerHeight / 2) {
                currentSectionId = section.id;
            }
        });

        document.querySelectorAll('.navbar-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNavLink);

    // --- Scroll Animations (Optimized) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
    });

    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        });
    } else {
        setTimeout(() => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        }, 100);
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.addEventListener('click', () => navLinks.classList.remove('active'));
    }

    // --- HORIZONTAL SCROLL LOGIC ---
    const horizontalContainer = document.querySelector('.horizontal-scroll-container');
    const scrollContent = document.querySelector('.scroll-content');
    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    function handleHorizontalScroll() {
        if (!horizontalContainer || !scrollContent || isMobile()) {
            if (scrollContent) scrollContent.style.transform = 'translateX(0px)';
            return;
        }

        const containerRect = horizontalContainer.getBoundingClientRect();
        const scrollTop = -containerRect.top;
        const scrollableHeight = horizontalContainer.scrollHeight - window.innerHeight;
        
        if (scrollTop < 0 || scrollTop > scrollableHeight) return;

        const progress = scrollTop / scrollableHeight;
        const maxTranslate = scrollContent.scrollWidth - window.innerWidth;
        const translateValue = -maxTranslate * progress;

        scrollContent.style.transform = `translateX(${translateValue}px)`;
    }

    // Throttled scroll and resize handlers
    let scrollTimeout;
    let resizeTimeout;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            handleHorizontalScroll();
            updateActiveNavLink();
            scrollTimeout = null;
        }, 16); // ~60fps
    }, { passive: true });
    
    window.addEventListener('resize', () => {
        if (resizeTimeout) return;
        resizeTimeout = setTimeout(() => {
            handleHorizontalScroll();
            resizeTimeout = null;
        }, 100);
    }, { passive: true });
});
