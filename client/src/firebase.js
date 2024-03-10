// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-acab8.firebaseapp.com",
  projectId: "mern-estate-acab8",
  storageBucket: "mern-estate-acab8.appspot.com",
  messagingSenderId: "230103847443",
  appId: "1:230103847443:web:b98dbea39b735a6639a5e6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);