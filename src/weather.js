export let forecast;

export const weather = (() => {
  //let forecast;

  class Forecast {
    constructor(weatherData) {
      this.location = [weatherData.location.name, weatherData.location.region, weatherData.location.country];
      this.weather = weatherData.current.condition.text;
      this.icon = weatherData.current.condition.icon;
      this.tempF = weatherData.current.temp_f;
      this.tempC = weatherData.current.temp_c;
      this.time = weatherData.location.localtime;
  
      this.feelsLikeF = weatherData.current.feelslike_f;
      this.feelsLikeC = weatherData.current.feelslike_c;
      this.rainChance = weatherData.forecast.forecastday[0].day.daily_chance_of_rain;
      this.sunRise = weatherData.forecast.forecastday[0].astro.sunrise;
      this.sunSet = weatherData.forecast.forecastday[0].astro.sunset;
      this.moonPhase = weatherData.forecast.forecastday[0].astro.moon_phase;
      this.humid = weatherData.current.humidity;
      this.wind = [weatherData.current.wind_mph, weatherData.current.wind_kph, weatherData.current.wind_dir];

      this.dailyForecast = [];
      for (let i = 1; i < weatherData.forecast.forecastday.length; i++) {
        this.dailyForecast.push({
          'sunRise': weatherData.forecast.forecastday[i].astro.sunrise,
          'sunSet': weatherData.forecast.forecastday[i].astro.sunset,
          'moonPhase': weatherData.forecast.forecastday[i].astro.moon_phase,
  
          'tempC': weatherData.forecast.forecastday[i].day.avgtemp_c,
          'tempF': weatherData.forecast.forecastday[i].day.avgtemp_f,
          'date': weatherData.forecast.forecastday[i].date,
          'weatherType': weatherData.forecast.forecastday[i].day.condition.icon
        });
      }

      let currentHour = parseInt(weatherData.location.localtime.substr(11,2));
      let dayTracker = 0;
      this.hourlyForecast = [];
      for (let i = 0; i < 24; i++) {
        if (currentHour >= 24) {
          currentHour = 0;
          dayTracker++;
        }
        this.hourlyForecast.push({
          'time': weatherData.forecast.forecastday[dayTracker].hour[currentHour].time,
          'tempC': weatherData.forecast.forecastday[dayTracker].hour[currentHour].temp_c,
          'tempF': weatherData.forecast.forecastday[dayTracker].hour[currentHour].temp_f,
          'weatherType': weatherData.forecast.forecastday[dayTracker].hour[currentHour].condition.icon
        });
        currentHour++;
      }
    }
  }

  let searchTerm;
  const retrieveWeather = async () => {
    try {
      if (!searchTerm) {
        searchTerm = 'New York';
      }
      else {
        searchTerm = search.value;
      }
      const query = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=e3b792acc4dc4d7593b232955232802&q=${searchTerm}&days=8&aqi=no&alerts=no
      `, {mode: 'cors'});
      const data = await query.json();
      console.log(data);
      parseWeather(data);
    } 
    catch (err) {
      alert('Invalid location entered!');
    }
  }

  const parseWeather = (data) => {
    forecast = new Forecast(data);
    console.log(forecast);
  };

  return { retrieveWeather };
})();