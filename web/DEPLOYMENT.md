# AWS Deployment Guide - Voice4Farmers

## Option 1: AWS Amplify (Easiest)

### Steps:
1. Push code to GitHub
2. Go to AWS Amplify Console
3. Click "New App" → "Host web app"
4. Connect GitHub repository
5. Amplify auto-detects React
6. Deploy!

**Result**: Live URL in 5 minutes

---

## Option 2: S3 + CloudFront (Manual)

### 1. Build Production Files
```bash
cd frontend
npm run build
```

### 2. Create S3 Bucket
```bash
aws s3 mb s3://voice4farmers-app
aws s3 website s3://voice4farmers-app --index-document index.html
```

### 3. Upload Build Files
```bash
aws s3 sync build/ s3://voice4farmers-app --acl public-read
```

### 4. Enable Static Website Hosting
- Go to S3 Console
- Select bucket → Properties
- Enable "Static website hosting"
- Note the endpoint URL

### 5. (Optional) Add CloudFront CDN
- Create CloudFront distribution
- Origin: S3 bucket endpoint
- Get CloudFront URL

---

## Backend APIs (If Needed)

### Lambda Functions Structure
```
backend/
├── lambda/
│   ├── chatbot/         # Proxy to RAG model
│   ├── weather/         # Weather API wrapper
│   └── crop-calendar/   # Crop data API
```

### Deploy Lambda
```bash
cd backend/lambda/chatbot
zip -r function.zip .
aws lambda create-function \
  --function-name voice4farmers-chatbot \
  --runtime nodejs18.x \
  --handler index.handler \
  --zip-file fileb://function.zip
```

### API Gateway
1. Create REST API
2. Create resources and methods
3. Integrate with Lambda
4. Deploy to stage
5. Enable CORS

---

## Environment Variables

### For Production
Create `.env.production`:
```
REACT_APP_WEATHER_API_KEY=your_key
REACT_APP_CHATBOT_API=https://voice4farmers-api.onrender.com
REACT_APP_API_GATEWAY=https://your-api.execute-api.region.amazonaws.com
```

---

## Cost Estimate (AWS Free Tier)

- **S3**: Free for 5GB storage
- **CloudFront**: Free for 50GB/month
- **Lambda**: Free for 1M requests/month
- **API Gateway**: Free for 1M requests/month

**Total**: $0/month for demo usage

---

## Custom Domain (Optional)

### Using Route 53
1. Register domain in Route 53
2. Create hosted zone
3. Add A record pointing to CloudFront
4. Add SSL certificate (AWS Certificate Manager - Free)

---

## Monitoring

### CloudWatch
- Lambda logs
- API Gateway metrics
- S3 access logs

### X-Ray (Optional)
- Trace API requests
- Debug performance issues

---

## Security Best Practices

1. **S3 Bucket Policy**: Restrict public access
2. **API Gateway**: Add API keys
3. **Lambda**: Use IAM roles
4. **CloudFront**: Enable HTTPS only
5. **Secrets**: Use AWS Secrets Manager

---

## CI/CD Pipeline (Advanced)

### Using GitHub Actions
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v1
      - run: aws s3 sync build/ s3://voice4farmers-app
```

---

## Quick Deploy Commands

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync build/ s3://voice4farmers-app --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## For Hackathon Demo

**Recommended**: Use AWS Amplify
- Fastest deployment
- Auto SSL
- Auto CI/CD
- Free tier sufficient
- Professional URL

**Time**: 10 minutes from code to live URL
