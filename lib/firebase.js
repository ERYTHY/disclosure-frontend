// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCeym_vDLERkC457afL1L1OT1CeIKregwU",
  authDomain: "disclosere-afa15.firebaseapp.com",
  projectId: "disclosere-afa15",
  storageBucket: "disclosere-afa15.appspot.com",
  messagingSenderId: "328318389694",
  appId: "1:328318389694:web:bb8f6cc5157fe2e802bdef",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
