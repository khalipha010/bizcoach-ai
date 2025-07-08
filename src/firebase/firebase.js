import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object (hardcoded)
const firebaseConfig = {
  apiKey: "AIzaSyBI1X8Tv2SEmaXoa_gZYMx5XQCNsHJLBQ8",
  authDomain: "bizcoach-ai.firebaseapp.com",
  projectId: "bizcoach-ai",
  storageBucket: "bizcoach-ai.firebasestorage.app",
  messagingSenderId: "52961028924",
  appId: "1:52961028924:web:a5fb496ea4d9af396f0c39",
  measurementId: "G-1RCMQQP5YL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };