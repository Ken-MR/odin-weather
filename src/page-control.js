import './style.css';
import thermometerIcon from './thermometer.png';
import humidityIcon from './humidity.png';
import windIcon from './wind.png';
import { weather, forecast } from './weather.js';
import { getDay, getHours, parseISO } from 'date-fns';

let currentTimeFrame = 'daily';
let currentTempUnit = 'F';

window.onload = () => {
  document.getElementById("town-search").addEventListener("submit", () => {DOMControl.pageUpdates('new')});
  DOMControl.pageUpdates('new')
  document.getElementById("temp-conversion").addEventListener("click", () => {DOMControl.convertTemp();});
  document.getElementById("hourly-time").addEventListener("click", () => {DOMControl.displayTime();});
  document.getElementById("days-time").addEventListener("click", () => {DOMControl.displayTime();});
  document.getElementById("days-time").disabled = true;
};

const DOMControl = (() => {
  const pageUpdates = async (type) => {
    if (type === 'new') {
      await weather.retrieveWeather();
    }
    weatherDisplay();
    generateForecastCards();
  }

  const eraseChildren = (element) => {
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
  };

  const weatherDisplay = () => {
    let weatherInfo = document.getElementById("weather");
    let locationInfo = document.getElementById("location");
    let timeInfo = document.getElementById("time");
    let tempInfo = document.getElementById("temp");
    let icon = document.getElementById("weather-icon");

    let feelsLikeInfo = document.getElementById("feels-like");
    let humidityInfo = document.getElementById("humidity");
    let windSpeedInfo = document.getElementById("wind-speed");

    eraseChildren(weatherInfo);
    eraseChildren(locationInfo);
    eraseChildren(timeInfo);
    eraseChildren(tempInfo);

    eraseChildren(feelsLikeInfo);
    eraseChildren(humidityInfo);
    eraseChildren(windSpeedInfo);

    let iconList = document.querySelectorAll(".icon");

    iconList[0].src = thermometerIcon;
    iconList[1].src = humidityIcon;
    iconList[2].src = windIcon;

    for (let i = 0; i < forecast.location.length; i++) {
      locationInfo.appendChild(document.createTextNode(`${forecast.location[i]}`));
      locationInfo.appendChild(document.createElement('br'));
    }
    weatherInfo.appendChild(document.createTextNode(`${forecast.weather}`));
    timeInfo.appendChild(document.createTextNode(`Retrieved: ${forecast.time}`));
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
  }

  const generateForecastCards = () => {
    let timeCards = document.getElementById("time-cards");
    eraseChildren(timeCards);
    if (currentTimeFrame === 'daily') {
      for (let i = 0; i < forecast.dailyForecast.length; i++) {
        let forecastElement = document.createElement('div');
        let forecastTime = document.createElement('p');
        let forecastTemp = document.createElement('h1');
        let forecastIcon = document.createElement('img');

        forecastElement.appendChild(forecastTime);
        forecastElement.appendChild(forecastTemp);
        forecastElement.appendChild(forecastIcon);
        forecastElement.setAttribute('class', 'day-card');

        let day = dayOfWeek(getDay(parseISO(forecast.dailyForecast[i].date)));
        forecastTime.appendChild(document.createTextNode(day));
        (currentTempUnit === 'F' ? 
        forecastTemp.appendChild(document.createTextNode(`${forecast.dailyForecast[i].tempF} °F`)) 
        : forecastTemp.appendChild(document.createTextNode(`${forecast.dailyForecast[i].tempC} °C`)));
        forecastIcon.src = forecast.dailyForecast[i].weatherType;
        timeCards.appendChild(forecastElement);
      }
    }
    else {
      for (let i = 0; i < forecast.hourlyForecast.length; i++) {
        let forecastElement = document.createElement('div');
        let forecastTime = document.createElement('p');
        let forecastTemp = document.createElement('h1');
        let forecastIcon = document.createElement('img');

        forecastElement.appendChild(forecastTime);
        forecastElement.appendChild(forecastTemp);
        forecastElement.appendChild(forecastIcon);
        forecastElement.setAttribute('class', 'hour-card');

        let hour = hourOfDay(getHours(parseISO(forecast.hourlyForecast[i].time)));
        forecastTime.appendChild(document.createTextNode(hour));
        (currentTempUnit === 'F' ? 
        forecastTemp.appendChild(document.createTextNode(`${forecast.hourlyForecast[i].tempF} °F`)) 
        : forecastTemp.appendChild(document.createTextNode(`${forecast.hourlyForecast[i].tempC} °C`)));
        forecastIcon.src = forecast.hourlyForecast[i].weatherType;
        timeCards.appendChild(forecastElement);
      }
    }
  }

  const convertTemp = () => {
    let button = document.getElementById('temp-conversion');
    let tempInfo = document.getElementById("temp");
    let feelsLikeInfo = document.getElementById("feels-like");
    let windSpeedInfo = document.getElementById("wind-speed");

    if (currentTempUnit === 'F') {
      button.textContent = 'Convert to F';
      currentTempUnit = 'C'

      tempInfo.textContent = `${forecast.tempC} °C`;
      feelsLikeInfo.textContent = `${forecast.feelsLikeC} °C`;
      windSpeedInfo.textContent = `${forecast.wind[2]} ${forecast.wind[1]} kph`;
    }
    else {
      button.textContent = 'Convert to C';
      currentTempUnit = 'F'

      tempInfo.textContent = `${forecast.tempF} °F`;
      feelsLikeInfo.textContent = `${forecast.feelsLikeF} °F`;
      windSpeedInfo.textContent = `${forecast.wind[2]} ${forecast.wind[0]} mph`;
    }
    generateForecastCards();
  }

  const displayTime = () => {
    let hourBTN = document.getElementById('hourly-time');
    let dayBTN = document.getElementById('days-time');
    if (currentTimeFrame === 'daily') {
      currentTimeFrame = 'hourly';
      hourBTN.disabled = true;
      dayBTN.disabled = false;
    }
    else {
      currentTimeFrame = 'daily';
      hourBTN.disabled = false;
      dayBTN.disabled = true;
    }
    generateForecastCards();
  }

  const dayOfWeek = (date) => {
    switch (date) {
      case 0: return 'Sunday';
      case 1: return 'Monday';
      case 2: return 'Tuesday';
      case 3: return 'Wednesday';
      case 4: return 'Thursday';
      case 5: return 'Friday';
      case 6: return 'Saturday';
    }
  }

  const hourOfDay = (time) => {
    if (time === 0) {
      return '12 AM';
    }
    else if (time === 12) {
      return '12 PM';
    }
    else if (time > 12) {
      return `${time-12} PM`;
    }
    else {
      return `${time} AM`;
    }
  }
  return { pageUpdates, convertTemp, displayTime };
})();