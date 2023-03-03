import './style.css';
import thermometerIcon from './img/thermometer.png';
import rainIcon from './img/rainfall.png';
import humidityIcon from './img/humidity.png';
import windIcon from './img/wind.png';
import sunRiseIcon from './img/sunrise.png';
import sunSetIcon from './img/sunset.png';
import moonPhaseIcon from './img/moon.png';
import leftArrowIcon from './img/arrow-left.png'
import rightArrowIcon from './img/arrow-right.png'
import { weather, forecast } from './weather.js';
import { getDay, getHours, parseISO } from 'date-fns';

let currentTimeFrame = 'daily';
let currentTempUnit = 'F';
let hourTracker = 0;

window.onload = () => {
  document.getElementById("town-search").addEventListener("submit", () => {DOMControl.pageUpdates('new')});
  DOMControl.pageUpdates('new')
  document.getElementById("temp-conversion").addEventListener("click", () => {DOMControl.convertTemp();});
  document.getElementById("hourly-time").addEventListener("click", () => {DOMControl.displayTime();});
  document.getElementById("days-time").addEventListener("click", () => {DOMControl.displayTime();});
  document.getElementById("days-time").disabled = true;
  document.getElementById('next-button').src = rightArrowIcon;
  document.getElementById('next-button').addEventListener('click', () => {sliderMovement.nextSlide()});
  document.getElementById('prev-button').src = leftArrowIcon;
  document.getElementById('prev-button').addEventListener('click', () => {sliderMovement.prevSlide()});
  let dots = document.querySelectorAll('.dots');
  for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener('click', () => {sliderMovement.slideJump(i)});
  }
  dots[0].classList.add('dot-active');
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
    let chanceOfRainInfo = document.getElementById("rain-chance");
    let humidityInfo = document.getElementById("humidity");
    let windSpeedInfo = document.getElementById("wind-speed");
    let sunRiseInfo = document.getElementById("sun-rise");
    let sunSetInfo = document.getElementById("sun-set");
    let moonPhaseInfo = document.getElementById("moon-phase");

    eraseChildren(weatherInfo);
    eraseChildren(locationInfo);
    eraseChildren(timeInfo);
    eraseChildren(tempInfo);

    eraseChildren(feelsLikeInfo);
    eraseChildren(chanceOfRainInfo);
    eraseChildren(humidityInfo);
    eraseChildren(windSpeedInfo);
    eraseChildren(sunRiseInfo);
    eraseChildren(sunSetInfo);
    eraseChildren(moonPhaseInfo);

    let iconList = document.querySelectorAll(".icon");
    iconList[0].src = thermometerIcon;
    iconList[1].src = rainIcon;
    iconList[2].src = humidityIcon;
    iconList[3].src = windIcon;
    iconList[4].src = sunRiseIcon;
    iconList[5].src = sunSetIcon;
    iconList[6].src = moonPhaseIcon;

    for (let i = 0; i < forecast.location.length; i++) {
      locationInfo.appendChild(document.createTextNode(`${forecast.location[i]}`));
      locationInfo.appendChild(document.createElement('br'));
    }
    weatherInfo.appendChild(document.createTextNode(`${forecast.weather}`));
    chanceOfRainInfo.appendChild(document.createTextNode(`${forecast.rainChance} %`));
    sunRiseInfo.appendChild(document.createTextNode(`${forecast.sunRise}`));
    sunSetInfo.appendChild(document.createTextNode(`${forecast.sunSet}`));
    moonPhaseInfo.appendChild(document.createTextNode(`${forecast.moonPhase}`));
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
      for (let i = 0; i < 8; i++) {
        timeCards.appendChild(hourCard(i+ 8*hourTracker));
      }
    }
  }

  const hourCard = (i) => {
    let forecastElement = document.createElement('div');
    let forecastTime = document.createElement('p');
    let forecastTemp = document.createElement('h1');
    let forecastIcon = document.createElement('img');

    forecastElement.appendChild(forecastTime);
    forecastElement.appendChild(forecastTemp);
    forecastElement.appendChild(forecastIcon);
    forecastElement.setAttribute('class', 'hour-card');
    forecastElement.classList.add(`${i}`);

    let hour = hourOfDay(getHours(parseISO(forecast.hourlyForecast[i].time)));
    forecastTime.appendChild(document.createTextNode(hour));
    (currentTempUnit === 'F' ? 
    forecastTemp.appendChild(document.createTextNode(`${forecast.hourlyForecast[i].tempF} °F`)) 
    : forecastTemp.appendChild(document.createTextNode(`${forecast.hourlyForecast[i].tempC} °C`)));
    forecastIcon.src = forecast.hourlyForecast[i].weatherType;
    return forecastElement;
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
    let BTNS = document.getElementById('buttons');
    if (currentTimeFrame === 'daily') {
      BTNS.classList.remove('inactive');
      currentTimeFrame = 'hourly';
      hourBTN.disabled = true;
      dayBTN.disabled = false;
    }
    else {
      BTNS.classList.add('inactive');
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
  return { pageUpdates, convertTemp, displayTime, generateForecastCards };
})();

const sliderMovement = (() => {
  const nextSlide = () => {
    if (hourTracker === 2) {
      return;
    }
    else {
      hourTracker++;
      DOMControl.generateForecastCards();
      fillDot(hourTracker);
      return;
    }
	};
	
	const prevSlide = () => {
    if (hourTracker === 0) {
      return;
    }
    else {
      hourTracker--;
      DOMControl.generateForecastCards();
      fillDot(hourTracker);
      return;
    }
	};
	
	const slideJump = (id) => {
    hourTracker = id;
    DOMControl.generateForecastCards();
		fillDot(id);
	};
	
	const fillDot = (id) => {
    let dots = document.querySelectorAll('.dots');
    dots.forEach(d => d.setAttribute('class', 'dots'));
    dots[id].classList.add('dot-active');
	};

	return { nextSlide, prevSlide, slideJump };
})();