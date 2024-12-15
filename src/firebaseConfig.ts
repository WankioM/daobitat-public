// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDL3EgLy_fqQfdrFCcGEgff32r9w-E-e6A",
  authDomain: "zillow-b9e90.firebaseapp.com",
  projectId: "zillow-b9e90",
  storageBucket: "zillow-b9e90.appspot.com",
  messagingSenderId: "229394983752",
  appId: "1:229394983752:web:f3e04cf919348bf36c617d",
  measurementId: "G-MMXLPLKTXM"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, firestore ,storage, GoogleAuthProvider};
