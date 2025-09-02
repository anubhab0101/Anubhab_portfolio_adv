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
        }, 30); // Interval speed in milliseconds

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

    // --- Navigation & Smooth Scrolling ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Get all sections for navigation
    const sections = document.querySelectorAll('.full-page-section, #horizontal-scroll-container');

    const horizontalContainer = document.getElementById('horizontal-scroll-container');
    const horizontalTrack = document.getElementById('horizontal-scroll-track');

    // Dynamically size the horizontal scroll container so all slides complete before next section
    function sizeHorizontalContainer() {
        if (!horizontalContainer || !horizontalTrack) return;
        const slides = horizontalTrack.querySelectorAll('.horizontal-section').length;
        // Make the container height equal to windowHeight + (trackWidth - viewportWidth)
        // For slides that are each viewport width: trackWidth = slides * viewportWidth
        const containerHeight = window.innerHeight + (slides - 1) * window.innerWidth;
        horizontalContainer.style.height = `${containerHeight}px`;
    }
    sizeHorizontalContainer();
    window.addEventListener('resize', sizeHorizontalContainer);
    
    // Smooth scrolling function that uses dynamic container height
    function smoothScrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        let targetScrollPosition = 0;
        const vh = window.innerHeight;
        const hcHeight = horizontalContainer ? horizontalContainer.scrollHeight : 0;
        
        if (targetId === '#home') {
            targetScrollPosition = 0;
        } else if (targetId === '#about_me_sec') {
            targetScrollPosition = 1 * vh;
        } else if (targetId === '#Social_me_sec') {
            targetScrollPosition = 2 * vh;
        } else if (targetId === '#about_me') {
            targetScrollPosition = 3 * vh;
        } else if (targetId === '#Projects' || targetId === '#contact-me') {
            // Top of horizontal container
            targetScrollPosition = 4 * vh;
        } else if (targetId === '#Testimonials') {
            // After the horizontal container completes
            targetScrollPosition = 4 * vh + hcHeight;
        }
        
        window.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
        });
    }

    // Handle navigation link clicks
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

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state === null && window.location.hash) {
            smoothScrollTo(window.location.hash);
        }
    });

    // Handle direct hash links (when page loads with hash in URL)
    if (window.location.hash) {
        setTimeout(() => {
            smoothScrollTo(window.location.hash);
        }, 2000); // Wait for page to fully load
    }

    // Add scroll spy to highlight current section in navigation
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const hcHeight = horizontalContainer ? horizontalContainer.scrollHeight : 0;
        
        let currentSection = 'home';
        
        if (scrollPosition < windowHeight * 0.5) {
            currentSection = 'home';
        } else if (scrollPosition < windowHeight * 1.5) {
            currentSection = 'about_me_sec';
        } else if (scrollPosition < windowHeight * 2.5) {
            currentSection = 'Social_me_sec';
        } else if (scrollPosition < windowHeight * 3.5) {
            currentSection = 'about_me';
        } else if (scrollPosition < 4 * windowHeight + hcHeight - 1) {
            // While within the horizontal container area
            currentSection = 'Projects';
        } else {
            currentSection = 'Testimonials';
        }
        
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const currentLink = document.querySelector(`[href="#${currentSection}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    window.addEventListener('scroll', updateActiveNavLink);
    setTimeout(updateActiveNavLink, 1000);

    // Responsive navigation
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
    if (horizontalContainer && horizontalTrack) {
        //calculate the scrollable distance of the track
        const updateHorizontalScroll = () => {
            const maxTranslate = horizontalTrack.scrollWidth - window.innerWidth;

            window.addEventListener('scroll', () => {
                const containerRect = horizontalContainer.getBoundingClientRect();
                
                if (containerRect.top <= 0 && containerRect.bottom >= window.innerHeight) {
                    // Calculate scroll progress within the container
                    const scrollProgress = -containerRect.top / (horizontalContainer.scrollHeight - window.innerHeight);
                    
                    // Calculate the translation value
                    let translateValue = -maxTranslate * scrollProgress;

                    // Clamp the value to prevent overscrolling
                    translateValue = Math.max(-maxTranslate, Math.min(0, translateValue));

                    horizontalTrack.style.transform = `translateX(${translateValue}px)`;
                }
            });
        };

        updateHorizontalScroll();
        window.addEventListener('resize', updateHorizontalScroll);
    }
});

