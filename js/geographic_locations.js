map.on('load', () => {
  fetch('json/geographic_locations.json')
    .then(res => res.json())
    .then(data => {

      // --- convert compact JSON -> GeoJSON FeatureCollection
      const geojson = {
        type: "FeatureCollection",
        features: data.glaciers.map(g => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: g.coords },
          properties: {
            name: g.name,
            label_coords: g.label,
            zoom: g.zoom,
            point_color: g.point_color,
            line_color: g.line_color,
            text_color: g.text_color
          }
        }))
      };

      // --- 1) add (or set) the main points source using the full GeoJSON
      if (map.getSource('geo-locations')) {
        map.getSource('geo-locations').setData(geojson);
      } else {
        map.addSource('geo-locations', { type: 'geojson', data: geojson });
      }

      // --- 2) build two-segment lines from the GeoJSON features
      const twoSegmentLines = {
        type: "FeatureCollection",
        features: geojson.features.map(f => {
          const start = f.geometry.coordinates;
          const end = f.properties.label_coords;
          const mid = [(start[0] + end[0]) / 2, end[1]];
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

      if (map.getSource('glacier-lines')) {
        map.getSource('glacier-lines').setData(twoSegmentLines);
      } else {
        map.addSource('glacier-lines', { type: 'geojson', data: twoSegmentLines });
      }

      // --- 3) build label features at label_coords
      const labelFeatures = {
        type: "FeatureCollection",
        features: geojson.features.map(f => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: f.properties.label_coords },
          properties: {
            name: f.properties.name,
            text_color: f.properties.text_color || '#ffffff',
            zoom: f.properties.zoom || 0
          }
        }))
      };

      if (map.getSource('glacier-labels')) {
        map.getSource('glacier-labels').setData(labelFeatures);
      } else {
        map.addSource('glacier-labels', { type: 'geojson', data: labelFeatures });
      }

      // --- 4) add layers (lines first, then points, then labels)
      if (!map.getLayer('glacier-lines-layer')) {
        map.addLayer({
          id: 'glacier-lines-layer',
          type: 'line',
          source: 'glacier-lines',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': ['coalesce', ['get', 'line_color'], '#ffffff'],
            'line-width': 1,
            'line-emissive-strength': 1
          },
          filter: [">=", ["zoom"], ["get", "zoom"]]
        });
      }

      if (!map.getLayer('glacier-points')) {
        map.addLayer({
          id: 'glacier-points',
          type: 'circle',
          source: 'geo-locations',
          paint: {
            'circle-radius': 8,
            'circle-color': ['coalesce', ['get', 'point_color'], '#ffffff'],
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 2,
            'circle-emissive-strength': 1
          },
          filter: [">=", ["zoom"], ["get", "zoom"]]
        });
      }

      if (!map.getLayer('glacier-label-layer')) {
        map.addLayer({
          id: 'glacier-label-layer',
          type: 'symbol',
          source: 'glacier-labels',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Arial Unicode MS Regular'],
            'text-size': 16,
            'text-anchor': 'bottom-right'
          },
          paint: {
            'text-color': ['coalesce', ['get', 'text_color'], '#ffffff'],
            'text-halo-color': '#000000',
            'text-halo-width': 1
          },
          filter: [">=", ["zoom"], ["get", "zoom"]]
        });
      }

    })
    .catch(err => {
      console.error('Failed loading or parsing geographic_locations.json:', err);
    });
});