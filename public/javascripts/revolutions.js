'use strict';

function main () {
  function startMap () {
    const ironhackBCN = {
      lat: Number(userLocation.coordinates[0]),
      lng: Number(userLocation.coordinates[1])
    };
    const map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 13,
        center: ironhackBCN
      }
    );
    var myMarker = new google.maps.Marker({
      position: {
        lat: Number(userLocation.coordinates[0]),
        lng: Number(userLocation.coordinates[1])
      },
      map: map,
      title: 'You are here'
    });

    revolutions.forEach((revolution) => {
      const marker = new google.maps.Marker({
        position: {
          lat: revolution.location.coordinates[0],
          lng: revolution.location.coordinates[1]
        },
        map: map,
        title: revolution.name
      });
    });
  }

  startMap();
}

window.onload = main;
