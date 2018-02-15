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
  const vicinity = newPlace.address_components[2].long_name;

  const revLatElement = document.getElementById('rev-lat');
  const revLngElement = document.getElementById('rev-lng');
  const vicinityElement = document.getElementById('vicinity');

  revLatElement.value = revLat;
  revLngElement.value = revLng;
  vicinityElement.value = vicinity;
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
