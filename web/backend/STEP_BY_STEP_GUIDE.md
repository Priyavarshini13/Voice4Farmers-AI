# AWS Lambda Backend - Complete Step-by-Step Deployment Guide

## Prerequisites
- AWS Account (create at https://aws.amazon.com if you don't have one)
- OpenWeather API Key (get free at https://openweathermap.org/api)
- Your friend's RAG API URL

---

## PART 1: CREATE LAMBDA FUNCTIONS (30 minutes)

### Step 1.1: Create Chatbot Lambda Function

1. **Login to AWS Console**
   - Go to https://console.aws.amazon.com/
   - Sign in with your credentials

2. **Navigate to Lambda**
   - In the search bar at top, type "Lambda"
   - Click on "Lambda" service

3. **Create Function**
   - Click orange "Create function" button (top right)
   - Select "Author from scratch" (should be selected by default)
   
4. **Configure Function**
   ```
   Function name: voice4farmers-chatbot
   Runtime: Node.js 18.x (select from dropdown)
   Architecture: x86_64 (default)
   ```
   
5. **Permissions**
   - Expand "Change default execution role"
   - Select "Create a new role with basic Lambda permissions"
   - Click orange "Create function" button at bottom

6. **Wait for Creation**
   - You'll see "Successfully created the function voice4farmers-chatbot"
   - You're now on the function configuration page

7. **Add Code**
   - Scroll down to "Code source" section
   - You'll see a code editor with index.js
   - **DELETE ALL** existing code
   - **COPY** entire code from `backend/lambda/chatbot/index.js`
   - **PASTE** into the editor
   - Click "Deploy" button (orange, above code editor)
   - Wait for "Changes deployed" message

8. **Update RAG URL (IMPORTANT)**
   - In the code, find line: `const RAG_API_URL = 'https://voice4farmers-api.onrender.com';`
   - Replace with your friend's actual RAG API URL
   - Click "Deploy" again

---

### Step 1.2: Create Weather Lambda Function

1. **Go Back to Lambda Dashboard**
   - Click "Lambda" in breadcrumb at top, or
   - Click "Functions" in left sidebar

2. **Create New Function**
   - Click "Create function" button
   - Select "Author from scratch"

3. **Configure Function**
   ```
   Function name: voice4farmers-weather
   Runtime: Node.js 18.x
   Architecture: x86_64
   ```

4. **Create Function**
   - Use default execution role
   - Click "Create function"

5. **Add Code**
   - Delete existing code in editor
   - Copy code from `backend/lambda/weather/index.js`
   - Paste into editor
   - Click "Deploy"

6. **Add Environment Variable**
   - Click "Configuration" tab (below function name)
   - Click "Environment variables" in left menu
   - Click "Edit" button
   - Click "Add environment variable"
   ```
   Key: OPENWEATHER_API_KEY
   Value: [paste your OpenWeather API key here]
   ```
   - Click "Save"

---

### Step 1.3: Create Crop Calendar Lambda Function

1. **Create Function**
   - Go back to Functions list
   - Click "Create function"
   - Select "Author from scratch"

2. **Configure**
   ```
   Function name: voice4farmers-crop-calendar
   Runtime: Node.js 18.x
   ```

3. **Add Code**
   - Click "Create function"
   - Delete existing code
   - Copy code from `backend/lambda/crop-calendar/index.js`
   - Paste and click "Deploy"

---

## PART 2: CREATE API GATEWAY (20 minutes)

### Step 2.1: Create REST API

1. **Navigate to API Gateway**
   - In AWS Console search bar, type "API Gateway"
   - Click "API Gateway" service

2. **Create API**
   - Click "Create API" button (orange)
   - Find "REST API" (NOT REST API Private)
   - Click "Build" button under REST API

3. **Configure API**
   ```
   Choose the protocol: REST
   Create new API: New API
   API name: voice4farmers-api
   Description: Backend API for Voice4Farmers
   Endpoint Type: Regional
   ```
   - Click "Create API" button

---

### Step 2.2: Create Chatbot Endpoint

1. **Create Resource**
   - You're now on the API Gateway console
   - Click "Actions" dropdown → "Create Resource"
   ```
   Resource Name: chatbot
   Resource Path: /chatbot (auto-filled)
   Enable API Gateway CORS: ✓ CHECK THIS BOX
   ```
   - Click "Create Resource"

2. **Create POST Method**
   - With `/chatbot` selected (highlighted)
   - Click "Actions" → "Create Method"
   - A small dropdown appears under /chatbot
   - Select "POST" from dropdown
   - Click the checkmark ✓ next to it

3. **Setup Integration**
   ```
   Integration type: Lambda Function
   Use Lambda Proxy integration: ✓ CHECK THIS
   Lambda Region: [your region, e.g., us-east-1]
   Lambda Function: voice4farmers-chatbot (start typing, it will autocomplete)
   ```
   - Click "Save"
   - Click "OK" on the permission popup

---

### Step 2.3: Create Weather Endpoint

1. **Create Resource**
   - Click "/" (root) in the Resources tree
   - Click "Actions" → "Create Resource"
   ```
   Resource Name: weather
   Enable API Gateway CORS: ✓ CHECK
   ```
   - Click "Create Resource"

2. **Create GET Method**
   - With `/weather` selected
   - Click "Actions" → "Create Method"
   - Select "GET" from dropdown
   - Click checkmark ✓

3. **Setup Integration**
   ```
   Integration type: Lambda Function
   Use Lambda Proxy integration: ✓ CHECK
   Lambda Function: voice4farmers-weather
   ```
   - Click "Save"
   - Click "OK"

---

### Step 2.4: Create Crop Calendar Endpoint

1. **Create Resource**
   - Click "/" (root)
   - Click "Actions" → "Create Resource"
   ```
   Resource Name: crop-calendar
   Enable API Gateway CORS: ✓ CHECK
   ```
   - Click "Create Resource"

2. **Create GET Method**
   - With `/crop-calendar` selected
   - Click "Actions" → "Create Method"
   - Select "GET"
   - Click checkmark ✓

3. **Setup Integration**
   ```
   Integration type: Lambda Function
   Use Lambda Proxy integration: ✓ CHECK
   Lambda Function: voice4farmers-crop-calendar
   ```
   - Click "Save"
   - Click "OK"

---

### Step 2.5: Enable CORS (CRITICAL)

For EACH resource (/chatbot, /weather, /crop-calendar):

1. **Select the resource**
2. **Click "Actions" → "Enable CORS"**
3. **Keep all defaults** (should show):
   ```
   Access-Control-Allow-Headers: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
   Access-Control-Allow-Methods: All methods selected
   Access-Control-Allow-Origin: '*'
   ```
4. **Click "Enable CORS and replace existing CORS headers"**
5. **Click "Yes, replace existing values"**
6. **Repeat for all 3 resources**

---

### Step 2.6: Deploy API

1. **Deploy**
   - Click "Actions" → "Deploy API"
   
2. **Deployment Stage**
   ```
   Deployment stage: [New Stage]
   Stage name: prod
   Stage description: Production
   ```
   - Click "Deploy"

3. **Get Your API URL**
   - You'll see "Invoke URL" at the top
   - Example: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod`
   - **COPY THIS URL** - you'll need it for frontend

---

## PART 3: TEST YOUR APIs (10 minutes)

### Test Using Browser/Postman

**Test Weather (easiest - use browser):**
```
https://YOUR_API_URL/prod/weather?city=Coimbatore
```
Paste in browser, should return JSON weather data

**Test Crop Calendar (use browser):**
```
https://YOUR_API_URL/prod/crop-calendar?crop=paddy&language=english
```

**Test Chatbot (use Postman or curl):**
```bash
curl -X POST https://YOUR_API_URL/prod/chatbot \
  -H "Content-Type: application/json" \
  -d '{"question":"How to grow rice?","session_id":"1"}'
```

---

## PART 4: UPDATE FRONTEND (5 minutes)

### Update Chatbot Component

Open `frontend/src/components/Chatbot.js`:

Find this line (around line 30):
```javascript
const response = await axios.post('https://voice4farmers-api.onrender.com', {
```

Replace with:
```javascript
const response = await axios.post('https://YOUR_API_URL/prod/chatbot', {
```

### Update Weather Component

Open `frontend/src/components/Weather.js`:

Find this line (around line 18):
```javascript
const response = await axios.get(
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
);
```

Replace with:
```javascript
const response = await axios.get(
  `https://YOUR_API_URL/prod/weather?city=${city}`
);
```

### Update Home Component (Weather Widget)

Open `frontend/src/components/Home.js`:

Find this line (around line 24):
```javascript
const response = await axios.get(
  `https://api.openweathermap.org/data/2.5/weather?q=Coimbatore&appid=${API_KEY}&units=metric`
);
```

Replace with:
```javascript
const response = await axios.get(
  `https://YOUR_API_URL/prod/weather?city=Coimbatore`
);
```

---

## PART 5: RUN AND TEST (5 minutes)

1. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```

2. **Test Each Feature**
   - ✅ Home page weather widget loads
   - ✅ Weather page shows data
   - ✅ Chatbot responds to questions
   - ✅ Crop calendar displays stages

---

## TROUBLESHOOTING

### Issue: CORS Error in Browser Console

**Solution:**
1. Go to API Gateway
2. Select each resource
3. Actions → Enable CORS
4. Enable and replace
5. Actions → Deploy API → prod

### Issue: 502 Bad Gateway

**Solution:**
1. Go to Lambda function
2. Check CloudWatch Logs (Monitor tab → View logs)
3. Look for errors in latest log stream

### Issue: Lambda Timeout

**Solution:**
1. Go to Lambda function
2. Configuration → General configuration → Edit
3. Increase Timeout to 30 seconds
4. Click Save

### Issue: API Returns 403 Forbidden

**Solution:**
1. Go to Lambda function
2. Configuration → Permissions
3. Check execution role has basic permissions
4. Go to API Gateway
5. Redeploy API (Actions → Deploy API)

---

## COST ESTIMATE

**AWS Free Tier (First 12 months):**
- Lambda: 1M requests/month FREE
- API Gateway: 1M requests/month FREE
- CloudWatch Logs: 5GB FREE

**After Free Tier:**
- Lambda: $0.20 per 1M requests
- API Gateway: $3.50 per 1M requests
- **Estimated: $0-5/month** for moderate usage

---

## SECURITY CHECKLIST

- [ ] Lambda functions have minimal IAM permissions
- [ ] API Gateway has CORS properly configured
- [ ] OpenWeather API key stored in Lambda environment variables
- [ ] No sensitive data in code
- [ ] CloudWatch logs enabled for monitoring

---

## NEXT STEPS

1. ✅ Deploy Lambda functions
2. ✅ Create API Gateway
3. ✅ Test all endpoints
4. ✅ Update frontend URLs
5. ✅ Test complete application
6. 🎯 Deploy frontend to S3/Amplify/Vercel
7. 🎯 Set up custom domain (optional)
8. 🎯 Add API Gateway API keys for production (optional)

---

## SUPPORT RESOURCES

- **AWS Lambda Docs**: https://docs.aws.amazon.com/lambda/
- **API Gateway Docs**: https://docs.aws.amazon.com/apigateway/
- **AWS Free Tier**: https://aws.amazon.com/free/
- **CloudWatch Logs**: Lambda → Monitor → View logs in CloudWatch

---

## QUICK REFERENCE

**Your API Endpoints:**
```
Chatbot:       POST   https://YOUR_API_URL/prod/chatbot
Weather:       GET    https://YOUR_API_URL/prod/weather?city=CITY
Crop Calendar: GET    https://YOUR_API_URL/prod/crop-calendar?crop=CROP&language=LANG
```

**Lambda Functions:**
- voice4farmers-chatbot
- voice4farmers-weather
- voice4farmers-crop-calendar

**API Gateway:**
- voice4farmers-api (prod stage)

---

## COMPLETION CHECKLIST

- [ ] All 3 Lambda functions created and deployed
- [ ] API Gateway created with 3 resources
- [ ] CORS enabled on all resources
- [ ] API deployed to prod stage
- [ ] All endpoints tested successfully
- [ ] Frontend updated with new API URLs
- [ ] Application tested end-to-end
- [ ] CloudWatch logs checked for errors

---

**🎉 Congratulations! Your serverless backend is now live!**

Total Time: ~70 minutes
Cost: FREE (within AWS Free Tier)
