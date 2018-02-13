'use strict';

const input = document.getElementById('autocomplete');
const options = {
  types: ['geocode']
};

const autocomplete = new google.maps.places.Autocomplete(input, options);

google.maps.event.addListener(autocomplete, 'place_changed', getInfoPlace);

function getInfoPlace () {
  const newPlace = autocomplete.getPlace();
  console.log('newPlace Entire Object: ', newPlace);
  console.log('newPlace Latitude: ', newPlace.geometry.location.lat());
  console.log('newPlaceLongitude', newPlace.geometry.location.lng());
}
// const newPlace = autocomplete.getPlace();
// console.log(newPlace);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var geolocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    var circle = new google.maps.Circle({
      center: geolocation,
      radius: position.coords.accuracy
    });
    autocomplete.setBounds(circle.getBounds());
  });
}
