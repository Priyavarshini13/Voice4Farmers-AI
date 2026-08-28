import React from 'react';

const About = () => {
  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>About Voice4Farmers</h1>
          <p>Revolutionizing agriculture through AI and technology</p>
        </div>

        <div className="content-section">
          <h2>Our Mission</h2>
          <p>Voice4Farmers is dedicated to empowering farmers with cutting-edge AI technology and real-time agricultural information. We believe that every farmer deserves access to expert farming knowledge, regardless of language barriers or geographical location.</p>
        </div>

        <div className="content-section">
          <h2>What We Do</h2>
          <div className="two-column">
            <div>
              <h3>🎯 AI-Powered Guidance</h3>
              <p>Our advanced RAG model provides accurate, context-aware answers to farming questions in Tamil, Hindi, and English.</p>
            </div>
            <div>
              <h3>🌍 Real-Time Information</h3>
              <p>Access up-to-date weather forecasts and farming recommendations tailored to your location and conditions.</p>
            </div>
            <div>
              <h3>📚 Comprehensive Resources</h3>
              <p>Stage-wise crop calendars and best practices for various crops to maximize yield and minimize risks.</p>
            </div>
            <div>
              <h3>🗣️ Voice-Enabled</h3>
              <p>Speak naturally in your preferred language and get instant voice responses - no typing required.</p>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Our Vision</h2>
          <p>We envision a future where every farmer has instant access to expert agricultural knowledge, enabling sustainable farming practices and improved livelihoods across rural communities.</p>
        </div>

        <div className="content-section">
          <h2>Why Choose Us</h2>
          <ul className="feature-list">
            <li>✓ Multi-language support (Tamil, Hindi, English)</li>
            <li>✓ Voice-enabled for easy accessibility</li>
            <li>✓ AI-powered accurate responses</li>
            <li>✓ Real-time weather integration</li>
            <li>✓ Free for all farmers</li>
            <li>✓ Mobile-friendly design</li>
            <li>✓ 24/7 availability</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
