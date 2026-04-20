import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Այստեղ տեղադրիր քո պատճենած կոդը Firebase-ից
const firebaseConfig = {
  apiKey: "ՔՈ_API_KEY",
  authDomain: "student-market-a97d7.firebaseapp.com",
  projectId: "student-market-a97d7",
  storageBucket: "student-market-a97d7.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);