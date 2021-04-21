// Store our API endpoint inside link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(link).then(function(data) {
    
  
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

  function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function circleSize(mag) {
        return mag * 5;
      }

 
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    var geojsonMarkerOptions = {
        radius: 7,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature, 
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }


    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

  function createMap(earthquakes) {

    // Define lightmap layer

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

   // Define a baseMaps object to hold our base layers
   var baseMaps = {
    // "Street Map": streetmap,
    "Light Map": lightmap
  };

   // Create overlay object to hold our overlay layer
   var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the earthquakes layer to display on load
  var myMap = L.map("map", {
    center: [
        38.06, -117.23
    ],
    zoom: 6,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var grades = ['TBD'];
  var colors = [];
  var labels = [];


    grades.forEach(function(grade, index) {
        labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 10px"+ "; height: 10px" + "\"></li>" + "<li>" + grade + "</li></div>");
    })

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};

// Adding legend to the map
legend.addTo(myMap);

  }





