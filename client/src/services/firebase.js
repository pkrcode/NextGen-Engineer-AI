import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Re-export frequently used Auth and Firestore helpers directly
export { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
export {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
  serverTimestamp,
  getDoc,
  setDoc,
} from 'firebase/firestore';

// --- Firebase Configuration --- (update projectId if needed)
const firebaseConfig = {
  apiKey: "AIzaSyDeDOxOmaodgFVA8btJFqkU-grzCRIX5Ag",
  authDomain: "adhyayanmarg.firebaseapp.com", // update if your Firebase projectId changes
  projectId: "adhyayanmarg",
  storageBucket: "adhyayanmarg.appspot.com",
  messagingSenderId: "694218688639",
  appId: "1:694218688639:web:ce94a477bd9fd36e98974a",
  measurementId: "G-495P014YZZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { db, auth };
