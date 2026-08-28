# Voice4Farmers - Smart Farmer Support Website

A mobile-friendly farmer support platform with voice-enabled chatbot, weather information, and crop calendar.

## Features

### 1. Voice4Farmers Chatbot
- Voice input/output in Tamil, Hindi, and English
- Integrated with RAG model API
- Session-based conversation
- Text-to-speech responses

### 2. Weather Section
- Current weather information
- Location-based search
- Smart farming advice based on conditions

### 3. Crop Calendar
- Stage-based crop guidance
- Multi-crop support (Paddy, Tomato, Cotton)
- Multi-language content

## Tech Stack

- **Frontend**: React 18
- **Styling**: CSS
- **Voice**: Web Speech API
- **API**: Axios
- **Chatbot Backend**: https://voice4farmers-api.onrender.com

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Weather API (Optional)
Edit `src/components/Weather.js` and replace `YOUR_OPENWEATHER_API_KEY` with your OpenWeather API key.

Get free API key from: https://openweathermap.org/api

### 3. Run Development Server
```bash
npm start
```

The app will open at http://localhost:3000

## Usage

1. **Select Language**: Choose Tamil, Hindi, or English on home page
2. **Voice Assistant**: Click voice button and speak your farming question
3. **Weather**: Search any location to get weather and farming advice
4. **Crop Calendar**: Select crop to see stage-wise farming guide

## API Integration

### Chatbot API
- **Endpoint**: https://voice4farmers-api.onrender.com
- **Method**: POST
- **Request**:
```json
{
  "question": "how to improve the brinjal plants",
  "session_id": "3"
}
```
- **Response**:
```json
{
  "answer": "To improve chilli crops...",
  "confidence": 0.691
}
```

## Browser Support

- Chrome (recommended for voice features)
- Edge
- Safari (limited voice support)
- Firefox (limited voice support)

## Mobile Responsive

Fully optimized for mobile devices with touch-friendly interface.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Future Enhancements

- Disease detection using camera
- Offline support
- Push notifications for weather alerts
- Community forum
- Market price information

## License

MIT
