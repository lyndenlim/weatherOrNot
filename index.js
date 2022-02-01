// Convert day of the week from number to day
let day
let dayName = []
let convertedDay = []
function convertNumberToDay() {
  // Adjusted number based on what current day is
  let dayOfWeek = new Date().getDay()
  for (i = 1; i <= 6; i++) {
    dayOfWeek++;
    if (dayOfWeek === 7) {
      dayOfWeek = dayOfWeek - 7
    }
    dayName.push(dayOfWeek);
  }
  // Convert number to day
  dayName.forEach(day => {
    switch (day) {
      case 0:
        convertedDay.push("Sunday")
        break;
      case 1:
        convertedDay.push("Monday")
        break;
      case 2:
        convertedDay.push("Tuesday")
        break;
      case 3:
        convertedDay.push("Wednesday")
        break;
      case 4:
        convertedDay.push("Thursday")
        break;
      case 5:
        convertedDay.push("Friday")
        break;
      case 6:
        convertedDay.push("Saturday")
        break;
    }
  })
  return convertedDay
}

const weatherTodayClass = document.querySelector(".weather-today")
weatherTodayClass.hidden = true;
const weatherContainerClass = document.querySelector(".weather-container")
weatherContainerClass.hidden = true;

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

    weatherTodayClass.hidden = false;
    weatherContainerClass.hidden = false;

    weatherTodayClass.classList.remove("weather-today-fade-out");
    weatherContainerClass.classList.remove("weather-container-fade-out");


  });

  geocoder.on('clear', () => {
    // results.innerText = '';

    // Clears today info
    setTimeout(() => {
      document.querySelector("#today").textContent = ""
      document.querySelector("#city").textContent = ""
      document.querySelector("#today-temperature").textContent = ""
      document.querySelector("#feels-like").textContent = ""
      document.querySelector("#today-short-description").textContent = ""
      document.querySelector("#today-high").textContent = ""
      document.querySelector("#today-low").textContent = ""
      document.querySelector("#today-precipitation").textContent = ""
      document.querySelector("#today-humidity").textContent = ""
      document.querySelector("#umbrella-recommendation").textContent = ""

      // Clears weekly forecast info
      document.querySelectorAll(".can-be-removed").forEach(item => item.remove())
      document.querySelectorAll(".can-be-removed-img").forEach(item => item.remove())
      document.querySelectorAll("br").forEach(br => br.remove())

    }, 1000)

    // Handles transition in/out for all info
    weatherTodayClass.classList.add("weather-today-fade-out");
    weatherContainerClass.classList.add("weather-container-fade-out");

  });
};

function fetchData(coordinates, locationData) {
  // Fetch weather from API
  return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates[1]}&lon=${coordinates[0]}&exclude=minutely,hourly\
    &units=imperial&appid=3c3d4f0ad3af133b6616a9c3c2f45c9a`)
    .then(resp => resp.json())
    .then(weatherData => {
      currentWeatherInfo(weatherData, locationData)
      weeklyWeatherInfo(weatherData)
    });
};

function currentWeatherInfo(weatherData, locationData) {
  // Sets weather values for today's forecast
  const todayIcon = weatherData.current.weather[0].icon
  const todayTemp = Math.ceil(weatherData.current.temp)
  // Change description to title case
  let todayShortDescription = weatherData.current.weather[0].description
  const descriptionSplit = todayShortDescription.split(" ")
  const descriptionTitleCase = descriptionSplit.map(word => {
    return word[0].toUpperCase() + word.slice(1, word.length)
  })
  const descriptionTitleCaseJoin = descriptionTitleCase.join(" ")
  const todayFeelsLike = Math.ceil(weatherData.current.feels_like)
  // Pushes all results for the next 24 hours into arrays
  let maxArray = []
  let minArray = []
  let hourlyPrecipitation = []
  for (i = 0; i < 24; i++) {
    maxArray.push(weatherData.hourly[i].temp)
    minArray.push(weatherData.hourly[i].temp)
    hourlyPrecipitation.push(weatherData.hourly[i].pop)
  }
  // Get max/min temp for day
  const todayMaxTemp = Math.ceil(Math.max(...minArray))
  const todayMinTemp = Math.ceil(Math.min(...minArray))
  const todayPrecipitation = Math.ceil(weatherData.hourly[0].pop * 100)
  const todayHumidity = Math.ceil(weatherData.current.humidity)
  // Get max precipitation for the day
  hourlyPrecipitation = hourlyPrecipitation.map(hour => hourlyPrecipitation = Math.ceil(hour * 100))
  maxPrecipitation = (Math.max(...hourlyPrecipitation))

  // Assign values weather components based on user input using parsed map/weather data
  const todayIconImg = document.querySelector("#weather-today-img")
  const umbrellaRecommendation = document.querySelector("#umbrella-recommendation")
  locationData.forEach(area => {
    const elementSplit = area.id.split(".")
    if (elementSplit[0] === "place") {
      // Change OpenWeather base icons to animated ones
      switch (todayIcon) {
        case "01d":
          todayIconImg.src = "/assets/sun.svg";
          break;
        case "01n":
          todayIconImg.src = "/assets/sun.svg";
          break;
        case "02d":
          todayIconImg.src = "/assets/cloudy-day.svg";
          break;
        case "02n":
          todayIconImg.src = "/assets/cloudy-day.svg";
          break;
        case "03d":
          todayIconImg.src = "/assets/cloudy.svg";
          break;
        case "03n":
          todayIconImg.src = "/assets/cloudy.svg";
          break;
        case "04d":
          todayIconImg.src = "/assets/cloudy.svg";
          break;
        case "04n":
          todayIconImg.src = "/assets/cloudy.svg";
          break;
        case "09d":
          todayIconImg.src = "/assets/rain.svg";
          break;
        case "09n":
          todayIconImg.src = "/assets/rain.svg";
          break;
        case "10d":
          todayIconImg.src = "/assets/partly-cloudy-rain.svg";
          break;
        case "10n":
          todayIconImg.src = "/assets/partly-cloudy-rain.svg";
          break;
        case "11d":
          todayIconImg.src = "assets/cloud-lightning.svg";
          break;
        case "11n":
          todayIconImg.src = "assets/cloud-lightning.svg";
          break;
        case "13d":
          todayIconImg.src = "/assets/snow.svg";
          break;
        case "13n":
          todayIconImg.src = "/assets/snow.svg";
          break;
        case "50d":
          todayIconImg.src = `http://openweathermap.org/img/wn/${todayIcon}@2x.png`;
          break;
        case "50n":
          todayIconImg.src = `http://openweathermap.org/img/wn/${todayIcon}@2x.png`;
          break;
        default:
          todayIconImg.src = `http://openweathermap.org/img/wn/${todayIcon}@2x.png`;
      }
      document.querySelector("#today").textContent = "Today"
      document.querySelector("#city").textContent = area.text
      document.querySelector("#today-temperature").textContent = `${todayTemp}°F`
      document.querySelector("#today-short-description").textContent = descriptionTitleCaseJoin
      document.querySelector("#feels-like").textContent = `FEELS LIKE ${todayFeelsLike}°F`
      document.querySelector("#today-high").textContent = `High: ${todayMaxTemp}°F`
      document.querySelector("#today-low").textContent = `Low: ${todayMinTemp}°F`

      // Displays icon based on what attributes are present
      if (weatherData.current.snow !== undefined && weatherData.current.rain === undefined) {
        document.querySelector("#today-precipitation").innerHTML = `<i class="far fa-snowflake"></i> ${todayPrecipitation}%`
      } else {
        document.querySelector("#today-precipitation").innerHTML = `<i class="fas fa-umbrella"></i> ${todayPrecipitation}%`
      }
      document.querySelector("#today-humidity").textContent = `${todayHumidity}% humidity`

      // Changes color of umbrella based on percentage of precipitation for the current hour
      if (todayPrecipitation >= 50) {
        document.querySelector(".fa-umbrella").style.color = "#1468f0"
      } else if (todayPrecipitation < 50 && todayPrecipitation >= 30) {
        document.querySelector(".fa-umbrella").style.color = "#5c9ffb"
      } else {
        document.querySelector(".fa-umbrella").style.color = "white"
      }

      // Displays umbrella suggestion based on what max precipitation for day is
      if (maxPrecipitation >= 50) {
        umbrellaRecommendation.textContent = "Don't forget your umbrella!"
      } else if (maxPrecipitation < 50 && maxPrecipitation >= 30) {
        umbrellaRecommendation.textContent = "You might want to bring an umbrella today."
      } else {
        umbrellaRecommendation.textContent = "No need for an umbrella today."
      }
    };
  });
};

function weeklyWeatherInfo(weatherData) {
  // Iterate through weather info for the next 6 days
  const convertedDay = convertNumberToDay()
  for (i = 0; i < 6; i++) {
    const dailyIcon = weatherData.daily[i].weather[0].icon
    const dailyShortDescription = weatherData.daily[i].weather[0].description
    const dailyMaxTemp = Math.ceil(weatherData.daily[i].temp.max)
    const dailyMinTemp = Math.ceil(weatherData.daily[i].temp.min)
    const dailyPrecipitation = Math.ceil(weatherData.daily[i].pop * 100)
    const dailyHumidity = weatherData.daily[i].humidity

    const dailyShortDescriptionSplit = dailyShortDescription.split(" ")
    const dailyDescriptionTitleCase = dailyShortDescriptionSplit.map(word => {
      return word[0].toUpperCase() + word.slice(1, word.length)
    })
    const dailyDescriptionTitleCaseJoin = dailyDescriptionTitleCase.join(" ")

    // Create elements, assign values, and append to webpage
    const dailyIconImg = document.createElement("img")
    const dayOfWeekLi = document.createElement("li")
    const dailyShortDescriptionLi = document.createElement("li")
    const dailyMaxTempLi = document.createElement("li")
    const dailyMinTempLi = document.createElement("li")
    const dailyHumidityLi = document.createElement("li")
    const dailyPrecipitationLi = document.createElement("li")
    const breakElement = document.createElement("br")
    dailyPrecipitationLi.classList.add(`weekly-precipitation-${i}`)

    // Add class to images to be able to reset info
    dailyIconImg.classList.add("can-be-removed-img")
    dayOfWeekLi.classList.add("can-be-removed")
    dailyShortDescriptionLi.classList.add("can-be-removed")
    dailyMaxTempLi.classList.add("can-be-removed")
    dailyMinTempLi.classList.add("can-be-removed")
    dailyHumidityLi.classList.add("can-be-removed")
    dailyPrecipitationLi.classList.add("can-be-removed")
    // Change OpenWeather base icons to animated ones
    switch (dailyIcon) {
      case "01d":
        dailyIconImg.src = "/assets/sun.svg";
        break;
      case "01n":
        dailyIconImg.src = "/assets/sun.svg";
        break;
      case "02d":
        dailyIconImg.src = "/assets/cloudy-day.svg";
        break;
      case "02n":
        dailyIconImg.src = "/assets/cloudy-day.svg";
        break;
      case "03d":
        dailyIconImg.src = "/assets/cloudy.svg";
        break;
      case "03n":
        dailyIconImg.src = "/assets/cloudy.svg";
        break;
      case "04d":
        dailyIconImg.src = "/assets/cloudy.svg";
        break;
      case "04n":
        dailyIconImg.src = "/assets/cloudy.svg";
        break;
      case "09d":
        dailyIconImg.src = "/assets/rain.svg";
        break;
      case "09n":
        dailyIconImg.src = "/assets/rain.svg";
        break;
      case "10d":
        dailyIconImg.src = "/assets/partly-cloudy-rain.svg";
        break;
      case "10n":
        dailyIconImg.src = "/assets/partly-cloudy-rain.svg";
        break;
      case "11d":
        dailyIconImg.src = "assets/cloud-lightning.svg";
        break;
      case "11n":
        dailyIconImg.src = "assets/cloud-lightning.svg";
        break;
      case "13d":
        dailyIconImg.src = "/assets/snow.svg";
        break;
      case "13n":
        dailyIconImg.src = "/assets/snow.svg";
        break;
      case "50d":
        dailyIconImg.src = `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`;
        break;
      case "50n":
        dailyIconImg.src = `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`;
        break;
      default:
        dailyIconImg.src = `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`;
    }
    dayOfWeekLi.textContent = convertedDay[i]
    dailyShortDescriptionLi.textContent = dailyDescriptionTitleCaseJoin
    dailyMaxTempLi.textContent = `High: ${dailyMaxTemp}°F`
    dailyMinTempLi.textContent = `Low: ${dailyMinTemp}°F`
    dailyPrecipitationLi.innerHTML = `<i class="fas fa-umbrella weekly-umbrella-${i}"></i> ${dailyPrecipitation}%`


    // Precipitation form handled based on what attributes are present in the data
    if (weatherData.daily[i].snow !== undefined && weatherData.daily[i].rain === undefined) {
      dailyPrecipitationLi.innerHTML = `<i class="far fa-snowflake"></i> ${dailyPrecipitation}%`
    }
    dailyHumidityLi.textContent = `${dailyHumidity}% humidity`

    document.querySelector(`#day-${i}`).append(dailyIconImg, dayOfWeekLi, dailyShortDescriptionLi, dailyMaxTempLi,
      dailyMinTempLi, dailyPrecipitationLi, dailyHumidityLi, breakElement)

  };

  // Changes color of umbrella based on percentage of precipitation
  document.querySelectorAll(`.fa-umbrella`).forEach(item => {
    const temps = parseInt(item.parentNode.innerText)
    if (temps >= 50) {
      item.style.color = "#1468f0"
    } else if (temps < 50 && temps >= 30) {
      item.style.color = "#5c9ffb"
    } else {
      item.style.color = "white"
    }
  })

};

// Functionality to open sidebar
const sideBarId = document.getElementById("sidebar")
function sidebarOpen() {
  document.getElementById("open-nav").addEventListener("click", e => {
    sideBarId.style.width = "30%";
    sideBarId.style.display = "block";
  });
};

// Functionality to close siderbar
function sidebarClose() {
  document.getElementById("close-nav").addEventListener("click", e => {
    sideBarId.style.display = "none";
  });
};



document.addEventListener("DOMContentLoaded", e => {
  convertInputToCoordinates()
  sidebarOpen()
  sidebarClose()
});

