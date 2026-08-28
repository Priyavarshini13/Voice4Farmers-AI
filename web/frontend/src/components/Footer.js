import React from 'react';

const Footer = ({ setPage }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Voice4Farmers</h3>
            <p>Empowering farmers with AI-powered agricultural guidance and real-time information.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={() => setPage('home')}>Home</a></li>
              <li><a onClick={() => setPage('about')}>About Us</a></li>
              <li><a onClick={() => setPage('contact')}>Contact</a></li>
              <li><a onClick={() => setPage('terms')}>Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li><a onClick={() => setPage('chatbot')}>AI Assistant</a></li>
              <li><a onClick={() => setPage('weather')}>Weather Forecast</a></li>
              <li><a onClick={() => setPage('calendar')}>Crop Calendar</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📧 support@voice4farmers.com</p>
            <p>📞 +91 1800-XXX-XXXX</p>
            <p>📍 Agricultural Innovation Hub, India</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Voice4Farmers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
