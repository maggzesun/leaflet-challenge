// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    function getColor (d) {

      if (d < 10) {
        return '#FEB24C';
      }
    
      else if (d > 10 && d < 30) {
        return '#FD8D3C';
      }
    
      else if (d > 30 && d < 50) {
        return '#FC4E2A';
      }

      else if (d > 50 && d < 70) {
        return '#E31A1C';
      }

      else if (d > 70 && d < 90) {
        return '#BD0026';
      }

      else {
        return '#800026';
     }
    }

    function pointToLayer(feature, latlng) {

        return L.circleMarker(latlng, {
            fillOpacity: 0.75,
            color: "white",
            fillColor: getColor(feature.geometry.coordinates[2]),
            // Adjust the radius.
            radius: Math.sqrt(feature.properties.mag) * 10
            });   
    }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<h4> Earthquake Depth<h4>';
    div.innerHTML += '<i style = "background: #FEB24C"></i><span><10</span><br>';
    div.innerHTML += '<i style = "background: #FD8D3C"></i><span>10 - 30</span><br>';
    div.innerHTML += '<i style = "background: #FC4E2A"></i><span>30 - 50</span><br>';
    div.innerHTML += '<i style = "background: #E31A1C"></i><span>50 - 70</span><br>';
    div.innerHTML += '<i style = "background: #BD0026"></i><span>70 - 90</span><br>';
    div.innerHTML += '<i style = "background: #800026"></i><span>>90</span><br>';

    return div;
  };

  legend.addTo(myMap);

}
