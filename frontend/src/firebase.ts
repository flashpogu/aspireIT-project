// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "authapp-6afcb.firebaseapp.com",
  projectId: "authapp-6afcb",
  storageBucket: "authapp-6afcb.appspot.com",
  messagingSenderId: "678404510913",
  appId: "1:678404510913:web:184bc525d0ebf35ae73040",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
