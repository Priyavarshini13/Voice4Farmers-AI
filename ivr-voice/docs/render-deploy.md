# Render Deployment Guide

## Step 1: Prepare for Deployment

### Create render.yaml (Optional)
```yaml
services:
  - type: web
    name: twilio-voice-rag
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python main.py
    envVars:
      - key: RAG_API_URL
        value: https://voice4farmers-api.onrender.com/query
      - key: PORT
        fromGroup: PORT
```

## Step 2: Deploy to Render

### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub repository
2. Go to [render.com](https://render.com) and sign up
3. Click **New** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `twilio-voice-rag`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
6. Add environment variables:
   - `RAG_API_URL`: `https://voice4farmers-api.onrender.com/query`
7. Click **Create Web Service**

### Option B: Manual Upload
1. Create a ZIP file of your project
2. Go to Render dashboard
3. Click **New** → **Web Service**
4. Choose **Upload from computer**
5. Upload your ZIP file
6. Follow same configuration as Option A

## Step 3: Configure Environment Variables

In Render dashboard:
1. Go to your service → **Environment**
2. Add these variables:
   ```
   RAG_API_URL=https://voice4farmers-api.onrender.com/query
   PORT=10000
   LOG_LEVEL=INFO
   ```

## Step 4: Verify Deployment

### Check Service Status
1. Wait for deployment to complete (5-10 minutes)
2. Your app will be available at: `https://your-service-name.onrender.com`
3. Test health endpoint: `https://your-service-name.onrender.com/health`

### Test Endpoints
```bash
# Health check
curl https://your-service-name.onrender.com/health

# Test incoming webhook
curl https://your-service-name.onrender.com/voice/incoming

# Expected response: TwiML XML
```

## Step 5: Update Twilio Webhooks

1. Go to Twilio Console
2. Navigate to **Phone Numbers** → **Manage** → **Active numbers**
3. Click your phone number
4. Update webhook URL to: `https://your-service-name.onrender.com/voice/incoming`
5. Save configuration

## Step 6: Production Optimizations

### Enable Auto-Deploy
1. In Render dashboard, go to **Settings**
2. Enable **Auto-Deploy** for automatic updates from GitHub

### Monitor Performance
1. Check **Metrics** tab for response times
2. Monitor **Logs** for errors
3. Set up **Alerts** for downtime

### Scale if Needed
1. Upgrade to paid plan for better performance
2. Consider multiple instances for high traffic

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render service created and deployed
- [ ] Environment variables configured
- [ ] Health endpoint responding
- [ ] Twilio webhooks updated
- [ ] Test call completed successfully
- [ ] Logs showing proper flow
- [ ] Error handling tested

## Troubleshooting

### Common Deployment Issues

1. **Build Failed**
   - Check requirements.txt syntax
   - Verify Python version compatibility
   - Check build logs in Render

2. **Service Won't Start**
   - Verify start command: `python main.py`
   - Check PORT environment variable
   - Review application logs

3. **Webhook Timeouts**
   - Ensure RAG API is responding quickly
   - Add timeout handling in code
   - Check network connectivity

### Monitoring Commands
```bash
# Check service health
curl https://your-service-name.onrender.com/health

# Test with sample data
curl -X POST https://your-service-name.onrender.com/voice/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "SpeechResult=Test question&From=+1234567890&CallSid=test"
```

## Cost Optimization

### Free Tier Limits
- 750 hours/month free
- Service sleeps after 15 minutes of inactivity
- Cold start delay (~30 seconds)

### Paid Plan Benefits
- No sleep mode
- Faster response times
- Custom domains
- Better support

## Security Best Practices

1. **Environment Variables**: Never commit secrets to code
2. **HTTPS Only**: Render provides SSL by default
3. **Input Validation**: Validate all Twilio webhook data
4. **Rate Limiting**: Consider adding rate limits for production
5. **Monitoring**: Set up alerts for unusual activity