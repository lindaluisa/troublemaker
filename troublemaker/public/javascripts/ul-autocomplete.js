'use strict';

const input = document.getElementById('autocomplete');
const options = {
  types: ['geocode']
};

const autocomplete = new google.maps.places.Autocomplete(input, options);

google.maps.event.addListener(autocomplete, 'place_changed', getInfoPlace);

function getInfoPlace () {
  const newPlace = autocomplete.getPlace();
  const userLat = newPlace.geometry.location.lat();
  const userLng = newPlace.geometry.location.lng();

  const userLatElement = document.getElementById('user-lat');
  const userLngElement = document.getElementById('user-lng');

  userLatElement.value = userLat;
  userLngElement.value = userLng;
}
