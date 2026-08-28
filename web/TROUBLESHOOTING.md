# Voice4Farmers - Troubleshooting Guide

## 🔧 Common Issues & Solutions

---

## 1. Installation Issues

### Problem: npm install fails
**Symptoms:**
- Error messages during installation
- Missing dependencies
- Permission errors

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Problem: Port 3000 already in use
**Symptoms:**
- "Port 3000 is already in use"
- App won't start

**Solutions:**
```bash
# Option 1: Kill the process
npx kill-port 3000

# Option 2: Use different port
set PORT=3001 && npm start

# Option 3: Find and kill manually
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

---

## 2. Voice Feature Issues

### Problem: Microphone not working
**Symptoms:**
- Voice button doesn't respond
- No voice recognition
- Permission denied

**Solutions:**

**Step 1: Check Browser**
- Use Chrome (best support)
- Update to latest version
- Avoid Firefox/Safari for voice

**Step 2: Check Permissions**
1. Click lock icon in address bar
2. Check microphone permission
3. Set to "Allow"
4. Refresh page

**Step 3: Check System**
- Windows Settings → Privacy → Microphone
- Allow apps to access microphone
- Allow Chrome to access microphone

**Step 4: Test Microphone**
```javascript
// Open browser console (F12)
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('Microphone works!'))
  .catch(err => console.error('Microphone error:', err));
```

### Problem: Voice recognition not accurate
**Symptoms:**
- Wrong words recognized
- Partial recognition
- No recognition

**Solutions:**
- Speak clearly and slowly
- Reduce background noise
- Check microphone quality
- Ensure correct language selected
- Move closer to microphone

### Problem: Voice output not working
**Symptoms:**
- No audio from bot
- Silent response

**Solutions:**
- Check system volume
- Check browser volume
- Unmute tab
- Test with:
```javascript
// Browser console
speechSynthesis.speak(new SpeechSynthesisUtterance('Test'));
```

---

## 3. API Issues

### Problem: Chatbot API not responding
**Symptoms:**
- Loading forever
- No response from bot
- Error messages

**Solutions:**

**Check 1: Internet Connection**
```bash
# Test API endpoint
curl https://voice4farmers-api.onrender.com
```

**Check 2: API Status**
- API might be sleeping (free tier)
- First request takes 30-60 seconds
- Wait patiently for first response

**Check 3: Request Format**
```javascript
// Verify request in browser console (F12)
// Should see POST request to API
// Check request payload
```

**Check 4: CORS Issues**
- API should have CORS enabled
- Check browser console for CORS errors
- Contact API owner if CORS error

**Temporary Solution:**
```javascript
// Add mock response for demo
const mockResponse = {
  answer: "This is a demo response. The API is currently unavailable.",
  confidence: 0.9
};
```

### Problem: Weather API not working
**Symptoms:**
- Weather not loading
- Demo data showing

**Solutions:**

**Option 1: Use Demo Mode**
- Already configured
- Shows sample data
- Good for demo

**Option 2: Add API Key**
1. Get free key: https://openweathermap.org/api
2. Edit `src/components/Weather.js`
3. Replace `YOUR_OPENWEATHER_API_KEY`
4. Restart app

**Option 3: Check API Limit**
- Free tier: 60 calls/minute
- Check if limit exceeded
- Wait and retry

---

## 4. Display Issues

### Problem: Styling not applied
**Symptoms:**
- Plain text display
- No colors
- No layout

**Solutions:**
```bash
# Clear browser cache
Ctrl + Shift + Delete

# Hard refresh
Ctrl + Shift + R

# Restart dev server
Ctrl + C
npm start
```

### Problem: Components not rendering
**Symptoms:**
- Blank page
- Error in console
- Component not found

**Solutions:**

**Check 1: Import Paths**
```javascript
// Verify in App.js
import Home from './components/Home';
import Chatbot from './components/Chatbot';
import Weather from './components/Weather';
import CropCalendar from './components/CropCalendar';
```

**Check 2: File Names**
- Check exact file names (case-sensitive)
- Verify .js extension
- Check folder structure

**Check 3: Console Errors**
- Open browser console (F12)
- Read error messages
- Fix import/export issues

### Problem: Mobile view broken
**Symptoms:**
- Layout issues on mobile
- Text too small
- Buttons not clickable

**Solutions:**
```html
<!-- Verify in public/index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

