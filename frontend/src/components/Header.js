import React, { useState } from 'react';

const Header = ({ currentPage, setPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={() => setPage('home')}>
            <svg className="logo-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="28" fill="url(#logoGrad)"/>
              <path d="M10 40 L20 25 L28 32 L38 18 L54 40 Z" fill="rgba(255,255,255,0.3)"/>
              <path d="M10 40 L20 25 L28 32 L38 18 L54 40" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"/>
              <circle cx="38" cy="18" r="2" fill="white"/>
              <rect x="12" y="40" width="3" height="8" fill="white" opacity="0.9"/>
              <rect x="18" y="40" width="3" height="8" fill="white" opacity="0.9"/>
              <rect x="24" y="40" width="3" height="8" fill="white" opacity="0.9"/>
              <rect x="30" y="40" width="3" height="8" fill="white" opacity="0.9"/>
              <rect x="36" y="40" width="3" height="8" fill="white" opacity="0.9"/>
              <rect x="42" y="40" width="3" height="8" fill="white" opacity="0.9"/>
              <rect x="48" y="40" width="3" height="8" fill="white" opacity="0.9"/>
              <path d="M10 48 L54 48" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#00ff88', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#00d4ff', stopOpacity:1}} />
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">Voice4Farmers</span>
          </div>
          
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <a onClick={() => { setPage('home'); setMenuOpen(false); }} className={currentPage === 'home' ? 'active' : ''}>Home</a>
            <a onClick={() => { setPage('chatbot'); setMenuOpen(false); }} className={currentPage === 'chatbot' ? 'active' : ''}>AI Assistant</a>
            <a onClick={() => { setPage('weather'); setMenuOpen(false); }} className={currentPage === 'weather' ? 'active' : ''}>Weather</a>
            <a onClick={() => { setPage('calendar'); setMenuOpen(false); }} className={currentPage === 'calendar' ? 'active' : ''}>Crop Calendar</a>
            <a onClick={() => { setPage('disease'); setMenuOpen(false); }} className={currentPage === 'disease' ? 'active' : ''}>Disease Detection</a>
            <a onClick={() => { setPage('about'); setMenuOpen(false); }} className={currentPage === 'about' ? 'active' : ''}>About</a>
            <a onClick={() => { setPage('contact'); setMenuOpen(false); }} className={currentPage === 'contact' ? 'active' : ''}>Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
