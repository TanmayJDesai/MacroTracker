// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBaFTknvhfn_-R9zzABoRwql0Tb09HfdoA",
  authDomain: "macrotracker-b0771.firebaseapp.com",
  projectId: "macrotracker-b0771",
  storageBucket: "macrotracker-b0771.firebasestorage.app",
  messagingSenderId: "759573337659",
  appId: "1:759573337659:web:ab28f0b885706c03c3ee1e",
  measurementId: "G-R2XJ2ZS2P3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app);