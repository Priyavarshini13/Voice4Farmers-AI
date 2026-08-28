# Twilio Console Setup Guide

## Step 1: Create Twilio Account
1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for a free account
3. Verify your phone number
4. Note your **Account SID** and **Auth Token** from the dashboard

## Step 2: Get a Phone Number
1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose your country (India recommended for Indian farmers)
3. Select a number with **Voice** capabilities
4. Purchase the number
5. Note the phone number (e.g., +91XXXXXXXXXX)

## Step 3: Configure Webhooks
1. Go to **Phone Numbers** → **Manage** → **Active numbers**
2. Click on your purchased number
3. In the **Voice Configuration** section:
   - **A call comes in**: Webhook
   - **URL**: `https://your-render-app.onrender.com/voice/incoming`
   - **HTTP Method**: POST
4. Save the configuration

## Step 4: Test Configuration
1. Deploy your app to Render first (see render-deploy.md)
2. Update the webhook URL with your Render app URL
3. Call your Twilio number to test

## Step 5: Production Settings (Optional)

### Enable Call Recording
```xml
<!-- Add to TwiML if needed -->
<Record action="/voice/recording" method="POST" />
```

### Set up Call Logs
1. Go to **Monitor** → **Logs** → **Calls**
2. Monitor call quality and issues

### Configure Fallback URL
In phone number configuration:
- **Primary handler fails**: `https://your-render-app.onrender.com/voice/incoming`

## Webhook URLs Summary
- **Incoming Call**: `https://your-app.onrender.com/voice/incoming`
- **Speech Processing**: `https://your-app.onrender.com/voice/process`
- **Health Check**: `https://your-app.onrender.com/health`

## Testing Webhooks Locally

### Using ngrok (for local testing)
```bash
# Install ngrok
# Download from ngrok.com

# Expose local server
ngrok http 8000

# Use the ngrok URL in Twilio webhook
# Example: https://abc123.ngrok.io/voice/incoming
```

## Troubleshooting

### Common Issues
1. **Webhook timeout**: Ensure your app responds within 10 seconds
2. **Invalid TwiML**: Check XML syntax in responses
3. **Speech not recognized**: Verify language settings match caller's language
4. **No audio**: Check voice and language parameters in TwiML

### Debug Tools
1. **Twilio Debugger**: Monitor webhook calls in real-time
2. **Call Logs**: Check call flow and errors
3. **App Logs**: Monitor your application logs

### Webhook Testing
```bash
# Test incoming call webhook
curl -X POST https://your-app.onrender.com/voice/incoming

# Test speech processing
curl -X POST https://your-app.onrender.com/voice/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "SpeechResult=What is the best fertilizer for rice&From=+919876543210&CallSid=CA123"
```