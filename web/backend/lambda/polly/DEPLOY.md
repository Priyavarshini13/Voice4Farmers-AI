# Deploy Polly TTS Lambda

## Steps:

1. **Install dependencies:**
```bash
cd backend/lambda/polly
npm install
```

2. **Create deployment package:**
```bash
zip -r polly-function.zip .
```

3. **Create Lambda function in AWS Console:**
   - Name: `voice4farmers-polly`
   - Runtime: Node.js 18.x
   - Architecture: x86_64
   - Upload: polly-function.zip

4. **Add IAM permissions:**
   - Attach policy: `AmazonPollyReadOnlyAccess`

5. **Create API Gateway:**
   - Type: REST API
   - Resource: `/polly`
   - Method: POST
   - Enable CORS
   - Deploy to stage: `prod`

6. **Update Chatbot.js:**
   - Replace API endpoint with your API Gateway URL

## Polly Voices:
- English: Joanna (Neural)
- Tamil: Kajal (Neural)
- Hindi: Aditi (Neural)
