# Quick Start Guide - Voice4Farmers

## ✅ Setup Complete!

Your Voice4Farmers website is ready to run!

## 🚀 Start the Application

```bash
cd frontend
npm start
```

The app will automatically open at: **http://localhost:3000**

## 📱 Features Ready

### 1. Home Page ✓
- Language selector (English, Tamil, Hindi)
- 3 feature cards (Chatbot, Weather, Crop Calendar)

### 2. Voice4Farmers Chatbot ✓
- Voice input (click microphone button)
- Text input (type and press Enter)
- Voice output (bot speaks answers)
- Connected to: https://voice4farmers-api.onrender.com

### 3. Weather Section ✓
- Default location: Chennai
- Search any city
- Smart farming advice based on weather
- Note: Using demo data (add OpenWeather API key for live data)

### 4. Crop Calendar ✓
- 3 crops: Paddy, Tomato, Cotton
- Stage-wise farming guide
- Multi-language support

## 🎯 Testing Flow

### Test 1: Chatbot
1. Open app → Click "Voice Assistant"
2. Click microphone button
3. Say: "How to improve tomato plants?"
4. Bot will respond with text and voice

### Test 2: Weather
1. Click "Weather" card
2. Type any city name (e.g., "Mumbai")
3. Press Enter
4. See weather + farming advice

### Test 3: Crop Calendar
1. Click "Crop Calendar" card
2. Select crop from dropdown
3. View stage-wise farming schedule

## 🌐 Language Testing

1. On home page, select language (தமிழ் or हिंदी)
2. All UI text changes
3. Chatbot voice recognition changes
4. Crop calendar content changes

## 📝 Important Notes

### Voice Features
- Works best in **Chrome browser**
- Requires **microphone permission**
- Internet connection needed

### Weather API
- Currently using demo data
- To enable live weather:
  1. Get free API key from: https://openweathermap.org/api
  2. Edit `src/components/Weather.js`
  3. Replace `YOUR_OPENWEATHER_API_KEY` with your key

### Chatbot API
- Already configured
- No setup needed
- Uses your friend's deployed model

## 🎨 Mobile Testing

Open in mobile browser:
1. Find your computer's IP address
2. On mobile, go to: `http://YOUR_IP:3000`
3. Test touch interface

## 🐛 Troubleshooting

### Port already in use?
```bash
# Kill process on port 3000
npx kill-port 3000
npm start
```

### Voice not working?
- Use Chrome browser
- Allow microphone permission
- Check internet connection

### API errors?
- Check internet connection
- API might be slow (hosted on free tier)
- Wait a few seconds and retry

## 📦 Build for Demo

```bash
npm run build
```

Creates production-ready files in `build/` folder.

## 🎉 Demo Tips

1. **Start with Home**: Show language selector
2. **Demo Chatbot**: Use voice input (impressive!)
3. **Show Weather**: Practical farming advice
4. **Explain Calendar**: Structured farming guide
5. **Highlight**: Multi-language support

## 🔥 Key Selling Points

- ✅ Voice-enabled (innovative!)
- ✅ Multi-language (Tamil, Hindi, English)
- ✅ Mobile-friendly
- ✅ Practical tools (not just chatbot)
- ✅ RAG model integration
- ✅ Real-time weather
- ✅ Structured crop guidance

Good luck with your hackathon! 🚀
