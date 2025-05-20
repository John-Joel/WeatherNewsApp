// src/services/WeatherService.ts
import axios from 'axios';

const OPEN_WEATHER_MAP_API_KEY = '246e2c9176737257d7920cd8b5a8800b';

// Fetch 5-day forecast data for given coordinates and units (metric/imperial)
export const getWeatherForecast = (lat: number, lon: number, units: string) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${OPEN_WEATHER_MAP_API_KEY}`;
  return axios.get(url);
};
