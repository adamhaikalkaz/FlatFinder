import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyB57O7Bp8sMoUJWiffo4i74X6BYp5fc9G0",
  authDomain: "fdm-flat-finder.firebaseapp.com",
  projectId: "fdm-flat-finder",
  storageBucket: "fdm-flat-finder.firebasestorage.app",
  messagingSenderId: "140305843420",
  appId: "1:140305843420:web:2b17b56c05d492dee12019",
  measurementId: "G-MDSY21EYZE"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const firestore = getFirestore(app); 
const db = getFirestore(app);
const storage = getStorage(app)

export { auth, firestore, db, storage }; 
export default app; 
