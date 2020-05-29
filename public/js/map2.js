'use strict';

console.log('hello');
console.log(location.lat)
let zipLat = parseFloat($('#lat').text());
let zipLng = parseFloat($('#lng').text());
console.log(zipLat, zipLng)
let array = [];
console.log($('section').children().length)
for(let i = 1; i < $('section').children().length; i++){
  array.push(parseInt($(`section :nth-child(${i})`).text()));
}
//  console.log(section)
// array = section.map(value =>{
//   console.log(value.text());
//   return parseInt(value.textContent);
// });
let number = 0;
console.log('array', array);
for(let i = 0; i < 500; i++){
number = Math.floor(Math.random() * 70)+30;
  array.push(number)
}


console.log(array);
var map;
function initMap() {
        var heatmapData = array.map(value =>{
          let randx = (Math.random()*.003)-.0015;
          let randy = (Math.random()*.003)-.0015;
          let ecoWeight = parseFloat(value/50)
          let lng = {location: new google.maps.LatLng(zipLat, zipLng), weight: ecoWeight}; 
          zipLat = zipLat + randx;
          zipLng = zipLng + randy;
          return lng;
        })
        
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: zipLat, lng: zipLng},
          zoom: 16
        });
        var heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatmapData
        });
        console.log('hi');
        heatmap.setMap(map);
          var gradient = [
            'rgba(0, 190, 0, 0)',
            // 'rgba(0, 255, 255, 1)',
            // 'rgba(0, 191, 255, 1)',
            // 'rgba(0, 127, 255, 1)',
            // 'rgba(0, 63, 255, 1)',
            // 'rgba(255, 0, 0, 1)',
            // 'rgba(223, 0, 0, 1)',
            // 'rgba(191, 0, 0, 1)',
            // 'rgba(159, 0, 0, 1)',
            'rgba(0, 190, 0, 1)',
            'rgba(0, 130, 0, 1)',
            'rgba(0, 90, 0, 1)',
            'rgba(0, 60, 0, 1)',
            'rgba(0, 30, 0, 1)'
          ]
          heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
        heatmap.set('radius', heatmap.get('radius') ? null : 20);
    }
    // new google.maps.LatLng(37.782, -122.447),
