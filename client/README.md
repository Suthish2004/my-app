# AI Digital Marketing Manager - Frontend Client

React-based frontend application with Firebase Authentication, interactive calendar, and social media management features.

## 📁 Project Structure

```
client/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── api/
│   │   └── axios.js         # Axios instance with auth interceptor
│   ├── components/
│   │   ├── Navbar.js        # Navigation bar
│   │   ├── AIGenerator.js   # Content generation UI
│   │   ├── Calendar.js      # react-big-calendar integration
│   │   └── PostModal.js     # Post details & publishing
│   ├── context/
│   │   └── AuthContext.js   # Firebase Auth context
│   ├── pages/
│   │   ├── Login.js         # Authentication page
│   │   ├── Dashboard.js     # Main dashboard
│   │   └── Analytics.js     # Analytics visualization
│   ├── App.js               # Main app component
│   ├── App.css              # Global styles
│   ├── index.js             # Entry point
│   ├── index.css            # Base styles
│   └── firebase.js          # Firebase configuration
├── package.json
└── .gitignore
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   Edit `src/firebase.js` with your Firebase project credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     // ... rest of config
   };
   ```

3. **Run development server:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

Application will run on `http://localhost:3000`.

## 🎨 Pages & Components

### Pages

#### Login (`/login`)
- Email/Password authentication
- Toggle between Sign Up and Sign In
- Form validation
- Error handling

#### Dashboard (`/dashboard`)
- Connection status display
- Meta OAuth integration button
- AI content generator
- Interactive content calendar
- Post management

#### Analytics (`/analytics`)
- Follower growth chart (LineChart)
- Platform distribution (PieChart)
- Weekly engagement (BarChart)
- Key metrics cards

### Components

#### Navbar
- App branding
- Navigation links (Dashboard, Analytics)
- User email display
- Logout button
- Active route highlighting

#### AIGenerator
- Business idea input form
- AI content generation
- Loading states
- Success/error feedback

#### Calendar
- react-big-calendar integration
- Real-time Firestore sync
- Color-coded post statuses:
  - 🔵 Draft (default)
  - 🟡 Scheduled
  - 🟢 Posted
- Click to open post details

#### PostModal
- Post details display (idea, caption, hashtags)
- Image upload interface
- Cloudinary integration
- Post to Facebook & Instagram
- Schedule post (mocked)
- Delete post
- Status badges

## 🔥 Firebase Integration

### Authentication
```javascript
import { useAuth } from './context/AuthContext';

// In component
const { currentUser, signup, signin, logout } = useAuth();

// Sign up
await signup(email, password);

// Sign in
await signin(email, password);

// Sign out
await logout();
```

### Firestore Real-time Updates
```javascript
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// Listen to posts
const q = query(
  collection(db, 'posts'),
  where('userId', '==', currentUser.uid)
);

const unsubscribe = onSnapshot(q, (snapshot) => {
  // Handle updates
});
```

## 🌐 API Integration

### Axios Instance with Auth
```javascript
import api from './api/axios';

// All requests automatically include Firebase auth token
const response = await api.get('/user/profile');
const data = await api.post('/gemini/generate-calendar', { businessIdea });
```

### Key API Calls

**Generate Content:**
```javascript
await api.post('/gemini/generate-calendar', {
  businessIdea: 'Your business idea here'
});
```

**Upload Image:**
```javascript
const formData = new FormData();
formData.append('image', file);
await api.post('/upload', formData);
```

**Update Post:**
```javascript
await api.patch(`/post/${postId}`, {
  imageUrl: 'https://cloudinary.com/...'
});
```

**Publish Post:**
```javascript
await api.post('/post/now', {
  postId: postId
});
```

## 🎨 Styling

### Global Styles
- Custom color scheme (purple gradient)
- Utility classes for buttons, cards, forms
- Responsive design
- Smooth animations and transitions

### Component Styles
Each component has its own CSS file:
- `Login.css` - Authentication page styles
- `Dashboard.css` - Dashboard layout and cards
- `Analytics.css` - Charts and stats styling
- `Navbar.css` - Navigation styles
- `Calendar.css` - Calendar customization
- `AIGenerator.css` - Generator form styles
- `PostModal.css` - Modal and post details

### Theme Colors
```css
Primary: #667eea (Purple)
Secondary: #764ba2 (Dark Purple)
Success: #10b981 (Green)
Warning: #f59e0b (Orange)
Danger: #ef4444 (Red)
```

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-scripts` - Create React App scripts

### Routing
- `react-router-dom` - Client-side routing

### Firebase
- `firebase` - Firebase SDK (Auth & Firestore)

### UI Components
- `react-big-calendar` - Calendar component
- `moment` - Date handling for calendar
- `recharts` - Chart library for analytics
- `lucide-react` - Icon library

### HTTP Client
- `axios` - API requests

## 🔐 Protected Routes

Routes are protected using the `ProtectedRoute` component:

```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

Unauthenticated users are redirected to `/login`.

## 📱 Responsive Design

The application is fully responsive:
- Mobile-first approach
- Breakpoint: 768px
- Touch-friendly buttons
- Collapsible navigation on mobile
- Responsive calendar view

## 🎯 User Flow

1. **Authentication**
   - User visits app → Redirected to `/login`
   - Signs up or signs in
   - Redirected to `/dashboard`

2. **Connect Social Media**
   - Clicks "Connect Facebook & Instagram"
   - OAuth flow handled by backend
   - Redirected back with connection status

3. **Generate Content**
   - Clicks "Generate Content Calendar"
   - Enters business idea
   - AI generates 7-day plan
   - Posts appear in calendar

4. **Manage Posts**
   - Clicks post in calendar
   - Modal opens with post details
   - Uploads image
   - Clicks "Post Now"
   - Content published to social media

5. **View Analytics**
   - Navigates to Analytics page
   - Views engagement metrics (demo data)

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (irreversible!)
npm run eject
```

### Environment Variables
Create `.env.local` for local overrides:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features used
- CSS Grid and Flexbox for layouts

## 🐛 Troubleshooting

### "Firebase: Error (auth/...)"
- Check Firebase config in `firebase.js`
- Verify Authentication is enabled in Firebase Console
- Ensure correct API key

### "Network Error" on API calls
- Verify backend server is running on port 5000
- Check CORS configuration in backend
- Ensure proxy in package.json: `"proxy": "http://localhost:5000"`

### Calendar not showing posts
- Check Firestore rules allow read for authenticated users
- Verify posts collection exists
- Check browser console for errors

### Image upload fails
- Verify Cloudinary credentials in backend
- Check file size (< 10MB)
- Ensure proper file format (jpg, png, etc.)

## 📝 Notes

### Mocked Features
- **Analytics data**: Static demo data (not real metrics)
- **Scheduling**: Updates status but doesn't actually schedule

### Real Features
- Firebase Authentication
- Real-time Firestore sync
- Actual API calls to backend
- Real image uploads to Cloudinary
- Actual posting to Facebook & Instagram

## 🎨 Customization

### Changing Theme Colors
Edit `App.css` and `index.css`:
```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  /* Add more CSS variables */
}
```

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `App.js`
3. Add navigation link in `Navbar.js`

### Customizing Calendar
Edit `Calendar.js` and `Calendar.css`:
- Change colors in `eventStyleGetter`
- Modify views array
- Adjust default view

## 🚀 Deployment

### Netlify/Vercel
1. Build the app: `npm run build`
2. Deploy the `build/` folder
3. Set environment variable: `REACT_APP_API_URL=your-backend-url`

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

For backend documentation, see `/server/README.md`.
For complete setup guide, see main `/README.md`.