```css
/* Check in App.css */
@media (max-width: 600px) {
  /* Mobile styles */
}
```

---

## 5. Navigation Issues

### Problem: Back button not working
**Symptoms:**
- Stuck on page
- Can't return to home

**Solutions:**

**Check 1: State Management**
```javascript
// Verify in component
<button onClick={() => setPage('home')}>Back</button>
```

**Check 2: Props Passed**
```javascript
// Verify in App.js
<Chatbot setPage={setCurrentPage} />
```

**Temporary Fix:**
- Refresh page (F5)
- Returns to home

### Problem: Language not changing
**Symptoms:**
- Language selector doesn't work
- Text stays in English

**Solutions:**

**Check 1: State Update**
```javascript
// Verify in Home.js
<select value={language} onChange={(e) => setLanguage(e.target.value)}>
```

**Check 2: Props Passed**
```javascript
// Verify in App.js
const [language, setLanguage] = useState('en');
```

**Check 3: Translation Object**
```javascript
// Verify translations exist
const translations = {
  en: { ... },
  ta: { ... },
  hi: { ... }
};
```

---

## 6. Build Issues

### Problem: Build fails
**Symptoms:**
- npm run build errors
- Compilation errors

**Solutions:**

**Check 1: Syntax Errors**
- Fix all console errors
- Check for missing imports
- Verify all files saved

**Check 2: Dependencies**
```bash
# Reinstall dependencies
npm install
```

**Check 3: Clean Build**
```bash
# Remove build folder
rmdir /s /q build

# Rebuild
npm run build
```

---

## 7. Performance Issues

### Problem: App slow to load
**Symptoms:**
- Long loading time
- Laggy interactions

**Solutions:**

**Optimize 1: Clear Cache**
```bash
# Clear npm cache
npm cache clean --force

# Clear browser cache
Ctrl + Shift + Delete
```

**Optimize 2: Reduce API Calls**
- Cache responses
- Debounce inputs
- Lazy load components

**Optimize 3: Check Network**
- Test internet speed
- Close other apps
- Use wired connection

### Problem: Voice recognition slow
**Symptoms:**
- Delay in recognition
- Timeout errors

**Solutions:**
- Check internet speed
- Reduce background noise
- Speak shorter sentences
- Use text input as backup

---

## 8. Demo Day Issues

### Problem: Internet not available
**Symptoms:**
- No connection
- APIs not working

**Solutions:**

**Backup Plan 1: Screenshots**
- Show prepared screenshots
- Walk through features
- Explain functionality

**Backup Plan 2: Video**
- Play recorded demo video
- Narrate over video
- Show working features

**Backup Plan 3: Offline Explanation**
- Use UI to explain
- Show code structure
- Discuss architecture

### Problem: Laptop issues
**Symptoms:**
- Battery dead
- Screen issues
- Keyboard not working

**Solutions:**

**Prevention:**
- Charge fully before demo
- Bring charger
- Test everything beforehand

**Backup:**
- Have screenshots on phone
- Bring backup laptop
- Use judge's computer if allowed

---

## 9. Browser Console Errors

### Common Errors & Fixes

**Error: "Cannot read property of undefined"**
```javascript
// Fix: Add null checks
{weather && weather.main && (
  <p>Temperature: {weather.main.temp}°C</p>
)}
```

**Error: "Failed to fetch"**
```javascript
// Fix: Add error handling
try {
  const response = await axios.post(API_URL, data);
} catch (error) {
  console.error('API Error:', error);
  // Show user-friendly message
}
```

**Error: "CORS policy blocked"**
```javascript
// Fix: API needs CORS headers
// Contact API owner
// Or use proxy in development
```

**Error: "Module not found"**
```javascript
// Fix: Check import path
import Home from './components/Home'; // Correct
import Home from './Home'; // Wrong if in different folder
```

---

