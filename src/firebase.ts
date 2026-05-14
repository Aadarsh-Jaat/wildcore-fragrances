import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDC2SvcHNWR5aa8Cu7tr4oes4CabcYkdC8",
  authDomain: "wildcore-fragrances.firebaseapp.com",
  projectId: "wildcore-fragrances",
  storageBucket: "wildcore-fragrances.firebasestorage.app",
  messagingSenderId: "907985470536",
  appId: "1:907985470536:web:42ad7598ac9ce5dca5047d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);