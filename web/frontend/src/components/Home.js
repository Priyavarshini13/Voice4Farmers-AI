import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = ({ setPage }) => {
  const [weather, setWeather] = useState(null);

  const marketData = [
    { crop: 'Rice', price: '2,850', icon: '🌾', trend: 'up' },
    { crop: 'Tomato', price: '35', icon: '🍅', trend: 'up' },
    { crop: 'Cotton', price: '8,450', icon: '🌱', trend: 'up' },
    { crop: 'Wheat', price: '2,125', icon: '🌾', trend: 'down' },
    { crop: 'Onion', price: '28', icon: '🧅', trend: 'down' },
    { crop: 'Potato', price: '22', icon: '🥔', trend: 'up' },
    { crop: 'Corn', price: '1,850', icon: '🌽', trend: 'up' },
    { crop: 'Carrot', price: '45', icon: '🥕', trend: 'up' }
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://99td69uifb.execute-api.ap-south-1.amazonaws.com/prod/weather?city=Coimbatore`
        );
        setWeather(response.data);
      } catch (error) {
        setWeather({
          name: 'Coimbatore',
          main: { temp: 26, humidity: 70, feels_like: 28 },
          wind: { speed: 10 },
          weather: [{ description: 'partly cloudy', main: 'Clouds' }]
        });
      }
    };
    fetchWeather();
  }, []);

  const getWeatherEmoji = (weatherMain) => {
    const weatherMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return weatherMap[weatherMain] || '🌤️';
  };

  return (
    <div className="home-hero">
      <div className="hero-container">
        <div className="hero-main">
          <h1 className="hero-title">
            <span className="gradient-text">Voice4Farmers</span>
            <br />Smart Agriculture Platform
          </h1>
          <p className="hero-subtitle">AI-Powered Farming Assistant with Real-Time Weather & Market Intelligence</p>
          
          <div className="quick-actions">
            <button className="action-btn primary" onClick={() => setPage('chatbot')}>
              <span className="btn-icon">🤖</span>
              <div>
                <h3>AI Assistant</h3>
                <p>Ask farming questions</p>
              </div>
            </button>
            <button className="action-btn secondary" onClick={() => setPage('weather')}>
              <span className="btn-icon">🌤️</span>
              <div>
                <h3>Weather</h3>
                <p>Live forecast</p>
              </div>
            </button>
            <button className="action-btn tertiary" onClick={() => setPage('calendar')}>
              <span className="btn-icon">📅</span>
              <div>
                <h3>Crop Calendar</h3>
                <p>Stage guidance</p>
              </div>
            </button>
          </div>
        </div>

        <div className="hero-sidebar">
          {weather && (
            <div className="weather-mini-card">
              <div className="weather-mini-header">
                <h4>{getWeatherEmoji(weather.weather[0].main)} Weather Now</h4>
                <span className="pulse-dot"></span>
              </div>
              <div className="weather-mini-body">
                <div className="temp-display-mini">{Math.round(weather.main.temp)}°C</div>
                <p>{weather.name}</p>
                <div className="weather-mini-stats">
                  <span>💧 {weather.main.humidity}%</span>
                  <span>💨 {weather.wind.speed} km/h</span>
                </div>
              </div>
            </div>
          )}

          <div className="market-mini-card">
            <h4>📊 Market Trends</h4>
            <div className="market-scroll-list">
              {marketData.map((item, idx) => (
                <div key={idx} className="market-mini-item">
                  <span>{item.icon} {item.crop}</span>
                  <span className={item.trend === 'up' ? 'price-up' : 'price-down'}>
                    ₹{item.price} {item.trend === 'up' ? '▲' : '▼'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
