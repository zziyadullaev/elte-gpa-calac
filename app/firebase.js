// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD20Cq_KSDs26hbzRZsLe88JBT-G02-_-Q",
  authDomain: "elte-gpa-calcula.firebaseapp.com",
  projectId: "elte-gpa-calcula",
  storageBucket: "elte-gpa-calcula.appspot.com",
  messagingSenderId: "419262122737",
  appId: "1:419262122737:web:158131431f7507f9d27750"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);