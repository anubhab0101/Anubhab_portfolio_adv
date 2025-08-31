// Get the elements for the new animation
const loaderSlider = document.getElementById('loader-slider');
const waveFill = document.getElementById('wave-fill');

// Get the existing elements
const loaderPercentage = document.getElementById('loader-percentage');
const loader = document.getElementById('loader');
const loaderTransition = document.getElementById('loader-transition');
const contentWrapper = document.querySelector('.content-wrapper');

let count = 0;
// Improved speed: interval is now 20ms for a ~2 second load time.
const interval = setInterval(() => {
    if (count >= 100) {
        clearInterval(interval);
        startTransition();
    } else {
        count++;
        // Update the percentage text
        loaderPercentage.textContent = count + '%';
        // Update the width of the sliding black panel
        loaderSlider.style.width = count + '%';
        // Update the width of the wave fill effect
        waveFill.style.width = count + '%';
    }
}, 20);

// This function for the final transition remains the same
function startTransition() {
    // 1. White flash fades in (it's already white, so this step is seamless)
    loaderTransition.style.opacity = '1';

    setTimeout(() => {
        // 2. White flash turns to black
        loaderTransition.style.backgroundColor = '#000';

        setTimeout(() => {
            // 3. Loader and transition screen fade out
            loader.classList.add('fade-out');
            loaderTransition.classList.add('fade-out');

            setTimeout(() => {
                // 4. Hide loader elements
                loader.style.display = 'none';
                loaderTransition.style.display = 'none';

                // 5. Fade in main content
                contentWrapper.classList.add('fade-in');
            }, 500); 
        }, 800); 
    }, 300);
}