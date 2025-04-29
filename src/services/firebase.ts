import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwccvhTDH3YS-fgepF3LW5cEmATq5J5TI",
  authDomain: "shopping-store-project-97.firebaseapp.com",
  projectId: "shopping-store-project-97",
  storageBucket: "shopping-store-project-97.firebasestorage.app",
  messagingSenderId: "222768254926",
  appId: "1:222768254926:web:c9a3ac3f704e575ad7a59f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db };
