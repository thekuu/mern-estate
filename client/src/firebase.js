// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBa9eg9GNjXmRJ1GQgbbQzqVxaYF29HJ-I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "confident-arcana-59v0l.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "confident-arcana-59v0l",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "confident-arcana-59v0l.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "107166110234",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:107166110234:web:62065f835b8ee3d16f37a3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);