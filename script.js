document.addEventListener('DOMContentLoaded', () => {
    // --- Loader & Initial Animations ---
    const mainContent = document.getElementById('main-content');
    const loader = document.getElementById('loader');

    if (loader) {
        const loaderSlider = document.getElementById('loader-slider');
        const loaderPercentage = document.getElementById('loader-percentage');
        const waveFill = document.getElementById('loader-wave-fill');
        const loaderTransition = document.getElementById('loader-transition');
        let count = 0;

        const interval = setInterval(() => {
            if (count >= 100) {
                clearInterval(interval);
                startTransition();
            } else {
                count++;
                if (loaderPercentage) {
                    loaderPercentage.textContent = count + '%';
                }
                if (loaderSlider) {
                    loaderSlider.style.width = count + '%';
                }
                if (waveFill) {
                    waveFill.style.width = `${count}%`;
                }
            }
        }, 30);

        function startTransition() {
            if (!loaderTransition || !loader || !mainContent) return;
            loaderTransition.style.opacity = '1';
            setTimeout(() => {
                loaderTransition.style.backgroundColor = '#000';
                setTimeout(() => {
                    loader.classList.add('fade-out');
                    loaderTransition.classList.add('fade-out');
                    setTimeout(() => {
                        loader.style.display = 'none';
                        loaderTransition.style.display = 'none';
                        mainContent.classList.add('fade-in');
                        document.querySelectorAll('.animate-on-load').forEach(el => {
                            el.classList.add('is-visible');
                        });
                    }, 500);
                }, 800);
            }, 300);
        }
    }

    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const cursorText = document.querySelector('.cursor-text');
    if (cursor) {
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        const speed = 0.1;

        const animateCursor = () => {
            const distX = mouseX - cursorX;
            const distY = mouseY - cursorY;
            cursorX += distX * speed;
            cursorY += distY * speed;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // --- NEW CURSOR HOVER LOGIC ---
        document.querySelectorAll('[data-cursor-text]').forEach(el => {
            el.addEventListener('mouseover', () => {
                cursor.classList.add('active');
                if(cursorText) cursorText.textContent = el.getAttribute('data-cursor-text');
            });
            el.addEventListener('mouseout', () => {
                cursor.classList.remove('active');
                if(cursorText) cursorText.textContent = '';
            });
        });
    }

    // --- Navigation & Smooth Scrolling ---
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
        }, 2000);
    }

    // --- Scroll Spy to highlight nav links ---
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

    // --- Scroll-triggered Animations ---
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
    }, { threshold: 0.2 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

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

    window.addEventListener('scroll', handleHorizontalScroll);
    window.addEventListener('resize', handleHorizontalScroll);
});