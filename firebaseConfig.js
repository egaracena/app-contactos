import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2VVLUjNudBIMErEM0bxzGMzeKaNpvK1c",
  authDomain: "app-contactos-ca4e3.firebaseapp.com",
  projectId: "app-contactos-ca4e3",
  storageBucket: "app-contactos-ca4e3.firebasestorage.app",
  messagingSenderId: "585495337108",
  appId: "1:585495337108:web:2e894b8076bb2abda1bc81"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };