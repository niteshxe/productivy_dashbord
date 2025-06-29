
// Performs reverse geocoding to get location details from coordinates
async function reverseGeocode(lat, lon) {
  const key = "ba64eed646eb46369f6bf0fb1e97cb4b"; // Your OpenCage API key
  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${key}`
  );
  const data = await res.json();
  const c = data.results[0].components;

  // Log location details
  console.log("City:", c.city || c.town || c.village);
  console.log("State:", c.state);
  console.log("County:", c.county );

  // Fetch weather and update UI with location
  getWeatherData(lat, lon);
  setLocation(c.city, c.state);
}

// Updates the city and state elements on the webpage
function setLocation(city, state) {
  let cityelement = document.querySelector('#city');
  let stateelement = document.querySelector('#state');
  cityelement.innerHTML = city || "Unable to fetch ";
  stateelement.innerHTML = state;
}

// Get user's current geolocation
navigator.geolocation.getCurrentPosition(
  (position) => {
    position.coords;
    console.log(`Latitude: ${position.coords.latitude} Longitude:, ${position.coords.longitude}`);
    reverseGeocode(position.coords.latitude, position.coords.longitude);
  },
  (error) => {
    console.error("Error obtaining location:", error);
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
);

// Displays the current date, day, and month
function datefn() {
  let dateElement = document.querySelector('#date');
  let monthElement = document.querySelector('#month');
  let yearElement = document.querySelector('#year');
  let dayElement = document.querySelector('#day');
  let dayobj = new Date();

  let date = dayobj.getDate();
  let month = dayobj.getMonth(); // Month is zero-based
  let monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let monthx = monthNames[month]; // Get full month name
  let year = dayobj.getFullYear();

  let dayarr = dayobj.getDay(); // Get day index
  let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dayName = dayNames[dayarr];

  // Set DOM elements
  dateElement.innerHTML = `${date}`;
  monthElement.innerHTML = `${monthx}`;
  yearElement.innerHTML = `${year}`;
  dayElement.innerHTML = `${dayName}`;
}
datefn();

// Displays the current time and keeps it updated every second
function timefn() {
  let timeElement = document.querySelector('#time');
  let timeobj = new Date();
  let hours = timeobj.getHours();
  let minutes = timeobj.getMinutes();
  let seconds = timeobj.getSeconds();

  // Pad with leading zeros
  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  let formattedTime = `${hours}:${minutes}:${seconds}`;
  timeElement.innerHTML = formattedTime;

  setTimeout(timefn, 1000); // Update time every second
}
timefn();

// Fetch weather data for current coordinates
async function getWeatherData(lat, lon) {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', lat);
    url.searchParams.set('longitude', lon);
    url.searchParams.set('current_weather', 'true');
    url.searchParams.set('timeformat', 'iso8601');

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    console.log('🌤️ Current weather:', data.current_weather);
let temperature = data.current_weather.temperature;
    let weather = getWeatherDescription(data.current_weather.weathercode);
    getWeatherimg(weather); // Fetch image related to weather
    setWeather_degrees(weather,temperature)

let winddir = getWindDirectionLabel(data.current_weather.winddirection)
let windspd = data.current_weather.windspeed;
setwindspeed_winddirection(windspd,winddir)








    console.log('Weather description:', weather);
  } catch (err) {
    console.error('Error fetching weather:', err);
  }
}

// Map weather codes to human-readable descriptions
function getWeatherDescription(code) {
  if (code === 0) {
    return "Sunny ";
  } else if (code >= 1 && code <= 3) {
    return " mostly cloudy";
  } else if (code === 45 || code === 48) {
    return "Misty";
  } else if (code >= 51 && code <= 57) {
    return "Light drizzle";
  } else if (code >= 61 && code <= 67) {
    return " showers";
  } else if (code >= 71 && code <= 75) {
    return "Falling snow ";
  } else if (code >= 80 && code <= 86) {
    return "snow showers";
  } else if (code === 95) {
    return "Moderate thunderstorm";
  } else if (code === 96 || code === 99) {
    return "Thunderstorm with hailstones";
  } else {
    return "Unknown weather condition";
  }
}



function getWindDirectionLabel(windDirection) {
  if (windDirection >= 0 && windDirection < 45) {
    return "Wind from the North";
  } else if (windDirection >= 45 && windDirection < 90) {
    return "Wind from the East-Northeast";
  } else if (windDirection >= 90 && windDirection < 135) {
    return "Wind from the East";
  } else if (windDirection >= 135 && windDirection < 180) {
    return "Wind from the Southeast";
  } else if (windDirection >= 180 && windDirection < 225) {
    return "Wind from the South";
  } else if (windDirection >= 225 && windDirection < 270) {
    return "Wind from the Southwest";
  } else if (windDirection >= 270 && windDirection < 315) {
    return "Wind from the West";
  } else if (windDirection >= 315 && windDirection <= 360) {
    return "Wind from the Northwest";
  } else {
    return "Invalid wind direction";
  }
}












// Fetch weather-related image from Unsplash API
function getWeatherimg(img, ) {
  fetch(`https://api.unsplash.com/search/photos?query=${img}&per_page=1&client_id=VKVDLrROURHvBjte_-CmxA9qQsXU6f1AlGxN3VttRX8`)
    .then(res => res.json())
    .then(data => {
      console.log(data.results[0].urls.regular);
      setWeatherImage(data.results[0].urls.regular);
    });

   
}


// Update background image based on weather
function setWeatherImage(imgUrl) {
  let img = document.querySelector('.img');
  img.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imgUrl})`;
}

function setWeather_degrees(we,temp) {
  let weather_dsc = document.querySelector('.weather_dsc');
let temp_no = document.querySelector('.temp_no');

temp_no.innerHTML = temp;
  weather_dsc.innerHTML = we;
 
}


function setwindspeed_winddirection(wspd,wdir){
let wind_dir =document.querySelector('.wind_dir');
let wind_spd = document.querySelector('.wind_spd');
wind_dir.innerHTML = wdir;
wind_spd.innerHTML = `${wspd} km/h`;
}