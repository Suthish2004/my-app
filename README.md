# AI Digital Marketing Manager

A full-stack web application that acts as an AI-powered social media assistant. Generate content calendars using Gemini AI and auto-post to Facebook and Instagram.

## 🎯 Project Overview

This college project demonstrates a complete social media automation workflow:
- User authentication with Firebase
- AI-powered content generation using Gemini
- Visual content calendar with react-big-calendar
- Image upload via Cloudinary
- Auto-posting to Facebook & Instagram via Meta Graph API
- Analytics dashboard (mocked for demo)

**Important**: This application runs in Meta's **Developer Mode** and is designed for testing purposes. It only works for users added as "Testers" in the Meta App Dashboard.

## 🏗️ Architecture

```
ai-digital-marketing-manager/
├── client/              # React frontend
│   ├── public/
│   └── src/
│       ├── api/         # API client
│       ├── components/  # React components
│       ├── context/     # Auth context
│       ├── pages/       # Page components
│       └── firebase.js  # Firebase config
└── server/              # Node.js/Express backend
    ├── middleware/      # Auth middleware
    ├── routes/          # API routes
    └── index.js         # Server entry point
```

## 🚀 Tech Stack

### Frontend
- React 18
- React Router DOM
- Firebase Authentication
- Axios
- react-big-calendar
- Recharts (for analytics)
- Lucide React (icons)

### Backend
- Node.js & Express
- Firebase Admin SDK
- Gemini AI API
- Cloudinary SDK
- Meta Graph API
- Multer (file upload)

### Database
- Firestore (NoSQL)

## 📋 Prerequisites

