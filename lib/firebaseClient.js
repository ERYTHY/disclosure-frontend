// lib/firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCeym_vDLERkC457afL1L1OT1CeIKregwU",
  authDomain: "disclosere-afa15.firebaseapp.com",
  projectId: "disclosere-afa15",
  storageBucket: "disclosere-afa15.appspot.com",
  messagingSenderId: "328318389694",
  appId: "1:328318389694:web:bb8f6cc5157fe2e802bdef",
  measurementId: "G-6TWS8T6E8D"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { auth };
