// axiosInstance.js
import axios from 'axios';

const axiosweather = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  // No withCredentials here
});

export default axiosweather;
