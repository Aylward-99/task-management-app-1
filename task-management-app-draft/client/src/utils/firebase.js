// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "task-management-system-1304.firebaseapp.com",
  projectId: "task-management-system-1304",
  storageBucket: "task-management-system-1304.firebasestorage.app",
  messagingSenderId: "844088220943",
  appId: "1:844088220943:web:ff4b92cdf68431cd1b327a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);