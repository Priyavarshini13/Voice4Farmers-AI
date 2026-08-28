# Twilio Voice RAG Integration Setup Guide

## Project Structure
```
twilio-voice-backend/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
├── .env.example           # Environment variables template
├── README.md              # This file
└── docs/
    ├── twilio-setup.md    # Twilio console setup
    └── render-deploy.md   # Render deployment guide
```

## Quick Start

### 1. Local Development Setup
```bash
# Clone and navigate
cd twilio-voice-backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env

# Run locally
python main.py
```

### 2. Test Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Test incoming call webhook (simulate Twilio)
curl -X POST http://localhost:8000/voice/incoming

# Test speech processing (simulate Twilio)
curl -X POST http://localhost:8000/voice/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "SpeechResult=What crops should I plant in winter&From=+1234567890&CallSid=test123"
```

## API Endpoints

### GET /
- **Purpose**: Service status
- **Response**: `{"status": "Twilio Voice Integration Active", "version": "1.0"}`

### POST /voice/incoming
- **Purpose**: Handle incoming Twilio calls
- **Response**: TwiML with speech gathering instructions

### POST /voice/process
- **Purpose**: Process speech input and respond
- **Form Data**:
  - `SpeechResult`: Transcribed speech
  - `From`: Caller phone number
  - `CallSid`: Twilio call ID
- **Response**: TwiML with voice response

### GET /health
- **Purpose**: Health check for monitoring
- **Response**: `{"status": "healthy", "service": "twilio-voice-rag"}`

## Features

✅ **Multi-language Support**: Tamil, Hindi, Telugu, English
✅ **Speech Recognition**: Twilio native speech-to-text
✅ **Language Detection**: Automatic input language detection
✅ **Translation**: Auto-translate responses to caller's language
✅ **Session Management**: Phone number as session ID
✅ **Error Handling**: Graceful error responses
✅ **Logging**: Comprehensive call flow logging
✅ **Production Ready**: Async, scalable, containerized

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RAG_API_URL` | Your deployed RAG API endpoint | `https://voice4farmers-api.onrender.com/query` |
| `PORT` | Server port | `8000` |
| `HOST` | Server host | `0.0.0.0` |
| `LOG_LEVEL` | Logging level | `INFO` |

## Next Steps

1. **Twilio Setup**: See `docs/twilio-setup.md`
2. **Deploy to Render**: See `docs/render-deploy.md`
3. **Test with Real Calls**: Configure webhooks and test

## Architecture Flow

```
Farmer Call → Twilio → Your App → RAG API → Translation → TTS → Twilio → Farmer
```

1. Farmer calls Twilio number
2. Twilio sends webhook to `/voice/incoming`
3. App responds with TwiML to gather speech
4. Twilio captures speech and sends to `/voice/process`
5. App detects language and queries RAG API
6. App translates response if needed
7. App returns TwiML with voice response
8. Twilio speaks response to farmer
9. Loop continues for follow-up questions