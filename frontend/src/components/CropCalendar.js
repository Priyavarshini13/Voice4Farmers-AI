import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CropCalendar = () => {
  const [selectedCrop, setSelectedCrop] = useState('paddy');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const cropRef = useRef(null);
  const langRef = useRef(null);

  const crops = [
    { value: 'paddy', label: '🌾 Paddy (Rice)' },
    { value: 'tomato', label: '🍅 Tomato' },
    { value: 'cotton', label: '🌱 Cotton' }
  ];

  const languages = [
    { value: 'english', label: '🇬🇧 English' },
    { value: 'tamil', label: '🇮🇳 தமிழ் (Tamil)' },
    { value: 'hindi', label: '🇮🇳 हिंदी (Hindi)' }
  ];

  useEffect(() => {
    fetchCropData();
  }, [selectedCrop, selectedLanguage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cropRef.current && !cropRef.current.contains(event.target)) setCropOpen(false);
      if (langRef.current && !langRef.current.contains(event.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCropData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://99td69uifb.execute-api.ap-south-1.amazonaws.com/prod/crop-calendar?crop=${selectedCrop}&language=${selectedLanguage}`
      );
      setCropData(response.data.stages || []);
    } catch (error) {
      console.error('Error fetching crop data:', error);
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>📅 Crop Calendar</h1>
          <p>Stage-wise crop management guidance in your language</p>
        </div>

        <div className="crop-controls">
          <div className="control-group" ref={cropRef}>
            <label>🌾 Select Crop:</label>
            <div className="custom-dropdown" onClick={() => setCropOpen(!cropOpen)}>
              <div className="dropdown-selected">
                {crops.find(c => c.value === selectedCrop)?.label}
              </div>
              {cropOpen && (
                <div className="dropdown-options">
                  {crops.map(crop => (
                    <div
                      key={crop.value}
                      className={`dropdown-option ${selectedCrop === crop.value ? 'active' : ''}`}
                      onClick={() => { setSelectedCrop(crop.value); setCropOpen(false); }}
                    >
                      {crop.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="control-group" ref={langRef}>
            <label>🌐 Language:</label>
            <div className="custom-dropdown" onClick={() => setLangOpen(!langOpen)}>
              <div className="dropdown-selected">
                {languages.find(l => l.value === selectedLanguage)?.label}
              </div>
              {langOpen && (
                <div className="dropdown-options">
                  {languages.map(lang => (
                    <div
                      key={lang.value}
                      className={`dropdown-option ${selectedLanguage === lang.value ? 'active' : ''}`}
                      onClick={() => { setSelectedLanguage(lang.value); setLangOpen(false); }}
                    >
                      {lang.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading crop calendar...</div>
        ) : (
          <div className="timeline">
            {cropData.map((stage, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-marker">{idx + 1}</div>
                <div className="timeline-content">
                  <div className="timeline-week">{stage.week}</div>
                  <h3>{stage.stage}</h3>
                  <p>{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropCalendar;
