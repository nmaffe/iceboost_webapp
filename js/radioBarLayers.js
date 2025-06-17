// radioBarLayers.js

  const inputs = document.querySelectorAll('input[name="model"]');
  let activeInput = document.querySelector('input[name="model"]:checked');

  inputs.forEach(input => {
    input.addEventListener('click', function () {
      const clickedLayer = this.dataset.layer;

      // If clicked again, hide it and deselect
      if (activeInput === this) {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        this.checked = false;
        activeInput = null;
        return;
      }

      // Hide all layers
      inputs.forEach(other => {
        const otherLayer = other.dataset.layer;
        if (map.getLayer(otherLayer)) {
          map.setLayoutProperty(otherLayer, 'visibility', 'none');
        }
      });

      // Show selected layer
      if (map.getLayer(clickedLayer)) {
        map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      }

      activeInput = this;
    });
  });