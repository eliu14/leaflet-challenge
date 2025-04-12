// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map


// Create the map object with center and zoom options.
let map = L.map("map", {
  center: [37.95, -119.57],
  zoom: 6
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);
// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      "color": '#000000',
      "fillColor": getColor(feature.geometry.coordinates[2]),
      "fillOpacity": 0.8,
      "radius": getRadius(feature.properties.mag),
      "weight": 1
    }
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    let color = '#000000';
    if (depth >= -10 && depth <= 10)
      color = '#00ff00';
    else if (depth <= 30)
      color = '#ccff66';
    else if (depth <= 50)
      color = '#ffff99';
    else if (depth <= 70)
      color = '#ff9933';
    else if (depth <= 90)
      color = '#ff6600';
    else if (depth > 90)
      color = '#cc3300';
    return color;
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude * 5;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      var date = new Date(feature.properties.time).toUTCString();
      layer.bindPopup("<strong><a href=" + feature.properties.url+">" + feature.properties.title + 
        "</a></strong><br /> Date: " + date +
         "<br />Depth: " + feature.geometry.coordinates[2]);
    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    let depths = [['-10', '10'],
                  ['10', '30'],
                  ['30', '50'],
                  ['50', '70'],
                  ['70', '90'],
                  ['90']
                ]
    let colors = ['#00ff00', '#ccff66', '#ffff99', '#ff9933', '#ff6600', '#cc3300']
    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i =0; i < depths.length - 1; i++){
      div.innerHTML += 
        '<i class="color-square" style="background:' + colors[i] + '"></i> ' + depths[i][0] + '-' + depths[i][1] + '<br>';
    }
    div.innerHTML += '<i class="color-square" style="background:' + colors[depths.length-1] + '"></i> ' + depths[depths.length-1][0] + '+';
    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(map);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.

  });
});
