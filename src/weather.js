import './style.css';
import { Celcius, Fahrenheit, Kelvin } from '@khanisak/temperature-converter';

const weather = (() => {
  let forecast;

  class Forecast {
    constructor(weatherData) {
      this.location = weatherData.location.name;
      this.weather = weatherData.current.condition.text;
      this.tempF = weatherData.current.temp_f;
      this.tempC = weatherData.current.temp_c;
      this.timeRetrieved = weatherData.location.localtime;
  
      this.feelsLikeF = weatherData.current.feelslike_f;
      this.feelsLikeC = weatherData.current.feelslike_c;

      this.humid = weatherData.current.humidity;
      //this.rainChance = weatherData.
      this.wind = [weatherData.current.wind_mph, weatherData.current.wind_kph, weatherData.current.wind_dir];
    }
  }

  const retrieveWeather = async () => {
    // let searchTerm = `${search.value}`;
    let searchTerm;
    if (!searchTerm) {
      searchTerm = 'New York';
    }
    const weatherPage = document.getElementById('weather-page');
    const query = await fetch(`http://api.weatherapi.com/v1/current.json?key=e3b792acc4dc4d7593b232955232802&q=${searchTerm}`, {mode: 'cors'})
    const data = await query.json();
    console.log(data);
    parseWeather(data);
  }

  const parseWeather = (data) => {
    forecast = new Forecast(data);
    console.log(forecast);
  };

  return { retrieveWeather, forecast};
})();

weather.retrieveWeather();