// js/map-animations.js

function toggleAnimation(button) {
    const hexItem = button.querySelector('.hex-item');
    hexItem.classList.add('active');  // highlight button

    // Ensure globe mode
    map.setProjection('globe');

    // Step 1: Fly to Finske ice cap
    map.flyTo({
        center: [-15.4, 81.2],
        zoom: 5,
        pitch: 30,
        bearing: 0,
        duration: 5000
    });

    // Step 2: Rotate & zoom out
    setTimeout(() => {
        map.easeTo({
            zoom: 4,
            pitch: 0,
            duration: 4000
        });
    }, 5500);

    // Step 3: Fly to Alps
    setTimeout(() => {
        map.flyTo({
            center: [8, 46.5],
            zoom: 5,
            pitch: 30,
            duration: 6000
        });
    }, 10500);

    // Step 4: Reset button highlight
    setTimeout(() => {
        hexItem.classList.remove('active');
    }, 17000);
}