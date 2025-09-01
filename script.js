document.addEventListener('DOMContentLoaded', () => {
    // --- Loader Animation Script ---
    const loader = document.getElementById('loader');
    if (loader) {
        const loaderSlider = document.getElementById('loader-slider');
        const waveFill = document.getElementById('wave-fill');
        const loaderPercentage = document.getElementById('loader-percentage');
        const loaderTransition = document.getElementById('loader-transition');
        const mainContent = document.getElementById('main-content');

        let count = 0;
        const interval = setInterval(() => {
            if (count >= 100) {
                clearInterval(interval);
                startTransition();
            } else {
                count++;
                if (loaderPercentage) loaderPercentage.textContent = count + '%';
                if (loaderSlider) loaderSlider.style.width = count + '%';
                if (waveFill) waveFill.style.width = count + '%';
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
                    }, 500);
                }, 800);
            }, 300);
        }
    }

    // --- Responsive Navigation Script ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.navbar-link');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    if (navLinksItems && navLinks) {
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // --- Scroll-triggered Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.4 }); // Trigger when 40% of the element is visible

    // Observe social icons for staggered animation
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => observer.observe(icon));
    

    // --- Social Icons Mouse Parallax Effect ---
    const socialSection = document.getElementById('Social_me_sec');
    if (socialSection) {
        socialSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const moveX = (clientX - centerX) * 0.01;
            const moveY = (clientY - centerY) * 0.01;

            socialIcons.forEach(icon => {
                const depth = icon.getAttribute('data-depth');
                const iconMoveX = moveX * depth;
                const iconMoveY = moveY * depth;
                icon.style.transform = `translate(${iconMoveX}px, ${iconMoveY}px)`;
            });
        });
    }

    // --- Horizontal Scrolling ---
    const horizontalContainer = document.getElementById('horizontal-scroll-container');
    const horizontalTrack = document.getElementById('horizontal-scroll-track');
    
    if (horizontalContainer && horizontalTrack) {
        window.addEventListener('scroll', () => {
            const containerTop = horizontalContainer.offsetTop;
            const containerHeight = horizontalContainer.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            if (scrollY > containerTop && scrollY < containerTop + containerHeight - windowHeight) {
                const scrollProgress = (scrollY - containerTop) / (containerHeight - windowHeight);
                const trackWidth = horizontalTrack.scrollWidth;
                const maxTranslate = trackWidth - window.innerWidth;
                
                let translateValue = -maxTranslate * scrollProgress;
                // Clamp the value to prevent overscrolling
                translateValue = Math.max(-maxTranslate, Math.min(0, translateValue));

                horizontalTrack.style.transform = `translateX(${translateValue}px)`;
            }
        });
    }
});

