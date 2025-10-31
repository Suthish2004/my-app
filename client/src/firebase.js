import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace with your actual Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7LpqPp4CB2BaQalQ0bVTfXjqln3ah1w0",
  authDomain: "ai-digital-marketing-assistant.firebaseapp.com",
  projectId: "ai-digital-marketing-assistant",
  storageBucket: "ai-digital-marketing-assistant.firebasestorage.app",
  messagingSenderId: "911604908625",
  appId: "1:911604908625:web:2ccb8fbf0a01a7b0b36e70",
  measurementId: "G-5ZZ12HJQDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