Before you begin, ensure you have the following:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Firebase Project** - [Create one here](https://console.firebase.google.com/)
3. **Meta App** (Facebook/Instagram) - [Create here](https://developers.facebook.com/)
4. **Gemini API Key** - [Get one here](https://makersuite.google.com/app/apikey)
5. **Cloudinary Account** - [Sign up here](https://cloudinary.com/)

## 🔧 Setup Instructions

### 1. Clone/Download the Project

Navigate to the project directory:
```bash
cd ai-digital-marketing-manager
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database**
5. Download service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

6. Get web app config:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the Firebase configuration

### 3. Meta App Setup (Facebook/Instagram)

1. Go to [Meta Developers](https://developers.facebook.com/)
2. Create a new app → **Business** type
3. Add **Facebook Login** product
4. Configure OAuth redirect URI: `http://localhost:5000/api/auth/meta/callback`
5. Add required permissions in App Review:
   - `pages_show_list`
   - `pages_manage_posts`
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`

6. Add yourself as a **Tester**:
   - Roles → Testers → Add Testers
   - Accept the invitation in your Facebook account

7. Connect Instagram Business Account to your Facebook Page

### 4. Backend Configuration

Navigate to server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Meta App
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
META_REDIRECT_URI=http://localhost:5000/api/auth/meta/callback

# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Important**: For `FIREBASE_PRIVATE_KEY`, keep the quotes and `\n` line breaks as shown.

### 5. Frontend Configuration

Navigate to client directory:
```bash
cd ../client
```

Install dependencies:
```bash
npm install
```

Edit `src/firebase.js` with your Firebase web config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Server will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

Frontend will open on `http://localhost:3000`

## 📱 How to Use

### 1. Sign Up / Login
- Create a new account or login with existing credentials

### 2. Connect Social Media
- Click "Connect Facebook & Instagram"
- Login with your Facebook account (must be added as Tester)
- Grant all requested permissions

### 3. Generate Content
- Click "Generate Content Calendar"
- Enter your business idea (be specific!)
- AI will create a 7-day content plan

### 4. Upload Images
- Click any post in the calendar
- Upload an image for that post
- Click "Save Image"

### 5. Post to Social Media
- Click "Post Now" in the post modal
- Your content will be published to Facebook & Instagram

### 6. View Analytics
- Click "Analytics" in the navigation
- View mocked engagement data (for demo purposes)

## 🎓 College Project Notes

### What Works in Developer Mode
✅ Auto-posting to Facebook pages  
✅ Auto-posting to Instagram Business accounts  
✅ Content generation with AI  
✅ Image uploads and storage  
✅ Real-time calendar updates  

### Limitations (Developer Mode Only)
⚠️ Only works for users added as "Testers" in Meta App Dashboard  
⚠️ Won't work for general public without Meta App Review  
⚠️ Instagram requires Business Account linked to Facebook Page  
⚠️ Analytics data is mocked (static demo data)  

### Important for Demo
1. Make sure you're logged into Facebook with the Tester account
2. Ensure Instagram Business Account is properly linked
3. Test with small images first (< 5MB)
4. Keep the Meta App in Development Mode

## 🐛 Troubleshooting

### "Failed to connect to Meta"
- Verify Meta App ID and Secret in `.env`
- Check if redirect URI matches exactly: `http://localhost:5000/api/auth/meta/callback`
- Ensure you're added as a Tester in the Meta App

### "Instagram not connected"
- Make sure your Facebook Page has an Instagram Business Account
- Go to Facebook Page Settings → Instagram → Connect Account

### "Failed to generate content"
- Verify Gemini API key is correct
- Check if you have API quota remaining
- Ensure the business idea is not empty

### "Image upload failed"
- Verify Cloudinary credentials in `.env`
- Check image size (must be < 10MB)
- Ensure file format is supported (jpg, png, etc.)

### Firebase errors
- Double-check Firebase config in `client/src/firebase.js`
- Verify service account credentials in `server/.env`
- Ensure Firestore rules allow read/write for authenticated users

## 📚 API Endpoints

### Authentication
- `GET /api/auth/meta/connect_start` - Initiate Meta OAuth
- `GET /api/auth/meta/callback` - Meta OAuth callback

### User
- `POST /api/user/create` - Create user document
- `GET /api/user/profile` - Get user profile

### Content Generation
- `POST /api/gemini/generate-calendar` - Generate content calendar

### Posts
- `GET /api/post/my-posts` - Get user's posts
- `PATCH /api/post/:postId` - Update post
- `POST /api/post/now` - Publish post to social media
- `DELETE /api/post/:postId` - Delete post

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## 🎨 Features Showcase

### ✨ AI Content Generation
- Powered by Google's Gemini AI
- Generates complete 7-day content plans
- Includes captions and hashtags

### 📅 Visual Calendar
- Interactive calendar view
- Color-coded post statuses
- Click to edit/post

### 📸 Image Management
- Cloudinary integration
- Image preview before upload
- Optimized delivery

### 🚀 One-Click Posting
- Simultaneous Facebook & Instagram posting
- Real-time status updates
- Error handling and feedback

### 📊 Analytics Dashboard
- Beautiful charts with Recharts
- Follower growth tracking
- Engagement metrics

## 👨‍💻 Development

### Running in Development Mode

Backend with auto-reload:
```bash
cd server
npm run dev
```

Frontend with hot reload:
```bash
cd client
npm start
```

### Building for Production

Frontend build:
```bash
cd client
npm run build
```

Backend (use PM2 or similar):
```bash
cd server
npm start
```

## 📄 License

This is a college project for educational purposes.

## 🤝 Contributing

This is a college project, but feel free to:
- Report bugs
- Suggest improvements
- Fork for your own projects

## 📞 Support

For issues specific to:
- **Firebase**: Check [Firebase Documentation](https://firebase.google.com/docs)
- **Meta API**: Check [Meta Graph API Docs](https://developers.facebook.com/docs/graph-api)
- **Gemini**: Check [Gemini API Docs](https://ai.google.dev/docs)

---

**Note**: Remember to keep your API keys and credentials secure. Never commit `.env` files to version control!

Happy coding! 🚀✨
#   m y - a p p  
 