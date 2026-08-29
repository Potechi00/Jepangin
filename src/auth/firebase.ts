import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId if configured
export const db: Firestore = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    console.warn('Firestore connection check note:', error);
    return false;
  }
}

export {
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
};
export type { FirebaseUser };
