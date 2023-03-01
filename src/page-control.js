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

    let feelsLikeInfo = document.getElementById("feels-like");
    let humidityInfo = document.getElementById("humidity");
    let windSpeedInfo = document.getElementById("wind-speed");

    let timeCards = document.getElementById("time-cards");

    for (let i = 0; i < forecast.location.length; i++) {
      locationInfo.appendChild(document.createTextNode(`${forecast.location[i]}`));
      locationInfo.appendChild(document.createElement('br'));
    }
    weatherInfo.appendChild(document.createTextNode(`${forecast.weather}`));
    timeInfo.appendChild(document.createTextNode(`${forecast.time}`));
    icon.src = forecast.icon;

    humidityInfo.appendChild(document.createTextNode(`${forecast.humid} %`));
    windSpeedInfo.appendChild(document.createTextNode(`${forecast.wind[2]} `));

    if (currentTempUnit === 'F') {
      tempInfo.appendChild(document.createTextNode(`${forecast.tempF} °F`));
      feelsLikeInfo.appendChild(document.createTextNode(`${forecast.feelsLikeF} °F`));
      windSpeedInfo.appendChild(document.createTextNode(`${forecast.wind[0]} mph`));
    }
    else {
      tempInfo.appendChild(document.createTextNode(`${forecast.tempC} °C`));
      feelsLikeInfo.appendChild(document.createTextNode(`${forecast.feelsLikeC} °C`));
      windSpeedInfo.appendChild(document.createTextNode(`${forecast.wind[1]} kph`));
    }

    if (currentTimeFrame === 'daily') {
      for (let i = 0; i < forecast.dailyForecast.length; i++) {
        let forecastElement = document.createElement('div');
        let forecastTime = document.createElement('p');
        let forecastTemp = document.createElement('h1');

        forecastElement.appendChild(forecastTime);
        forecastElement.appendChild(forecastTemp);
        forecastElement.setAttribute('class', 'day-card');

        forecastTime.appendChild(document.createTextNode(forecast.dailyForecast[i].date));
        (currentTempUnit === 'F' ? 
        forecastTemp.appendChild(document.createTextNode(`${forecast.dailyForecast[i].tempF} °F`)) 
        : forecastTemp.appendChild(document.createTextNode(`${forecast.dailyForecast[i].tempC} °C`)));
        timeCards.appendChild(forecastElement);
      }
    }

  }
  return { pageUpdates };
})();