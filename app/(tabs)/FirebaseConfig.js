// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB57O7Bp8sMoUJWiffo4i74X6BYp5fc9G0",
  authDomain: "fdm-flat-finder.firebaseapp.com",
  projectId: "fdm-flat-finder",
  storageBucket: "fdm-flat-finder.firebasestorage.app",
  messagingSenderId: "140305843420",
  appId: "1:140305843420:web:2b17b56c05d492dee12019",
  measurementId: "G-MDSY21EYZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app); // Initialize Firestore
const db = getFirestore(app);

export { auth, firestore, db }; // Export Firestore
export default app; // Export Firebase
