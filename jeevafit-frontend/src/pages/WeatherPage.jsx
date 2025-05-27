import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosweather';
import { useTranslation } from 'react-i18next';


const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [pollensData, setPollensData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      if (!navigator.geolocation) {
        setError(t('weatherPage.error.geolocationUnsupported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          const [weatherRes, airRes, uvRes, forecastRes] = await Promise.all([
            axios.get(`/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`),
            axios.get(`/air_pollution?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`),
            axios.get(`/uvi?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`),
            axios.get(`/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`)
          ]);

          setWeatherData(weatherRes.data);
          setAirQualityData(airRes.data);
          setUvIndex(uvRes.data.value);
          setForecastData(forecastRes.data);

          // Optional: Replace with a real pollen API if available
          setPollensData({
            pollenLevel: 'High',
            advice: 'Avoid outdoor activities and use masks if allergic.'
          });

        } catch (err) {
          console.error(err);
          setError(t('weatherPage.error.fetchFailed'));
        }
      }, (err) => {
        setError('Geolocation error: ' + err.message);
      });
    };

    fetchData();
  }, []);

  const renderPrecautions = () => {
    const currentWeather = weatherData?.weather?.[0]?.main;
    const key = `weatherPage.precautions.${currentWeather || 'Default'}`;
    return <p>{t(key)}</p>;
  };

  const renderTemperatureTrend = () => {
    if (!forecastData) return null;
    const next6Hours = forecastData.list.slice(0, 6);
    return (
      <div>
        <h4 className="font-semibold">📈 Temperature Trend</h4>
        <ul>
          {next6Hours.map((hour, idx) => (
            <li key={idx}>
              {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:
              {` ${hour.main.temp}°C`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="px-4 py-6 min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
  <div className="max-w-3xl mx-auto space-y-6">
    <h1 className="text-3xl font-extrabold text-center text-blue-900 drop-shadow-md">
      🌤️ {t('weatherPage.title')}
    </h1>

    {error && <p className="text-red-700 text-center">{error}</p>}

    {weatherData && (
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 transition-all duration-300">
        {/* Location + Summary */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-blue-800">{weatherData.name}</h2>
            <p className="capitalize text-gray-600 text-sm">{weatherData.weather[0].description}</p>
          </div>
          <div className="text-xl font-medium text-gray-700 mt-2 sm:mt-0">
            🌡️ {weatherData.main.temp}°C
          </div>
        </div>

        {/* Basic Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="bg-blue-50 p-3 rounded-lg shadow-inner">
            💧 {t('weatherPage.weather.humidity')}: {weatherData.main.humidity}%
          </div>
          <div className="bg-blue-50 p-3 rounded-lg shadow-inner">
            🌬️ {t('weatherPage.weather.wind')}: {weatherData.wind.speed} m/s
          </div>
          <div className="bg-blue-50 p-3 rounded-lg shadow-inner">
            🧭 {t('weatherPage.weather.pressure')}: {weatherData.main.pressure} hPa
          </div>
        </div>

        {/* Precautions */}
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-xl">
          <h3 className="font-semibold text-yellow-800 mb-1">⚠️ {t('weatherPage.precautions.title')}</h3>
          {renderPrecautions()}
        </div>

        {/* Pollen Data */}
        {pollensData && (
          <div className="bg-green-100 border-l-4 border-green-400 p-4 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-1">🌾 {t('weatherPage.pollen')}</h3>
            <p className="text-sm">{t('weatherPage.level')}: {pollensData.pollenLevel}</p>
            <p className="text-sm">{pollensData.advice}</p>
          </div>
        )}

        {/* Air Quality */}
        {airQualityData && (
          <div className="bg-slate-100 border-l-4 border-slate-400 p-4 rounded-xl">
            <h3 className="font-semibold text-slate-800 mb-1">🌫️ {t('weatherPage.airQuality')}</h3>
            <div className="text-sm space-y-1">
              <p>PM2.5: {airQualityData.list[0].components.pm2_5}</p>
              <p>CO: {airQualityData.list[0].components.co}</p>
              <p>O₃: {airQualityData.list[0].components.o3}</p>
            </div>
          </div>
        )}

        {/* UV Index */}
        {uvIndex !== null && (
          <div className="bg-pink-100 border-l-4 border-pink-400 p-4 rounded-xl">
            <h3 className="font-semibold text-pink-800 mb-1">🌞 {t('weatherPage.uvIndex')}</h3>
            <p className="text-sm">
              {uvIndex} {uvIndex >= 6 ? t('weatherPage.uvHigh') : t('weatherPage.uvModerate')}
            </p>
          </div>
        )}

        {/* Temperature Trends */}
        {/* Temperature Trends */}
{/* Temperature Trends */}
{/* Temperature Trends */}
<div className="bg-purple-100 border-l-4 border-purple-400 p-4 rounded-xl mb-4">
  <h3 className="font-semibold text-purple-800 mb-3 text-sm md:text-base">📈 {t('weatherPage.trend')}</h3>
  
  <div className="flex overflow-x-auto gap-3 pb-1">
    {forecastData?.list.slice(0, 6).map((hour, idx) => (
      <div
        key={idx}
        className="min-w-[140px] flex flex-col justify-between bg-white rounded-lg px-3 py-2 shadow text-xs md:text-sm shrink-0"
      >
        <span className="text-gray-600">{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="font-medium text-purple-700">{hour.main.temp}°C</span>
      </div>
    ))}
  </div>
</div>


      </div>
    )}
  </div>
</div>

  );
};

export default WeatherPage;
