// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMseOkql9XRlXyG75ovt58wRq5vBTHzNg",
  authDomain: "clon-1b57e.firebaseapp.com",
  projectId: "clon-1b57e",
  storageBucket: "clon-1b57e.firebasestorage.app",
  messagingSenderId: "61049557663",
  appId: "1:61049557663:web:a444cdd7433fab87c7c8aa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db =getFirestore(app)
