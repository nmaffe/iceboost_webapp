// infoBoxToggle.js

// Event listener for the info button
document.getElementById('info-btn').addEventListener('click', function(event) {
    const box = document.getElementById('info-box');
    // Toggle visibility of the info box
    box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'block' : 'none';
    // Prevent the click event from propagating to the document
    event.stopPropagation();
});

// Close the info box if clicked outside (using mousedown event)
document.addEventListener('mousedown', function(event) {
    const box = document.getElementById('info-box');
    const button = document.getElementById('info-btn');

    // Check if the click is outside the box and button
    if (!box.contains(event.target) && event.target !== button) {
        box.style.display = 'none'; // Hide the info box
    }
});