import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB6D1MxZJ4u4LBNdIg0vcg4icN5ZBEEArE",
  authDomain: "hcidatabase-50e78.firebaseapp.com",
  projectId: "hcidatabase-50e78",
  storageBucket: "hcidatabase-50e78.firebasestorage.app",
  messagingSenderId: "568950853263",
  appId: "1:568950853263:web:9c0ff93627d9d59a972afa",
  measurementId: "G-289FLMCVF3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

console.log("✅ auth:", auth);
console.log("✅ provider:", provider);
