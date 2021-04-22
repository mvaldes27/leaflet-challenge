// Store our API endpoint inside link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// create a map object
var myMap = L.map("map", {
    center: [38.06, -117.23],
    zoom: 6
  });

//add base map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 14,
    id: "light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

//use D3 to get data
d3.json(link).then(function(data){

    // array of objects location, mag, depth  
    var magnitude = data.features.map(function(x) {
        return x.properties.mag;
      });
    
      var coordinates = data.features.map(function(x) {
        return x.geometry.coordinates.slice(0,2).reverse();
      });

      var depth = data.features.map(function(x) {
        return x.geometry.coordinates[2];
      });



  
  for (var i = 0; i < data.features.length; i++) {

    // Conditionals for depth
    var color = "";
    if (depth[i] > -10 && depth[i] < 10) {
      color = "lawngreen";
    }
    else if (depth[i] >= 10 && depth[i] < 30) {
      color = "greenyellow";
    }
    else if (depth[i] >= 30 && depth[i] < 50) {
      color = "gold";
    }

    else if (depth[i] >= 50 && depth[i] < 70) {
        color = "orange";
      }
    else if (depth[i] >= 70 && depth[i] < 90) {
        color = "salmon";
      }
    else {
      color = "tomato";
    }

    // Add circles to map
    L.circle(coordinates[i], {
        Opacity: 0.5,
        fillOpacity: 0.75,
        weight: 0.3,
        color: "black",
        fillColor: color,
        // Adjust radius
        radius: depth[i] * 1400
      }).bindPopup("<h1> Coordinates: " + coordinates[i] + "</h1> <hr> <h3>Magnitude: " + magnitude[i] + "</h1><hr> <h3>Depth: " + depth[i] + "</h3>").addTo(myMap);
  
  }

    // Set up the legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [' -10-10 ', ' 10-30 ', ' 30-50 ', ' 50-70 ', ' 70-90 ', ' 90+ '];
  var colors = ["lawngreen", "greenyellow", "gold", "orange", "salmon", "tomato"];
  var labels = [];



    grades.forEach(function(grades, index) {
        labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] + "\"></li>"+ grades + "</li></div>" );
    })

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};

// Adding legend to the map
legend.addTo(myMap);


});