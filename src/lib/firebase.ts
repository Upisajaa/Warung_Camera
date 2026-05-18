import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZle2HVFEV1cdO3ygLVYPnAQtC_o48UMU",
  authDomain: "warung-camera.firebaseapp.com",
  projectId: "warung-camera",
  storageBucket: "warung-camera.firebasestorage.app",
  messagingSenderId: "252383281119",
  appId: "1:252383281119:web:5707e641e8796d0d458e6a",
  measurementId: "G-GLJSRP3RME",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();