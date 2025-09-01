document.addEventListener('DOMContentLoaded', () => {
    // --- Loader & Initial Animations ---
    const mainContent = document.getElementById('main-content');
    const loader = document.getElementById('loader');
    if (loader) {
        const loaderTransition = document.getElementById('loader-transition');
        let count = 0;
        const interval = setInterval(() => {
            if (count >= 100) {
                clearInterval(interval);
                startTransition();
            } else {
                count++;
                const loaderPercentage = document.getElementById('loader-percentage');
                if (loaderPercentage) loaderPercentage.textContent = count + '%';
            }
        }, 20);

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
                        // Trigger animations for elements visible on load
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
    }

    // --- Responsive Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.addEventListener('click', () => navLinks.classList.remove('active'));
    }

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

    // --- Project Card Hover Effect ---
    document.querySelectorAll('.project-card').forEach(card => {
        const prompt = card.querySelector('.view-prompt');
        if (prompt) {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                prompt.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
        }
    });

    // --- Horizontal Scrolling ---
    const horizontalContainer = document.getElementById('horizontal-scroll-container');
    const horizontalTrack = document.getElementById('horizontal-scroll-track');
    if (horizontalContainer && horizontalTrack) {
        window.addEventListener('scroll', () => {
            const containerRect = horizontalContainer.getBoundingClientRect();
            const trackWidth = horizontalTrack.scrollWidth;
            const maxTranslate = trackWidth - window.innerWidth;

            if (containerRect.top < 0 && containerRect.bottom > window.innerHeight) {
                const scrollProgress = -containerRect.top / (containerRect.height - window.innerHeight);
                let translateValue = -maxTranslate * scrollProgress;
                translateValue = Math.max(-maxTranslate, Math.min(0, translateValue));
                horizontalTrack.style.transform = `translateX(${translateValue}px)`;
            }
        });
    }
});

