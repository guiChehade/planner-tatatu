// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCc8brYHVLh2PCnmJdAGkmMkVUTGutl-Zg",
  authDomain: "planner-tatatu.firebaseapp.com",
  projectId: "planner-tatatu",
  storageBucket: "planner-tatatu.firebasestorage.app",
  messagingSenderId: "417996913330",
  appId: "1:417996913330:web:04473fe823177033f327ab",
  measurementId: "G-C4GQH5T470"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

