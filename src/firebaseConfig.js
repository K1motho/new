// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBkvzfz5O5qoSl6vOnbOpcy5UVA-G8t6YI",
  authDomain: "auth-d36dc.firebaseapp.com",
  projectId: "auth-d36dc",
  storageBucket: "auth-d36dc.appspot.com",
  messagingSenderId: "153250685398",
  appId: "1:153250685398:web:b9f64c463d5067d016c477",
  measurementId: "G-GG0HX03WG1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

