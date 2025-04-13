map.on('load', function () {
    // Add hover popup behavior once
    map.on('mousemove', 'ground_truth_points', function (e) {
        map.getCanvas().style.cursor = 'pointer';

        const thickness = e.features[0].properties.thickness;
        const formattedThickness = parseFloat(thickness).toFixed(1);

        // Remove any existing popup
        if (map._thicknessPopup) {
            map._thicknessPopup.remove();
        }

        // Create a new popup
        map._thicknessPopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        })
        .setLngLat(e.lngLat)
        .setHTML(`<strong>Ice:</strong> ${formattedThickness} m`)
        .addTo(map);
    });

    map.on('mouseleave', 'ground_truth_points', function () {
        map.getCanvas().style.cursor = '';
        if (map._thicknessPopup) {
            map._thicknessPopup.remove();
            map._thicknessPopup = null;
        }
    });
});