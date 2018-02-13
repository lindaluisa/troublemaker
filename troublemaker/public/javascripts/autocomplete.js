'use strict';

const input = document.getElementById('autocomplete');
const options = {
  types: ['geocode']
};

const autocomplete = new google.maps.places.Autocomplete(input, options);

google.maps.event.addListener(autocomplete, 'place_changed', getInfoPlace);

function getInfoPlace () {
  const newPlace = autocomplete.getPlace();
  const revLat = newPlace.geometry.location.lat();
  const revLng = newPlace.geometry.location.lng();

  const revLatElement = document.getElementById('rev-lat');
  const revLngElement = document.getElementById('rev-lng');

  revLatElement.value = revLat;
  revLngElement.value = revLng;
}

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(function (position) {
//     var geolocation = {
//       lat: position.coords.latitude,
//       lng: position.coords.longitude
//     };
//     var circle = new google.maps.Circle({
//       center: geolocation,
//       radius: position.coords.accuracy
//     });
//     autocomplete.setBounds(circle.getBounds());
//   });
// }
