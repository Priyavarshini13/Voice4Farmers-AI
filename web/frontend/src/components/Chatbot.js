import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { translateText } from '../services/translationService';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionId] = useState(Date.now().toString());
  const [recognition, setRecognition] = useState(null);
  const [language, setLanguage] = useState('en');
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      
      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recog.onerror = () => setIsListening(false);
      recog.onend = () => setIsListening(false);
      
      setRecognition(recog);
    }
  }, [language]);

  const speak = async (text) => {
    console.log('Attempting to speak:', text.substring(0, 50));
    
    // Use ElevenLabs for Tamil only
    if (language === 'ta') {
      console.log('Using ElevenLabs for Tamil');
      try {
        const shortText = text.length > 500 ? text.substring(0, 500) + '...' : text;
        
        const response = await axios.post(
          'https://api.elevenlabs.io/v1/text-to-speech/pqHfZKP75CvOlQylNhV4',  // Tamil voice ID
          {
            text: shortText,
            model_id: 'eleven_multilingual_v2',  // Multilingual model for Tamil
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          },
          {
            headers: {
              'Accept': 'audio/mpeg',
              'xi-api-key': process.env.REACT_APP_ELEVENLABS_API_KEY,
              'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer'
          }
        );
        
        const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
        };
        await audio.play();
      } catch (error) {
        console.error('ElevenLabs failed:', error);
        // Fallback to browser speech synthesis
        fallbackToSpeechSynthesis(text);
      }
      return;
    }
    
    // Use Polly for English and Hindi with fallback
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/polly`, {
        text,
        language
      });
      
      const audio = new Audio(`data:audio/mp3;base64,${response.data.audio}`);
      setCurrentAudio(audio);
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentAudio(null);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        setCurrentAudio(null);
      };
      await audio.play();
    } catch (error) {
      console.error('Polly failed:', error.message);
      // Fallback to browser speech synthesis
      fallbackToSpeechSynthesis(text);
    }
  };

  const fallbackToSpeechSynthesis = (text) => {
    console.log('Using browser speech synthesis as fallback');
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const endConversation = () => {
    setMessages([]);
    setInput('');
    window.speechSynthesis.cancel();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { type: 'user', text: input, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      console.log('Original input:', input);
      console.log('Current language:', language);
      
      const translatedInput = await translateText(input, 'en', language);
      console.log('Translated to English:', translatedInput);
      
      const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/chatbot`, {
        question: translatedInput,
        session_id: sessionId
      });
      console.log('RAG response:', response.data.answer);

      const translatedResponse = await translateText(response.data.answer, language);
      console.log('Translated response:', translatedResponse);
      
      const botMsg = { type: 'bot', text: translatedResponse, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMsg]);
      speak(translatedResponse);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = { type: 'bot', text: 'Sorry, something went wrong. Please try again.', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <div className="modern-chat">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Language</h3>
        </div>
        <button 
          className={`lang-btn-modern ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
        >
          <span className="lang-icon">🇬🇧</span>
          <span>English</span>
        </button>
        <button 
          className={`lang-btn-modern ${language === 'ta' ? 'active' : ''}`}
          onClick={() => setLanguage('ta')}
        >
          <span className="lang-icon">🇮🇳</span>
          <span>தமிழ்</span>
        </button>
        <button 
          className={`lang-btn-modern ${language === 'hi' ? 'active' : ''}`}
          onClick={() => setLanguage('hi')}
        >
          <span className="lang-icon">🇮🇳</span>
          <span>हिंदी</span>
        </button>
      </div>

      <div className="chat-content">
        <div className="chat-header-modern">
          <div className="header-info">
            <div className="bot-icon">🤖</div>
            <div>
              <h2>AI Farming Assistant</h2>
              <p>Ask me anything about farming</p>
            </div>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            {isSpeaking && (
              <button className="clear-btn" onClick={stopSpeaking}>
                <span>🔇</span> Stop
              </button>
            )}
            <button className="clear-btn" onClick={endConversation}>
              <span>🗑️</span> Clear Chat
            </button>
          </div>
        </div>

        <div className="messages-area">
          {messages.length === 0 && (
            <div className="welcome-card">
              <div className="welcome-icon">🌾</div>
              <h3>Welcome to Voice4Farmers AI</h3>
              <p>I'm here to help with all your farming questions</p>
              <div className="suggestions">
                <span>Pest control</span>
                <span>Fertilizers</span>
                <span>Crop diseases</span>
                <span>Irrigation</span>
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg-wrapper ${msg.type}`}>
              {msg.type === 'bot' && <div className="msg-avatar">🤖</div>}
              <div className="msg-bubble">
                <p>{msg.text}</p>
                <span className="msg-time">{msg.time}</span>
              </div>
              {msg.type === 'user' && <div className="msg-avatar user">👨‍🌾</div>}
            </div>
          ))}
        </div>

        <div className="input-container">
          <button 
            className={`voice-toggle ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
          >
            {isListening ? '⏹' : '🎤'}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your farming question..."
          />
          <button className="send-button" onClick={handleSend}>
            <span>Send</span> <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
