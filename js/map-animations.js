// js/map-animations.js

let animationRunning = false;       // global state
let currentTimeouts = [];           // store timeouts to cancel if needed

function toggleAnimation(button) {
    const hexItem = button.querySelector('.hex-item');
    if (!hexItem) return;

    if (animationRunning) {
        // STOP the animation
        hexItem.classList.remove('active');
        currentTimeouts.forEach(t => clearTimeout(t));
        currentTimeouts = [];
        animationRunning = false;

        // Remove progress bar from DOM
        const progressContainer = document.getElementById('glacier-progress-container');
        if (progressContainer) progressContainer.remove();

        return;
    }

    // START the animation
    hexItem.classList.add('active');
    animationRunning = true;

    // Ensure globe mode
    map.setProjection('globe');

    fetch('json/geographic_locations.json')
        .then(res => res.json())
        .then(data => {

            const zoomInDuration = 8000;   // zoom-in flight time in ms
            const hoverDuration = 2000;    // pause at full zoom before zooming out
            const zoomOutDuration = 7000;  // zoom-out duration in ms

            let index = 0;
            const shuffled = data.glaciers.sort(() => Math.random() - 0.5);

            // ----- CREATE PROGRESS BAR -----
            let progressContainer = document.getElementById('glacier-progress-container');
            if (!progressContainer) {
                progressContainer = document.createElement('div');
                progressContainer.id = 'glacier-progress-container';
                progressContainer.style.cssText = `
                    position: absolute;
                    bottom: 16vh;
                    left: 1vw;
                    width: 400px;
                    height: 30px;
                    border: 1px solid #000;
                    background: rgba(255,0,255,0.2);
                    display: flex;
                    align-items: center;
                    z-index: 1000;
                    padding: 2px;
                    border-radius: 4px;
                `;

                const bar = document.createElement('div');
                bar.id = 'glacier-progress-bar';
                bar.style.cssText = `
                    height: 100%;
                    width: 0%;
                    background-color: #00f;
                    transition: width 0.3s linear;
                    border-radius: 2px;
                `;
                progressContainer.appendChild(bar);

                const counter = document.createElement('span');
                counter.id = 'glacier-counter';
                counter.style.cssText = `
                    position: absolute;      /* fix over the bar */
                    left: 5px;               /* small margin from left */
                    top: 0;                  /* align with container top */
                    height: 100%;            /* full height */
                    display: flex;
                    align-items: center;     /* vertically center text */
                    font-size: clamp(12px, 0.9vw, 18px);
                    font-family: "Courier New", Courier, monospace;
                    color: magenta;
                    pointer-events: none;    /* text won't interfere with clicks */
                `;
                progressContainer.appendChild(counter);

                document.getElementById('map').appendChild(progressContainer);
            }

            function updateProgress(glacier) {
                const total = shuffled.length;
                const bar = document.getElementById('glacier-progress-bar');
                const counter = document.getElementById('glacier-counter');
                const percent = ((index + 1) / total) * 100;
                if (bar) bar.style.width = percent + "%";
                if (counter) counter.textContent = `${index + 1} / ${total} - ${glacier.name}`;
            }

            function flyToGlacier() {
                if (!animationRunning) return; // stop if toggled off

                const glacier = shuffled[index];

                // Fly to glacier (zoom in)
                map.flyTo({
                    center: glacier.coords,
                    zoom: 7,
                    pitch: 30,
                    bearing: 0,
                    duration: zoomInDuration
                });

                updateProgress(glacier);

                // After zoom-in + hover, zoom out
                let zoomOutTimeout = setTimeout(() => {
                    map.easeTo({
                        zoom: 4,
                        pitch: 0,
                        duration: zoomOutDuration
                    });

                    // Move to next glacier
                    let nextTimeout = setTimeout(() => {
                        index = (index + 1) % shuffled.length;
                        flyToGlacier();
                    }, zoomOutDuration);

                    currentTimeouts.push(nextTimeout);
                }, zoomInDuration + hoverDuration);

                currentTimeouts.push(zoomOutTimeout);
            }

            // Start the loop
            flyToGlacier();
        });
}