## 10. Quick Fixes

### Emergency Restart
```bash
# Stop everything
Ctrl + C

# Clear everything
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json

# Fresh start
npm install
npm start
```

### Reset to Working State
```bash
# If you have git
git status
git checkout .
git clean -fd

# Reinstall
npm install
npm start
```

### Test Everything
```bash
# Run in order
1. npm start
2. Open http://localhost:3000
3. Test home page
4. Test language selector
5. Test each feature
6. Test voice (Chrome only)
7. Test on mobile (optional)
```

---

## 🆘 Emergency Contacts

### During Hackathon

**Technical Issues:**
1. Check this guide first
2. Check browser console (F12)
3. Google the error message
4. Ask mentors/organizers
5. Use backup plan

**Demo Issues:**
1. Stay calm
2. Explain what should happen
3. Show screenshots/video
4. Discuss code/architecture
5. Answer questions confidently

---

## 📋 Pre-Demo Checklist

Run this checklist 30 minutes before demo:

```bash
# 1. Start fresh
cd frontend
npm start

# 2. Test in browser
# Open http://localhost:3000

# 3. Test each feature
- [ ] Home page loads
- [ ] Language selector works
- [ ] Chatbot opens
- [ ] Voice button works (Chrome)
- [ ] Text input works
- [ ] Weather loads
- [ ] Crop calendar works
- [ ] All back buttons work

# 4. Check console
# F12 → Console → Should be no red errors

# 5. Test voice
# Click mic → Speak → Should recognize

# 6. Ready!
```

---

## 🔍 Debugging Tips

### Use Browser DevTools (F12)

**Console Tab:**
- See error messages
- Test JavaScript code
- Check API responses

**Network Tab:**
- See API calls
- Check request/response
- Verify data format

**Elements Tab:**
- Inspect HTML/CSS
- Test style changes
- Check responsive design

**Application Tab:**
- Check local storage
- Clear cache
- Test offline mode

---

## 💡 Pro Tips

### Before Demo
1. Test everything twice
2. Have backup plan ready
3. Know your error messages
4. Practice troubleshooting
5. Stay calm under pressure

### During Demo
1. If error occurs, stay calm
2. Explain what should happen
3. Use backup materials
4. Keep talking confidently
5. Don't panic!

### After Demo
1. Note what went wrong
2. Fix issues immediately
3. Test again
4. Learn from experience
5. Improve for next time

---

## 📞 Getting Help

### Resources
1. **This Guide** - First stop
2. **README.md** - Full documentation
3. **Browser Console** - Error details
4. **Google** - Search error messages
5. **Mentors** - Ask for help

### What to Provide When Asking
- Exact error message
- What you were doing
- Browser and version
- Steps to reproduce
- Screenshots if possible

---

## ✅ Verification Commands

### Check Everything Works
```bash
# 1. Dependencies installed?
npm list react react-dom axios

# 2. Files exist?
dir src\components

# 3. App starts?
npm start

# 4. No errors?
# Check browser console (F12)

# 5. API works?
# Try chatbot with text input

# 6. Voice works?
# Try microphone button (Chrome)
```

---

## 🎯 Success Indicators

### Everything Working If:
- ✅ App starts without errors
- ✅ Home page displays correctly
- ✅ Language selector changes UI
- ✅ All navigation works
- ✅ Chatbot responds (text input)
- ✅ Voice works (Chrome only)
- ✅ Weather displays
- ✅ Crop calendar shows data
- ✅ No console errors
- ✅ Mobile responsive

---

## 🚨 Last Resort

### If Nothing Works

**Option 1: Use Backup**
- Show screenshots
- Play video demo
- Explain features

**Option 2: Code Walkthrough**
- Show code structure
- Explain architecture
- Discuss implementation

**Option 3: Presentation Mode**
- Focus on idea
- Discuss innovation
- Explain impact
- Show documentation

**Remember:** Judges understand technical issues happen. Your explanation and knowledge matter more than perfect execution!

---

## 🎉 You've Got This!

Most issues have simple fixes. Stay calm, follow this guide, and you'll be fine!

Good luck! 🚀
