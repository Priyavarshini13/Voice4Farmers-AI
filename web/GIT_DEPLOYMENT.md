# Git Deployment Guide

## Step 1: Initialize Git (if not already done)
```bash
cd cit_Hacks
git init
```

## Step 2: Add remote repository
```bash
git remote add origin <YOUR_REPOSITORY_URL>
```

## Step 3: Create and switch to new branch
```bash
git checkout -b feature/voice4farmers-implementation
```

## Step 4: Add all files
```bash
git add .
```

## Step 5: Commit changes
```bash
git commit -m "feat: Add Voice4Farmers AI chatbot with multilingual support

- Implemented React frontend with Tamil, Hindi, English support
- Added AWS Lambda functions for chatbot, translation, TTS
- Integrated ElevenLabs for Tamil TTS
- Added AWS Polly for English/Hindi TTS
- Implemented AWS Translate for language translation
- Added Weather and Crop Calendar features
- Configured API Gateway endpoints"
```

## Step 6: Push to remote
```bash
git push -u origin feature/voice4farmers-implementation
```

## Step 7: Create Pull Request
Go to your repository on GitHub/GitLab and create a pull request to merge into main branch.

## Important Notes:
- ✅ .env file is gitignored (API keys protected)
- ✅ .env.example provided for team members
- ✅ All sensitive data removed from code
- ✅ Lambda deployment zips excluded

## For Team Members:
1. Clone the repository
2. Copy `.env.example` to `.env`
3. Add your own API keys in `.env`
4. Run `npm install` in frontend folder
5. Run `npm start`
