'use strict';
console.log('hello');
console.log(location.lat)
const zipLat = parseFloat($('#lat').text());
const zipLng = parseFloat($('#lng').text());
console.log(zipLat, zipLng)

var map;
function initMap() {
        var heatmapData = [
            new google.maps.LatLng(37.782, -122.447),
          ];
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: zipLat, lng: zipLng},
        zoom: 14
      });
      var heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatmapData
        });
        heatmap.setMap(map);
    }
