document.addEventListener('DOMContentLoaded', () => {
    // --- Loader Animation Script ---
    const loaderSlider = document.getElementById('loader-slider');
    const waveFill = document.getElementById('wave-fill');
    const loaderPercentage = document.getElementById('loader-percentage');
    const loader = document.getElementById('loader');
    const loaderTransition = document.getElementById('loader-transition');
    const contentWrapper = document.querySelector('.content-wrapper');

    let count = 0;
    const interval = setInterval(() => {
        if (count >= 100) {
            clearInterval(interval);
            startTransition();
        } else {
            count++;
            loaderPercentage.textContent = count + '%';
            loaderSlider.style.width = count + '%';
            waveFill.style.width = count + '%';
        }
    }, 20);

    function startTransition() {
        loaderTransition.style.opacity = '1';
        setTimeout(() => {
            loaderTransition.style.backgroundColor = '#000';
            setTimeout(() => {
                loader.classList.add('fade-out');
                loaderTransition.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                    loaderTransition.style.display = 'none';
                    contentWrapper.classList.add('fade-in');
                }, 500);
            }, 800);
        }, 300);
    }

    // --- Responsive Navigation Script ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.navbar-link');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });
});
