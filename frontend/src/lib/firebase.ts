import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBctnUz5zaPnSC36gImgl5IbTF1F8CU8wg",
  authDomain: "smog-setu.firebaseapp.com",
  projectId: "smog-setu",
  storageBucket: "smog-setu.firebasestorage.app",
  messagingSenderId: "483911477708",
  appId: "1:483911477708:web:b84c6f35b1d7a7f740d569",
  measurementId: "G-S0FX0XNTLJ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
