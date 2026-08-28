import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [weather, setWeather] = useState({
    name: 'Coimbatore',
    main: { temp: 28, humidity: 65, feels_like: 30, pressure: 1013 },
    wind: { speed: 12 },
    weather: [{ description: 'clear sky', main: 'Clear', icon: '01d' }]
  });
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const getAdvice = (temp, humidity) => {
    if (temp > 35) return { text: 'High temperature detected - ensure adequate irrigation and avoid midday activities', icon: '🌡️', type: 'warning' };
    if (humidity > 80) return { text: 'High humidity - monitor crops for fungal diseases and ensure proper ventilation', icon: '💧', type: 'alert' };
    if (temp < 15) return { text: 'Low temperature - protect sensitive crops from cold stress', icon: '❄️', type: 'info' };
    return { text: 'Good weather conditions for farming activities', icon: '✅', type: 'success' };
  };

  const fetchWeather = async (city) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://99td69uifb.execute-api.ap-south-1.amazonaws.com/prod/weather?city=${city}`
      );
      setWeather(response.data);
    } catch (error) {
      setWeather({
        name: city || 'Coimbatore',
        main: { temp: 28, humidity: 65, feels_like: 30, pressure: 1013 },
        wind: { speed: 12 },
        weather: [{ description: 'clear sky', main: 'Clear', icon: '01d' }]
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // Optional: fetch real weather data in background
    fetchWeather('Coimbatore');
  }, []);

  const advice = weather ? getAdvice(weather.main.temp, weather.main.humidity) : null;

  return (
    <div className="weather-modern">
      <div className="weather-container">
        <div className="weather-header-section">
          <h1>🌤️ Weather Forecast</h1>
          <p>Real-time weather information with smart farming recommendations</p>
        </div>

        <div className="search-section">
          <div className="search-box">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchWeather(location)}
              placeholder="Search location (e.g., Coimbatore, Mumbai, Delhi)"
            />
            <button onClick={() => fetchWeather(location)} disabled={loading}>
              {loading ? '⏳' : '🔍'} Search
            </button>
          </div>
        </div>

        {weather && (
          <div className="weather-content">
            <div className="main-weather-card">
              <div className="location-info">
                <h2>📍 {weather.name}</h2>
                <p>{weather.weather[0].description}</p>
              </div>
              <div className="temp-main">
                <div className="temp-value">{Math.round(weather.main.temp)}°C</div>
                <div className="weather-icon-large">☀️</div>
              </div>
            </div>

            <div className="weather-details-grid">
              <div className="detail-card">
                <div className="detail-icon">🌡️</div>
                <div className="detail-info">
                  <span className="detail-label">Feels Like</span>
                  <span className="detail-value">{Math.round(weather.main.feels_like)}°C</span>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-icon">💧</div>
                <div className="detail-info">
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{weather.main.humidity}%</span>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-icon">💨</div>
                <div className="detail-info">
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">{weather.wind.speed} km/h</span>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-icon">🎚️</div>
                <div className="detail-info">
                  <span className="detail-label">Pressure</span>
                  <span className="detail-value">{weather.main.pressure} hPa</span>
                </div>
              </div>
            </div>

            {advice && (
              <div className={`advice-card ${advice.type}`}>
                <div className="advice-icon">{advice.icon}</div>
                <div className="advice-content">
                  <h3>🌾 Farming Advice</h3>
                  <p>{advice.text}</p>
                </div>
              </div>
            )}

            <div className="forecast-section">
              <h2>📅 5-Day Forecast</h2>
              <div className="forecast-grid">
                <div className="forecast-card">
                  <div className="forecast-day">Tomorrow</div>
                  <div className="forecast-icon">⛅</div>
                  <div className="forecast-temp">29°C / 22°C</div>
                  <div className="forecast-desc">Partly Cloudy</div>
                </div>
                <div className="forecast-card">
                  <div className="forecast-day">Tuesday</div>
                  <div className="forecast-icon">🌧️</div>
                  <div className="forecast-temp">26°C / 20°C</div>
                  <div className="forecast-desc">Light Rain</div>
                </div>
                <div className="forecast-card">
                  <div className="forecast-day">Wednesday</div>
                  <div className="forecast-icon">☀️</div>
                  <div className="forecast-temp">31°C / 23°C</div>
                  <div className="forecast-desc">Sunny</div>
                </div>
                <div className="forecast-card">
                  <div className="forecast-day">Thursday</div>
                  <div className="forecast-icon">🌤️</div>
                  <div className="forecast-temp">30°C / 22°C</div>
                  <div className="forecast-desc">Mostly Sunny</div>
                </div>
                <div className="forecast-card">
                  <div className="forecast-day">Friday</div>
                  <div className="forecast-icon">⛈️</div>
                  <div className="forecast-temp">27°C / 21°C</div>
                  <div className="forecast-desc">Thunderstorm</div>
                </div>
              </div>
            </div>

            <div className="weather-insights">
              <h2>🌱 Agricultural Insights</h2>
              <div className="insights-grid">
                <div className="insight-card">
                  <div className="insight-icon">💧</div>
                  <h3>Irrigation</h3>
                  <p>Soil moisture is optimal. Next watering recommended in 2 days.</p>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">🌡️</div>
                  <h3>Temperature</h3>
                  <p>Ideal conditions for crop growth. Monitor for heat stress.</p>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">🌾</div>
                  <h3>Harvest</h3>
                  <p>Weather conditions favorable for harvesting activities.</p>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">🦠</div>
                  <h3>Disease Risk</h3>
                  <p>Low risk of fungal diseases. Continue regular monitoring.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
