import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAAlqoCVKjhzZ_YC5OhBm1upe4ZcbrYwY",
  authDomain: "test6-e56e6.firebaseapp.com",
  projectId: "test6-e56e6",
  storageBucket: "test6-e56e6.firebasestorage.app",
  messagingSenderId: "118253837100",
  appId: "1:118253837100:web:1774dad5e5ba77fed4aa89",
  measurementId: "G-V13CE4KXKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };
