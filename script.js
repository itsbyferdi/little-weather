// Add loading state

// Fetch data from Geocoding Open Meteo
async function getCityData() {
  // Get input value from the search
  let searchQuery = document.getElementById("search-action").value;

  // Fetch the data from the input results
  try {
    let responseLocationData = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=10&language=en&format=json`
    );

    let dataResponse = await responseLocationData.json();
    // console.log(dataResponse);

    // Show city in the UI from the API
    let currentCity = document.getElementById("city-name");
    currentCity = dataResponse.results[0].name;
    document.querySelector("#city-name").innerHTML = currentCity;

    // Show Timezone in the UI from the API
    let currentTimezone = document.getElementById("timezone");
    currentTimezone = dataResponse.results[0].timezone;
    document.querySelector("#timezone").innerHTML = currentTimezone;

    // Convert IATA Timezone into UTC

    // Get Latitude and Longitude data;
    let latitudeData = dataResponse.results[0].latitude;
    let longitudeData = dataResponse.results[0].longitude;

    // Fetch weather data using Lat Long template literals (dynamic request)
    let responseData = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitudeData}&longitude=${longitudeData}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    let cityData = await responseData.json();
    // console.log(cityData);

    // Show date in the UI
    let currentDate = document.getElementById("current-date");
    currentDate = cityData.current.time;

    let convertDate = new Date(currentDate);
    let options = { year: "numeric", month: "short", day: "numeric" };
    let convertedDate = convertDate.toLocaleDateString("en-US", options);
    document.querySelector(`#current-date`).innerHTML = convertedDate;

    // Show time in the UI
    let currentTime = document.getElementById("current-time");
    currentTime = cityData.current.time;

    let convertTime = new Date(currentDate);
    let timeOptions = { hour: "numeric", minute: "numeric" };
    let convertedTime = convertTime.toLocaleTimeString("en-US", timeOptions);

    document.querySelector("#current-time").innerHTML = convertedTime;

    // Show current temperature in the card
    let currentTemperature = document.getElementById("current-temperature");
    currentTemperature =
      cityData.current.temperature_2m + cityData.current_units.temperature_2m;

    document.querySelector("#current-temperature").innerHTML =
      currentTemperature;

    // Show current wind speed in the card
    let windSpeed = document.getElementById("wind-speed");
    windSpeed =
      cityData.current.wind_speed_10m + cityData.current_units.wind_speed_10m;

    document.querySelector("#wind-speed").innerHTML = windSpeed;

    // Show current relative humidity in the card
    let relativeHumidity = document.getElementById("relative-humidity");
    relativeHumidity =
      cityData.current.relative_humidity_2m +
      cityData.current_units.relative_humidity_2m;

    document.querySelector("#relative-humidity").innerHTML = relativeHumidity;

    // Show apparent temperature value (feels like)
    let feelsLike = document.getElementById("feels-like");

    let heatIndex = cityData.current.apparent_temperature;
    let heatIndexUnits = cityData.current_units.apparent_temperature;

    feelsLike = heatIndex + heatIndexUnits;
    document.querySelector("#feels-like").innerHTML = feelsLike;

    // Add description below the feels like temperature
    let feelsLikeDescription = document.getElementById(
      "feels-like-description"
    );
    feelsLikeDescription = feelsLike;

    function showfeelsLike() {
      if (feelsLike < currentTemperature) {
        feelsLike = "colder";
        document.querySelector("#feels-like-description").innerHTML =
          "Humidity is making it feel " + feelsLike;
      } else {
        feelsLike = "warmer";
        document.querySelector("#feels-like-description").innerHTML =
          "Humidity is making it feel " + feelsLike;
      }
    }
    showfeelsLike();

    // Show future date in a daily forecast data
    let showDate = document.querySelectorAll(".forecast-daily");
    let futureDate = cityData.daily.time;

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < futureDate.length; i++) {
      if (showDate[i]) {
        let dateData = futureDate[i];
        // Convert future dates into days
        let dateName = new Date(dateData);
        let displayDate = weekdays[dateName.getDay()];
        showDate[i].innerHTML = displayDate;
      }
    }

    // Show future max temperature forecast in a daily forecast data
    let showHighTemp = document.querySelectorAll(".high-temp-forecast");
    let highTemp = cityData.daily.temperature_2m_max;

    for (let i = 0; i < highTemp.length; i++) {
      if (showHighTemp[i]) {
        let highTempData = highTemp[i];
        showHighTemp[i].innerHTML = "H" + " " + highTempData + "°C";
      }
    }

    // Show future min temperature forecast in a daily forecast data
    let showMinTemp = document.querySelectorAll(".min-temp-forecast");
    let minTemp = cityData.daily.temperature_2m_min;

    for (let i = 0; i < minTemp.length; i++) {
      if (showMinTemp[i]) {
        let minTempData = minTemp[i];
        showMinTemp[i].innerHTML = "L" + " " + minTempData + "°C";
      }
    }

    let weatherCodeList = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Drizzle: Light intensity",
      53: "Drizzle: Moderate intensity",
      55: "Drizzle: Dense intensity",
      56: "Freezing Drizzle: Light intensity",
      57: "Freezing Drizzle: Dense intensity",
      61: "Rain: Slight intensity",
      63: "Rain: Moderate intensity",
      65: "Rain: Heavy intensity",
      66: "Freezing Rain: Light intensity",
      67: "Freezing Rain: Heavy intensity",
      71: "Snow fall: Slight intensity",
      73: "Snow fall: Moderate intensity",
      75: "Snow fall: Heavy intensity",
      77: "Snow grains",
      80: "Rain showers: Slight intensity",
      81: "Rain showers: Moderate intensity",
      82: "Rain showers: Violent intensity",
      85: "Snow showers: Slight intensity",
      86: "Snow showers: Heavy intensity",
      95: "Thunderstorm: Slight or moderate",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };

    let weatherImageList = {
      0: "./images/sunny.svg",
      1: "./images/mostly-cloud.svg",
      2: "./images/partial-cloudy.svg",
      3: "./images/cloudy.svg",
      45: "./images/mostly-cloudy.svg",
      48: "./images/mostly-cloudy.svg",
      51: "./images/light-rain.svg",
      53: "./images/light-rain.svg",
      55: "./images/heavy-rain.svg",
      56: "./images/heavy-wind.svg",
      57: "./images/heavy-wind.svg",
      61: "./images/light-rain.svg",
      63: "./images/heavy-rain.svg",
      65: "./images/heavy-rain.svg",
      66: "./images/light-rain.svg",
      67: "./images/heavy-rain.svg",
      71: "./images/light-snow.svg",
      73: "./images/light-snow.svg",
      75: "./images/light-snow.svg",
      77: "./images/light-snow.svg",
      80: "./images/light-rain.svg",
      81: "./images/heavy-rain.svg",
      82: "./images/heavy-rain.svg",
      85: "./images/light-snow.svg",
      86: "./images/heavy-snowfall.svg",
      95: "./images/thunderstorm.svg",
      96: "./images/hailstorm.svg",
      99: "./images/hailstorm.svg",
    };

    // Get DOM for weather name
    let currentWeather = document.getElementById("current-weather-condition");
    // Get DOM for weather icon
    let currentWeatherImage = document.getElementById("current-weather-image");

    // Get current weather data code
    let currentWeatherData = cityData.current.weather_code;
    console.log(currentWeatherData);

    // Map object keys for the Code List in the name and the Image to an Array
    let weatherDataKeys = Object.keys(weatherCodeList);
    // console.log(weatherDataKeys);

    let weatherImageKeys = Object.keys(weatherImageList);

    // Check if weather code Data is the same with the one in the name object
    let checkWeatherCodeData = weatherDataKeys.find(
      (element) => parseInt(element) === currentWeatherData
    );
    console.log(checkWeatherCodeData);

    // Check if weather code Image is the same with the one in the name object

    let checkWeatherCodeImage = weatherImageKeys.find(
      (element) => parseInt(element) === currentWeatherData
    );

    // Map current weather code API results to the name of the weather
    // If weather code from the API matches with the key from weatherDataKeys, return the name and add it in the HTML;

    if (checkWeatherCodeData) {
      let weatherNameData = weatherCodeList[checkWeatherCodeData];
      currentWeather.innerHTML = weatherNameData;
    } else {
      currentWeather.innerHTML = "Unknown weather condition";
    }

    // Map current weather code API results to the image of the weather

    if (checkWeatherCodeImage) {
      let weatherImageData = weatherImageList[checkWeatherCodeImage];
      currentWeatherImage.src = weatherImageData;
      console.log(weatherImageData);
    } else {
      currentWeatherImage.innerHTML = "No image";
    }

    // Get DOM for daily weather
    let weatherCodeImage = document.getElementsByClassName("weather-code");
    let weatherCode = cityData.daily.weather_code;
    console.log(weatherCode);

    // Check if weather code Image is the same with the one in the name object

    let checkWeatherCode = weatherCode.map(
      (element) => weatherImageList[element]
    );

    for (let i = 0; i < checkWeatherCode.length; i++) {
      if (weatherCodeImage[i] && checkWeatherCode[i]) {
        let weatherCodeImageData = checkWeatherCode[i];
        weatherCodeImage[i].src = weatherCodeImageData;
      }
    }

    console.log(weatherCodeImageData);

    // Map current weather code API results to the name of the weather
    // If weather code from the API matches with the key from weatherDataKeys, return the name and add it in the HTML;

    // if (checkWeatherCodeData) {
    //   let weatherNameData = weatherCodeList[checkWeatherCodeData];
    //   currentWeather.innerHTML = weatherNameData;
    // } else {
    //   currentWeather.innerHTML = "Unknown weather condition";
    // }

    // for (let i = 0; i < weatherCode.length; i++) {
    //   if (weatherCodeImage[i]) {
    //     let weatherCodeData = weatherCode[i];
    //     weatherCodeImage[i].src = weatherCodeData;
    //   }
    // }
  } catch (error) {
    let errorMessage = "Data not found";
    console.log(errorMessage);
  }
}
getCityData();

// let cityData = {
//   latitude: 52.52,
//   longitude: 13.419998,
//   generationtime_ms: 0.189065933227539,
//   utc_offset_seconds: 7200,
//   timezone: "Europe/Berlin",
//   timezone_abbreviation: "CEST",
//   elevation: 38,
//   current_units: {
//     time: "iso8601",
//     interval: "seconds",
//     temperature_2m: "°C",
//     relative_humidity_2m: "%",
//     apparent_temperature: "°C",
//     precipitation: "mm",
//     weather_code: "wmo code",
//     wind_speed_10m: "km/h",
//   },
//   current: {
//     time: "2024-08-21T10:30",
//     interval: 900,
//     temperature_2m: 19.6,
//     relative_humidity_2m: 67,
//     apparent_temperature: 17.8,
//     precipitation: 0,
//     weather_code: 3,
//     wind_speed_10m: 20,
//   },
//   daily_units: {
//     time: "iso8601",
//     weather_code: "wmo code",
//     temperature_2m_max: "°C",
//     temperature_2m_min: "°C",
//   },
//   daily: {
//     time: [
//       "2024-08-21",
//       "2024-08-22",
//       "2024-08-23",
//       "2024-08-24",
//       "2024-08-25",
//       "2024-08-26",
//       "2024-08-27",
//     ],
//     weather_code: [80, 3, 80, 1, 80, 45, 2],
//     temperature_2m_max: [22.8, 22.6, 29.4, 32.3, 24.3, 22.8, 23.6],
//     temperature_2m_min: [15.7, 13.5, 16.2, 18.2, 16.3, 12.3, 13],
//   },
// };
