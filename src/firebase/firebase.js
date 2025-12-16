// Firebase core
import { initializeApp } from "firebase/app";

// Firebase services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 🔑 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb0ebw9BLZWcXc8DHfx7shCtUFAIxQmQ0",
  authDomain: "rocketform-390dc.firebaseapp.com",
  projectId: "rocketform-390dc",
  storageBucket: "rocketform-390dc.appspot.com",
  messagingSenderId: "362844142598",
  appId: "1:362844142598:web:81d7a0cb8b089cd63f9787",
  measurementId: "G-MG24MWF50C",
};

// ✅ Initialize Firebase (ONLY ONCE)
const app = initializeApp(firebaseConfig);

// ✅ Export app (IMPORTANT for storage.js)
export { app };

// Firebase exports
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (optional – production only)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics };
