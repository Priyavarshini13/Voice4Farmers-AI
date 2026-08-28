import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Chatbot from './components/Chatbot';
import Weather from './components/Weather';
import CropCalendar from './components/CropCalendar';
import About from './components/About';
import Contact from './components/Contact';
import Terms from './components/Terms';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home setPage={setCurrentPage} />;
      case 'chatbot': return <Chatbot />;
      case 'weather': return <Weather />;
      case 'calendar': return <CropCalendar />;
      case 'about': return <About />;
      case 'contact': return <Contact />;
      case 'terms': return <Terms />;
      default: return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} setPage={setCurrentPage} />
      <main className="main-content">{renderPage()}</main>
      <Footer setPage={setCurrentPage} />
    </div>
  );
}

export default App;
