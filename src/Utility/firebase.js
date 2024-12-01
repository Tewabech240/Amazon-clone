
import firebase from "firebase/compat/app";
//auth
import {getAuth} from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";


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
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = app.firestore();