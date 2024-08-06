// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "orm-estate.firebaseapp.com",
  projectId: "orm-estate",
  storageBucket: "orm-estate.appspot.com",
  messagingSenderId: "11889534076",
  appId: "1:11889534076:web:23b0455b349567d0e155f9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);