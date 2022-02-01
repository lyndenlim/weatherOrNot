function convertInputToCoordinates() {
  // Creates location converter
  mapboxgl.accessToken = 'pk.eyJ1IjoibHluZGVubGltIiwiYSI6ImNreXBiYzVpNzA4aDAyd295ejZiM3QxbjAifQ.EFGNZzm9zONi23d709ht2A';
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Enter an address/location"
  });
  // Appends converter to HTML
  geocoder.addTo('#geocoder');

  // const results = document.getElementById('result');

  // Retrieves translated coordinates from input value and passes converted coords. and location info
  geocoder.on('result', (e) => {
    // Displays JSON under search bar
    // results.innerText = JSON.stringify(e.result, null, 2);
    fetchData(e.result.geometry.coordinates, e.result.context)

  });

  geocoder.on('clear', () => {
    // results.innerText = '';
  });
};

function fetchData(coordinates, locationData) {
  // Fetch weather from API
  return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates[1]}&lon=${coordinates[0]}&exclude=minutely,hourly\
    &units=imperial&appid=3c3d4f0ad3af133b6616a9c3c2f45c9a`)
    .then(resp => resp.json())
    .then(weatherData => weatherData);
};


document.addEventListener("DOMContentLoaded", e => {
  convertInputToCoordinates()
});

