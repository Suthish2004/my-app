# AI Digital Marketing Manager - Backend Server

Node.js/Express backend server with Firebase Admin, Gemini AI, Cloudinary, and Meta Graph API integration.

## 📁 Project Structure

```
server/
├── middleware/
│   └── auth.js           # Firebase token verification
├── routes/
│   ├── auth.js           # Meta OAuth endpoints
│   ├── gemini.js         # AI content generation
│   ├── upload.js         # Image upload to Cloudinary
│   ├── post.js           # Post management & publishing
│   └── user.js           # User profile management
├── index.js              # Server entry point
├── package.json
├── .env.example
└── .gitignore
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Run in development mode:**
   ```bash
   npm run dev
   ```

4. **Run in production mode:**
   ```bash
   npm start
   ```

Server will run on `http://localhost:5000` by default.

## 🔑 Environment Variables

All credentials must be configured in `.env`:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Meta (Facebook/Instagram)
META_APP_ID=
META_APP_SECRET=
META_REDIRECT_URI=http://localhost:5000/api/auth/meta/callback

# Gemini AI
GEMINI_API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Authentication
```
GET /api/auth/meta/connect_start?uid={userId}
```
Redirects user to Meta OAuth login.

```
GET /api/auth/meta/callback?code={code}&state={userId}
```
Handles Meta OAuth callback, exchanges tokens, saves to Firestore.

### User Management
```
POST /api/user/create
Headers: Authorization: Bearer {firebaseToken}
Body: { email, displayName }
```
Creates user document in Firestore.

```
GET /api/user/profile
Headers: Authorization: Bearer {firebaseToken}
```
Returns user profile with connection status.

### Content Generation
```
POST /api/gemini/generate-calendar
Headers: Authorization: Bearer {firebaseToken}
Body: { businessIdea: string }
```
Generates 7-day content calendar using Gemini AI.

### Post Management
```
GET /api/post/my-posts
Headers: Authorization: Bearer {firebaseToken}
```
Returns all posts for authenticated user.

```
PATCH /api/post/:postId
Headers: Authorization: Bearer {firebaseToken}
Body: { imageUrl?, status?, postDate? }
```
Updates post data.

```
POST /api/post/now
Headers: Authorization: Bearer {firebaseToken}
Body: { postId: string }
```
Publishes post to Facebook & Instagram.

```
DELETE /api/post/:postId
Headers: Authorization: Bearer {firebaseToken}
```
Deletes a post.

### Image Upload
```
POST /api/upload
Headers: Authorization: Bearer {firebaseToken}
Content-Type: multipart/form-data
Body: FormData with 'image' field
```
Uploads image to Cloudinary, returns secure URL.

## 🔐 Authentication

All protected endpoints require Firebase ID token in Authorization header:

```
Authorization: Bearer {firebaseIdToken}
```

The `verifyToken` middleware validates the token and attaches user info to `req.user` and `req.uid`.

## 🗄️ Firestore Schema

### Users Collection
```javascript
users/{uid}
{
  email: string,
  displayName: string?,
  createdAt: timestamp,
  metaAccessToken: string?,
  pageId: string?,
  pageName: string?,
  instagramBusinessId: string?,
  metaConnectedAt: timestamp?
}
```

### Posts Collection
```javascript
posts/{postId}
{
  userId: string,
  day: number (1-7),
  idea: string,
  caption: string,
  hashtags: array<string>,
  status: 'draft' | 'scheduled' | 'posted',
  imageUrl: string?,
  postDate: timestamp?,
  createdAt: timestamp,
  updatedAt: timestamp?,
  postedAt: timestamp?,
  postResults: {
    facebook: { success, postId?, error? },
    instagram: { success, postId?, error? }
  }?
}
```

## 🤖 AI Content Generation

The Gemini API generates structured content:

**Input:**
```json
{
  "businessIdea": "A coffee shop in Chennai"
}
```

**Output:**
```json
{
  "posts": [
    {
      "day": 1,
      "idea": "Grand opening announcement",
      "caption": "We're opening our doors! Join us for freshly brewed coffee...",
      "hashtags": ["#CoffeeShop", "#Chennai", "#GrandOpening"]
    }
    // ... 6 more posts
  ]
}
```

## 📱 Meta Graph API Integration

### Facebook Posting
```
POST /v18.0/{page-id}/photos
{
  url: imageUrl,
  caption: message,
  access_token: pageAccessToken
}
```

### Instagram Posting (2-step process)
```
1. Create Container:
POST /v18.0/{ig-business-id}/media
{
  image_url: imageUrl,
  caption: message,
  access_token: pageAccessToken
}

2. Publish Container:
POST /v18.0/{ig-business-id}/media_publish
{
  creation_id: containerId,
  access_token: pageAccessToken
}
```

## 📦 Dependencies

### Core
- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Firebase
- `firebase-admin` - Admin SDK for Firestore & Auth

### APIs
- `@google/generative-ai` - Gemini AI
- `cloudinary` - Image storage
- `axios` - HTTP client for Meta API

### File Upload
- `multer` - Multipart/form-data handling

### Development
- `nodemon` - Auto-restart on changes

## 🛠️ Development Tips

### Testing Meta OAuth Flow
1. Ensure Meta App is in Development Mode
2. Add yourself as a Tester in Meta App Dashboard
3. Use exact redirect URI: `http://localhost:5000/api/auth/meta/callback`

### Debugging
- Check server logs for detailed error messages
- Use Postman/Thunder Client to test endpoints
- Verify Firebase Admin SDK initialization
- Check Firestore security rules

### Common Issues

**"Invalid Firebase credentials"**
- Ensure private key has proper `\n` line breaks
- Wrap private key in double quotes in `.env`

**"Meta OAuth failed"**
- Verify App ID and Secret
- Check redirect URI matches exactly
- Ensure user is added as Tester

**"Cloudinary upload failed"**
- Verify cloud name, API key, and secret
- Check image size (10MB limit)

## 📝 Notes

- This server is designed for development/demo purposes
- For production, add rate limiting, input validation, and proper error logging
- Consider using environment-specific configs
- Set up proper CORS policies for production

## 🔒 Security Considerations

1. **Never commit `.env` file**
2. **Rotate API keys regularly**
3. **Use HTTPS in production**
4. **Implement rate limiting**
5. **Validate all user inputs**
6. **Use helmet.js for security headers**
7. **Encrypt sensitive data in Firestore**

---

For frontend integration, see the main README.md in the project root.
