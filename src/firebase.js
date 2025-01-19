import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEy6Sh4rk9WiJHyueMVYhnRmGUeCsDQQs",
  authDomain: "signin-88f3a.firebaseapp.com",
  projectId: "signin-88f3a",
  storageBucket: "signin-88f3a.firebasestorage.app",
  messagingSenderId: "105171186737",
  appId: "1:105171186737:web:cb685e4b96161941b51110"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { firestore, auth };