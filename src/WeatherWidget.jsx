import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [city, setCity] = useState(() => localStorage.getItem('weatherCity') || 'London'); // Default city is London
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCityInputModal, setShowCityInputModal] = useState(!city); // Show modal if no city is set
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
      setError(`Could not find coordinates for "${cityName}". Please try a more specific name.`);
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
          temp: `${Math.round(data.daily.temperature_2m_max[index])}°C / ${Math.round(data.daily.temperature_2m_min[index])}°C`,
        }));

        setWeatherData({ city: targetCity, forecast: dailyForecast });
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
      fetchWeatherData(city);
    } else {
      // If no city is set, show the modal to prompt for input
      setShowCityInputModal(true);
    }
  }, [city]); // Re-fetch when city changes

  const handleWidgetClick = () => {
    setShowCityInputModal(true);
    setCurrentCityInput(city); // Pre-fill modal input with current city
  };

  const handleCityInputSubmit = (e) => {
    e.preventDefault();
    if (currentCityInput.trim()) {
      setCity(currentCityInput.trim()); // This will trigger useEffect to fetch weather
      setShowCityInputModal(false);
    } else {
      setError('City name cannot be empty.');
    }
  };

  const handleCityInputCancel = () => {
    setShowCityInputModal(false);
    // If no city was set initially, and user cancels, we might want to show an error or default state
    if (!city) {
      setError('Please set a city for weather updates.');
    }
  };

  if (showCityInputModal) {
    return (
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
            <div className="modal-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={handleCityInputCancel}>Cancel</button>
            </div>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="weather-widget" onClick={handleWidgetClick}>Loading weather...</div>;
  }

  if (error) {
    return (
      <div className="weather-widget" onClick={handleWidgetClick}>
        <p>Error: {error}</p>
        <button onClick={handleWidgetClick}>Set City</button>
      </div>
    );
  }

  if (!weatherData) {
    return <div className="weather-widget" onClick={handleWidgetClick}>Click to set city for weather.</div>;
  }

  return (
    <div className="weather-widget" onClick={handleWidgetClick}>
      <div className="weather-header">
        <span className="weather-title">Weather</span>
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
    </div>
  );
};

export default WeatherWidget;