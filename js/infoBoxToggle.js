// js/infoBoxToggle.js

function setupInfoToggle(buttonId, boxId) {
    const button = document.getElementById(buttonId);
    const box = document.getElementById(boxId);

    // Button click → toggle box
    button.addEventListener('click', function (event) {
        box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'block' : 'none';
        event.stopPropagation();
    });

    // Click outside → close box
    document.addEventListener('mousedown', function (event) {
        if (!box.contains(event.target) && event.target !== button) {
            box.style.display = 'none';
        }
    });
}

// Set up both buttons/boxes
setupInfoToggle('info-btn-1', 'info-box-1');
setupInfoToggle('info-btn-2', 'info-box-2');