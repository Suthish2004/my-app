# 🚀 Quick Setup Guide

## Prerequisites
1. Node.js v16+ installed
2. Code editor (VS Code recommended)

## Step 1: Firebase Setup

1. Create project at [firebase.google.com/console](https://firebase.google.com/console)
2. Enable Authentication → Email/Password
3. Enable Firestore Database (test mode)
4. Get web config (Project Settings → General → Your apps)
5. Download service account key (Project Settings → Service Accounts → Generate key)

## Step 2: Meta App Setup

1. Create app at [developers.facebook.com](https://developers.facebook.com)
2. Add Facebook Login product
3. Set OAuth redirect: `http://localhost:5000/api/auth/meta/callback`
4. Add permissions: `pages_show_list`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`
5. Add yourself as Tester (Roles → Testers)

## Step 3: Get API Keys

1. **Gemini**: Get key from [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com) for free account

## Step 4: Backend Configuration

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your credentials.

## Step 5: Frontend Configuration

```bash
cd client
npm install
```

Edit `src/firebase.js` with your Firebase web config.

## Step 6: Run Application

Terminal 1:
```bash
cd server
npm run dev
```

Terminal 2:
```bash
cd client
npm start
```

## Done! 🎉
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

See main README.md for detailed instructions.
