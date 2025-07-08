import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [city, setCity] = useState(() => localStorage.getItem('weatherCity') || 'London'); // Default city is London
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCityInputModal, setShowCityInputModal] = useState(() => !city);
  const [currentCityInput, setCurrentCityInput] = useState(city);

  // Helper to map Open-Meteo weather codes to emojis
  const getWeatherEmoji = (weatherCode) => {
    // Based on Open-Meteo WMO Weather interpretation codes (WWMO)
    if (weatherCode === 0) return '☀️'; // Clear sky
    if (weatherCode > 0 && weatherCode < 3) return '🌤️'; // Mainly clear, partly cloudy
    if (weatherCode === 3) return '☁️'; // Overcast
    if (weatherCode >= 45 && weatherCode <= 48) return '🌫️'; // Fog and depositing fog
    if (weatherCode >= 51 && weatherCode <= 55) return '🌧️'; // Drizzle
    if (weatherCode >= 56 && weatherCode <= 57) return '🌧️'; // Freezing Drizzle
    if (weatherCode >= 61 && weatherCode <= 65) return '🌧️'; // Rain
    if (weatherCode >= 66 && weatherCode <= 67) return '🌧️'; // Freezing Rain
    if (weatherCode >= 71 && weatherCode <= 75) return '❄️'; // Snow fall
    if (weatherCode === 77) return '❄️'; // Snow grains
    if (weatherCode >= 80 && weatherCode <= 82) return '⛈️'; // Rain showers
    if (weatherCode >= 85 && weatherCode <= 86) return '❄️'; // Snow showers
    if (weatherCode >= 95 && weatherCode <= 96) return '⛈️'; // Thunderstorm
    if (weatherCode === 99) return '⛈️'; // Thunderstorm with hail
    return '❓';
  };

  const getDayName = (dateString, index) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (date.toDateString() === dayAfterTomorrow.toDateString()) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  };

  // New function to fetch coordinates using Nominatim
  const fetchCoordinates = async (cityName) => {
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'NewTabExtension/1.0 (your-email@example.com)' // Required by Nominatim
        }
      });
      const data = await response.json();

      if (response.ok && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      } else {
        throw new Error('City not found or geocoding error.');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      console.error(`Could not find coordinates for "${cityName}". Please try a more specific name.`);
      setError('Network error or invalid location.');
      return null;
    }
  };

  const fetchWeatherData = async (targetCity) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const coords = await fetchCoordinates(targetCity);
      if (!coords) {
        setLoading(false);
        return; // Error already set by fetchCoordinates
      }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto&forecast_days=3`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const dailyForecast = data.daily.time.map((dateString, index) => ({
          day: getDayName(dateString, index),
          icon: getWeatherEmoji(data.daily.weather_code[index]),
          temp: `${Math.round(data.daily.temperature_2m_max[index])}°C/${Math.round(data.daily.temperature_2m_min[index])}°C`,
        }));

        const newWeatherData = { city: targetCity, forecast: dailyForecast, timestamp: new Date().getTime() };
        setWeatherData(newWeatherData);
        localStorage.setItem('weatherData', JSON.stringify(newWeatherData));
        localStorage.setItem('weatherCity', targetCity); // Save successful city to localStorage
      } else {
        setError(data.reason || 'Failed to fetch weather data.');
      }
    } catch (err) {
      setError('Network error or invalid location.');
      console.error('Weather fetch error:', err, targetCity);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      const cachedData = localStorage.getItem('weatherData');
      if (cachedData) {
        const { city: cachedCity, timestamp, ...rest } = JSON.parse(cachedData);
        const now = new Date().getTime();
        // Cache is valid for 1 hour
        if (cachedCity === city && (now - timestamp) < 3600000) {
          setWeatherData({ city: cachedCity, ...rest });
          return;
        }
      }
      fetchWeatherData(city);
      }
  }, [city]);

  const handleWidgetClick = () => {
    console.log('handleWidgetClick: Opening modal');
    setShowCityInputModal(true);
    setCurrentCityInput(city); // Pre-fill modal input with current city
  };

  const handleCityInputSubmit = (e) => {
    e.preventDefault();
    console.log('handleCityInputSubmit: Attempting to save city', currentCityInput);
    if (currentCityInput.trim()) {
      setCity(currentCityInput.trim()); // This will trigger useEffect to fetch weather
      setShowCityInputModal(false);
      console.log('handleCityInputSubmit: City saved, modal closed');
    } else {
      setError('City name cannot be empty.');
      console.log('handleCityInputSubmit: City name empty');
    }
  };

  const handleCityInputCancel = (e) => {
    e.stopPropagation(); // Stop event bubbling
    console.log('handleCityInputCancel: Closing modal');
    setShowCityInputModal(false);
  };

  

  let widgetContent;

  if (loading) {
    widgetContent = <div>Loading weather...</div>;
  } else if (error) {
    widgetContent = (
      <>
        <p>Error: {error}</p>
        <button onClick={handleWidgetClick}>Set City</button>
      </>
    );
  } else if (!weatherData) {
    widgetContent = <div>Click to set city for weather.</div>;
  } else {
    widgetContent = (
      <>
        <div className="weather-header">
          <span className="weather-title">Weather</span>
          <svg width="22" height="22" style={{verticalAlign:"middle",opacity:0.7}} viewBox="0 0 24 24"><path fill="#3a8dde" d="M6 19a7 7 0 1 1 12.9-4.1A5 5 0 1 1 18 19H6z"/></svg>
          <span className="weather-city">{weatherData.city}</span>
        </div>
        <div className="weather-forecast">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="forecast-day">
              <span className="day-name">{day.day}</span>
              <span className="day-icon">{day.icon}</span>
              <span className="day-temp">{day.temp}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="weather-widget" onClick={handleWidgetClick}>
        {widgetContent}
      </div>
      {showCityInputModal && ReactDOM.createPortal(
        <div className="weather-widget-modal-overlay">
          <div className="weather-widget-modal-content">
            <h3>Set City for Weather</h3>
            <form onSubmit={handleCityInputSubmit}>
              <input
                type="text"
                value={currentCityInput}
                onChange={(e) => setCurrentCityInput(e.target.value)}
                placeholder="Enter city name"
                autoFocus
              />
              <div className="weather-widget-modal-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={(e) => handleCityInputCancel(e)}>Cancel</button>
              </div>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>,
        document.getElementById('modal-root')
      )}
    </>
  );
};

export default WeatherWidget;