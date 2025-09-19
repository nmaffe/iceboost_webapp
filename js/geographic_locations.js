map.on('load', () => {
    fetch('json/geographic_locations.json')
        .then(res => res.json())
        .then(data => {

            // 1. Add main source for points
            map.addSource('geo-locations', {
                type: 'geojson',
                data: data
            });

            // 2. Add point layer
            map.addLayer({
                id: 'glacier-points',
                type: 'circle',
                source: 'geo-locations',
                paint: {
                    'circle-radius': 8,
                    'circle-color': ['coalesce', ['get', 'point_color'], '#ffffff'],
                    'circle-emissive-strength': 1
                },
                filter: [">=", ["zoom"], ["get", "zoom"]]
            });

            // 3. Build two-segment lines for all features
            const twoSegmentLines = {
                type: "FeatureCollection",
                features: data.features.map(f => {
                    const start = f.geometry.coordinates;
                    const end = f.properties.label_coords;
                    const mid = [(start[0] + end[0]) / 2, end[1]]; // midpoint
                    return {
                        type: "Feature",
                        geometry: { type: "LineString", coordinates: [start, mid, end] },
                        properties: {
                            line_color: f.properties.line_color || "#ffffff",
                            zoom: f.properties.zoom || 0
                        }
                    };
                })
            };

            map.addSource('glacier-lines', { type: 'geojson', data: twoSegmentLines });

            map.addLayer({
                id: 'glacier-lines-layer',
                type: 'line',
                source: 'glacier-lines',
                layout: { 'line-cap': 'round', 'line-join': 'round' },
                paint: {
                    'line-color': ['get', 'line_color'],
                    'line-width': 1,
                    'line-emissive-strength': 1
                },
                filter: [">=", ["zoom"], ["get", "zoom"]],
            });

            // 4. Build label features
            const labels = {
                type: "FeatureCollection",
                features: data.features.map(f => ({
                    type: "Feature",
                    geometry: { type: "Point", coordinates: f.properties.label_coords },
                    properties: {
                        name: f.properties.name,
                        text_color: f.properties.text_color || '#ffffff',
                        zoom: f.properties.zoom || 0
                    }
                }))
            };

            map.addSource('glacier-labels', { type: 'geojson', data: labels });

            map.addLayer({
                id: 'glacier-label-layer',
                type: 'symbol',
                source: 'glacier-labels',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': ['Arial Unicode MS Regular'],
                    'text-size': 20,
                    'text-anchor': 'bottom-right'
                },
                paint: {
                    'text-color': ['get', 'text_color'],
                    'text-halo-color': '#000000',
                    'text-halo-width': 1
                },
                filter: [">=", ["zoom"], ["get", "zoom"]]
            });

        });
});