import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhRj6-dI3UBFt18T8MpNYX2ooykTiOPC8",
  authDomain: "pawlse-3085b.firebaseapp.com",
  projectId: "pawlse-3085b",
  storageBucket: "pawlse-3085b.firebasestorage.app",
  messagingSenderId: "966644592781",
  appId: "1:966644592781:web:30c8a6b76198cf446fb2c4",
  measurementId: "G-S51L51WGM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {db, auth};

