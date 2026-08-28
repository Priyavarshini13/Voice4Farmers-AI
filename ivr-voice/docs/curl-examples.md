# Twilio Voice RAG Integration - cURL Test Examples

## Local Testing (Development)

### 1. Health Check
```bash
curl -X GET http://localhost:8000/health
```

### 2. Test Incoming Call Webhook
```bash
curl -X POST http://localhost:8000/voice/incoming \
  -H "Content-Type: application/x-www-form-urlencoded"
```

### 3. Test Speech Processing (English)
```bash
curl -X POST http://localhost:8000/voice/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "SpeechResult=What is the best fertilizer for rice crops?" \
  -d "From=+919876543210" \
  -d "CallSid=CA123test456"
```

### 4. Test Speech Processing (Hindi)
```bash
curl -X POST http://localhost:8000/voice/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "SpeechResult=धान की फसल के लिए कौन सा उर्वरक सबसे अच्छा है?" \
  -d "From=+919876543211" \
  -d "CallSid=CA123test457"
```

### 5. Test Speech Processing (Tamil)
```bash
curl -X POST http://localhost:8000/voice/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "SpeechResult=நெல் பயிருக்கு எந்த உரம் சிறந்தது?" \
  -d "From=+919876543212" \
  -d "CallSid=CA123test458"
```

## Production Testing (Render Deployment)

Replace `localhost:8000` with your Render app URL: `https://your-app-name.onrender.com`

### 1. Production Health Check
```bash
curl -X GET https://your-app-name.onrender.com/health
```

### 2. Production Incoming Call Test
```bash
curl -X POST https://your-app-name.onrender.com/voice/incoming \
  -H "Content-Type: application/x-www-form-urlencoded"
```

### 3. Production Speech Processing Test
```bash
curl -X POST https://your-app-name.onrender.com/voice/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "SpeechResult=How to protect crops from pests?" \
  -d "From=+919876543210" \
  -d "CallSid=CA123prod456"
```

## RAG API Direct Testing

### Test Your RAG API Directly
```bash
curl -X POST https://voice4farmers-api.onrender.com/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the best fertilizer for rice?",
    "session_id": "test_session_123"
  }'
```

## Expected Responses

### Health Check Response
```json
{
  "status": "healthy",
  "service": "twilio-voice-rag"
}
```

### Incoming Call Response (TwiML)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/voice/process" method="POST" language="ta-IN" speechTimeout="auto" hints="farming, crops, weather, fertilizer, agriculture">
    <Say voice="Polly.Aditi" language="en-IN">Welcome to Voice4Farmers. Please ask your farming question in Tamil, Hindi, or English.</Say>
  </Gather>
  <Say voice="Polly.Aditi">We didn't receive any input. Goodbye.</Say>
</Response>
```

### Speech Processing Response (TwiML)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="en-IN">[RAG API Response Here]</Say>
  <Gather input="speech" action="/voice/process" method="POST" language="en-IN" speechTimeout="auto">
    <Say voice="Polly.Aditi" language="en-IN">Do you have another question?</Say>
  </Gather>
  <Say voice="Polly.Aditi">Thank you for calling Voice4Farmers. Goodbye.</Say>
</Response>
```

## Troubleshooting Commands

### Check if service is running
```bash
curl -I http://localhost:8000/
```

### Test with verbose output
```bash
curl -v -X POST http://localhost:8000/voice/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "SpeechResult=test question" \
  -d "From=+1234567890" \
  -d "CallSid=test123"
```

### Test with timeout
```bash
curl --max-time 30 -X POST http://localhost:8000/voice/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "SpeechResult=test question" \
  -d "From=+1234567890" \
  -d "CallSid=test123"
```

## Batch Testing Script

Create a file `test_batch.sh`:
```bash
#!/bin/bash

BASE_URL="http://localhost:8000"

echo "Testing health endpoint..."
curl -s "$BASE_URL/health" | jq .

echo -e "\nTesting incoming call..."
curl -s -X POST "$BASE_URL/voice/incoming" | head -5

echo -e "\nTesting speech processing..."
curl -s -X POST "$BASE_URL/voice/process" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "SpeechResult=What crops grow well in monsoon?" \
  -d "From=+919876543210" \
  -d "CallSid=test123" | head -5

echo -e "\nAll tests completed!"
```

Make it executable and run:
```bash
chmod +x test_batch.sh
./test_batch.sh
```