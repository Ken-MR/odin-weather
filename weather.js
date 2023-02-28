const weather = (() => {
  const retrieveWeather = async () => {
    // let searchTerm = `${search.value}`;
    let searchTerm;
    if (!searchTerm) {
      searchTerm = 'New York';
    }
    const weatherPage = document.getElementById('weather-page');
    const query = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&APPID=55ef89a82f7996b6a371e494df3d95f8
    `, {mode: 'cors'})
    const data = await query.json();
    console.log(data);
  }
  return { retrieveWeather };
})();

weather.retrieveWeather();