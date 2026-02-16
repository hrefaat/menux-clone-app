import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AuauPBAqutaS104IooOg1v6I",
  authDomain: "menux-app-85f78.firebaseapp.com",
  projectId: "menux-app-85f78",
  storageBucket: "menux-app-85f78.firebasestorage.app",
  messagingSenderId: "963015057715",
  appId: "1:963015057715:web:53064e2077fc6c6bb99e46"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
