import './style.css';
import { weather } from './weather.js';

window.onload = () => {
  document.getElementById("town-search").addEventListener("submit", () => {weather.retrieveWeather()});
};