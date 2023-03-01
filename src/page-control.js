import './style.css';
import { weather, forecast } from './weather.js';

let currentTimeFrame = 'daily';
let currentTempUnit = 'F';

window.onload = () => {
  document.getElementById("town-search").addEventListener("submit", () => {DOMControl.pageUpdates('new')});
  DOMControl.pageUpdates('new')
};

const DOMControl = (() => {
  const pageUpdates = async (type) => {
    if (type === 'new') {
      await weather.retrieveWeather();
    }
    weatherDisplay();
  }

  const weatherDisplay = () => {
    let weatherInfo = document.getElementById("weather");
    let locationInfo = document.getElementById("location");
    let timeInfo = document.getElementById("time");
    let tempInfo = document.getElementById("temp");
    let icon = document.getElementById("weather-icon");

    for (let i = 0; i < forecast.location.length; i++) {
      locationInfo.appendChild(document.createTextNode(`${forecast.location[i]}`));
      locationInfo.appendChild(document.createElement('br'));
    }
    weatherInfo.appendChild(document.createTextNode(`${forecast.weather}`));
    timeInfo.appendChild(document.createTextNode(`${forecast.time}`));
    tempInfo.appendChild(document.createTextNode(`${forecast.tempF}`));
    icon.src = forecast.icon;
  }
  return { pageUpdates };
})();