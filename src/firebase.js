import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-pZIAlSI1rBZh26mgDSjDBJn1mhzUyhk",
  authDomain: "itd112-lab02.firebaseapp.com",
  projectId: "itd112-lab02",
  storageBucket: "itd112-lab02.firebasestorage.app",
  messagingSenderId: "224882466634",
  appId: "1:224882466634:web:7ad74e49be6285c9b5ebb3",
  measurementId: "G-TG92Y6RPGQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };
