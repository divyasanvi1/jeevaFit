import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [pollensData, setPollensData] = useState(null);
  const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation not supported');
        return;
      }
    
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          try {
            // Weather data API
            const weatherResponse = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`
            );
            setWeatherData(weatherResponse.data);

            // Pollens data API (if available, or you can use a custom solution)
            const pollensResponse = await axios.get(
              `https://api.pollen.com/api/forecast/current/pollen/${latitude},${longitude}`
            );
            setPollensData(pollensResponse.data);

          } catch (err) {
            console.error(err);
            setError('Error fetching weather data');
          }
        },
        (err) => setError('Geolocation error: ' + err.message)
      );
    };

    fetchWeatherData();
  }, []);

  const renderPrecautions = () => {
    if (!weatherData) return null;

    const { weather, main, wind } = weatherData;
    const currentWeather = weather[0]?.main;

    switch (currentWeather) {
      case 'Clear':
        return <p>It’s a clear day! Drink water and enjoy the sun, but wear sunscreen.</p>;
      case 'Rain':
        return <p>It’s raining! Carry an umbrella and avoid outdoor activities.</p>;
      case 'Clouds':
        return <p>It’s cloudy. Be cautious of the wind and wear comfortable clothing.</p>;
      case 'Snow':
        return <p>It’s snowing! Bundle up and avoid staying outside for too long.</p>;
      case 'Thunderstorm':
        return <p>Thunderstorm alert! Stay indoors and avoid open fields.</p>;
      default:
        return <p>Weather data not available. Stay safe!</p>;
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather Forecast</h1>
      {error && <p className="error">{error}</p>}

      {weatherData && (
        <>
          <div className="weather-summary">
            <h2>{weatherData.name}</h2>
            <p>{weatherData.weather[0].description}</p>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>

          <div className="precautions">
            <h3>Precautions</h3>
            {renderPrecautions()}
          </div>

          {pollensData && (
            <div className="pollens">
              <h3>Pollen Levels</h3>
              <p>Pollen Level: {pollensData.pollenLevel}</p>
              <p>{pollensData.advice}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherPage;
