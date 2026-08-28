# AWS Lambda Backend Deployment Guide

## Overview
This backend uses AWS Lambda functions with API Gateway to provide serverless APIs for Voice4Farmers.

## Lambda Functions

### 1. Chatbot Lambda (`chatbot/index.js`)
- **Purpose**: Proxy requests to RAG API
- **Method**: POST
- **Endpoint**: `/api/chatbot`
- **Request**: `{ "question": "string", "session_id": "string" }`
- **Response**: `{ "answer": "string", "confidence": number }`

### 2. Weather Lambda (`weather/index.js`)
- **Purpose**: Fetch weather data from OpenWeather API
- **Method**: GET
- **Endpoint**: `/api/weather?city=Coimbatore` or `/api/weather?lat=11.0168&lon=76.9558`
- **Environment Variable**: `OPENWEATHER_API_KEY`
- **Response**: Weather data JSON

### 3. Crop Calendar Lambda (`crop-calendar/index.js`)
- **Purpose**: Serve crop calendar data
- **Method**: GET
- **Endpoint**: `/api/crop-calendar?crop=paddy&language=english`
- **Response**: Crop stages with descriptions

## Deployment Steps

### Step 1: Create Lambda Functions

1. **Go to AWS Lambda Console**
   - Navigate to https://console.aws.amazon.com/lambda/

2. **Create Chatbot Function**
   ```
   - Click "Create function"
   - Choose "Author from scratch"
   - Function name: voice4farmers-chatbot
   - Runtime: Node.js 18.x
   - Click "Create function"
   - Copy code from backend/lambda/chatbot/index.js
   - Click "Deploy"
   ```

3. **Create Weather Function**
   ```
   - Repeat above steps
   - Function name: voice4farmers-weather
   - Add environment variable: OPENWEATHER_API_KEY = your_api_key
   - Copy code from backend/lambda/weather/index.js
   ```

4. **Create Crop Calendar Function**
   ```
   - Repeat above steps
   - Function name: voice4farmers-crop-calendar
   - Copy code from backend/lambda/crop-calendar/index.js
   ```

### Step 2: Configure API Gateway

1. **Create REST API**
   ```
   - Go to API Gateway Console
   - Click "Create API"
   - Choose "REST API"
   - API name: voice4farmers-api
   - Click "Create API"
   ```

2. **Create Resources and Methods**
   
   **For Chatbot:**
   ```
   - Create resource: /chatbot
   - Create method: POST
   - Integration type: Lambda Function
   - Select: voice4farmers-chatbot
   - Enable CORS
   ```

   **For Weather:**
   ```
   - Create resource: /weather
   - Create method: GET
   - Integration type: Lambda Function
   - Select: voice4farmers-weather
   - Enable CORS
   ```

   **For Crop Calendar:**
   ```
   - Create resource: /crop-calendar
   - Create method: GET
   - Integration type: Lambda Function
   - Select: voice4farmers-crop-calendar
   - Enable CORS
   ```

3. **Enable CORS for All**
   ```
   - Select each resource
   - Actions → Enable CORS
   - Enable CORS and replace existing CORS headers
   ```

4. **Deploy API**
   ```
   - Actions → Deploy API
   - Deployment stage: prod
   - Click "Deploy"
   - Note the Invoke URL (e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod)
   ```

### Step 3: Update Frontend

Update the API endpoints in your React components:

**Chatbot.js:**
```javascript
const API_URL = 'https://YOUR_API_GATEWAY_URL/prod/chatbot';
```

**Weather.js:**
```javascript
const API_URL = 'https://YOUR_API_GATEWAY_URL/prod/weather';
```

**CropCalendar.js:**
```javascript
const API_URL = 'https://YOUR_API_GATEWAY_URL/prod/crop-calendar';
```

### Step 4: Configure Lambda Permissions

Each Lambda function needs permission to be invoked by API Gateway:
```
- Go to Lambda function
- Configuration → Permissions
- Resource-based policy should show API Gateway
- If not, add permission:
  - Service: apigateway.amazonaws.com
  - Source ARN: your API Gateway ARN
```

### Step 5: Test APIs

**Test Chatbot:**
```bash
curl -X POST https://YOUR_API_URL/prod/chatbot \
  -H "Content-Type: application/json" \
  -d '{"question":"How to grow rice?","session_id":"1"}'
```

**Test Weather:**
```bash
curl https://YOUR_API_URL/prod/weather?city=Coimbatore
```

**Test Crop Calendar:**
```bash
curl https://YOUR_API_URL/prod/crop-calendar?crop=paddy&language=english
```

## Environment Variables

### Weather Lambda
- `OPENWEATHER_API_KEY`: Your OpenWeather API key (get from https://openweathermap.org/api)

### Chatbot Lambda
- Update `RAG_API_URL` in code with your friend's deployed RAG URL

## Cost Optimization

- **Lambda Free Tier**: 1M requests/month, 400,000 GB-seconds compute
- **API Gateway Free Tier**: 1M API calls/month for 12 months
- **Estimated Cost**: $0-5/month for moderate usage

## Monitoring

1. **CloudWatch Logs**
   - Each Lambda function logs to CloudWatch
   - View logs: Lambda → Monitor → View logs in CloudWatch

2. **API Gateway Metrics**
   - Monitor API calls, latency, errors
   - API Gateway → Dashboard

## Troubleshooting

### CORS Issues
- Ensure CORS is enabled on API Gateway
- Check Lambda response includes CORS headers

### Lambda Timeout
- Default timeout: 3 seconds
- Increase if needed: Configuration → General → Timeout

### API Gateway 502 Error
- Check Lambda function logs in CloudWatch
- Verify Lambda has correct permissions

## Security Best Practices

1. **API Keys**: Use API Gateway API keys for production
2. **Rate Limiting**: Configure throttling in API Gateway
3. **Environment Variables**: Store sensitive data in Lambda environment variables
4. **IAM Roles**: Use least privilege principle for Lambda execution roles

## Next Steps

1. Deploy Lambda functions
2. Configure API Gateway
3. Update frontend with API URLs
4. Test all endpoints
5. Monitor usage and costs
6. Set up CloudWatch alarms for errors

## Support

For issues:
- Check CloudWatch logs
- Verify API Gateway configuration
- Test Lambda functions directly in console
