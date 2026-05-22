// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGeHeUwn23nhFYGASEXmZnnmU4fj7Gs48",
  authDomain: "ai-chatbot-1b986.firebaseapp.com",
  projectId: "ai-chatbot-1b986",
  storageBucket: "ai-chatbot-1b986.firebasestorage.app",
  messagingSenderId: "477877956920",
  appId: "1:477877956920:web:35e9221b9621be56c251cd",
  measurementId: "G-0WQ0VWRPF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, analytics };
