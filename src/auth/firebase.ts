import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously as fbSignInAnonymously,
  GoogleAuthProvider,
  signInWithPopup as fbSignInWithPopup,
  linkWithPopup as fbLinkWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import rawFirebaseConfig from '../../firebase-applet-config.json';

// Safe check if running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safe initialization of Firebase App
let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firestoreDbInstance: Firestore | null = null;
let isFirebaseInitialized = false;

try {
  if (isBrowser && rawFirebaseConfig && (rawFirebaseConfig as any).apiKey) {
    if (getApps().length === 0) {
      firebaseAppInstance = initializeApp(rawFirebaseConfig);
    } else {
      firebaseAppInstance = getApp();
    }

    if (firebaseAppInstance) {
      try {
        firebaseAuthInstance = getAuth(firebaseAppInstance);
      } catch (authInitErr) {
        console.warn('Firebase Auth initialization warning (will use local fallback):', authInitErr);
      }

      try {
        const dbId = (rawFirebaseConfig as any).firestoreDatabaseId || undefined;
        try {
          firestoreDbInstance = initializeFirestore(
            firebaseAppInstance,
            { experimentalAutoDetectLongPolling: true },
            dbId
          );
        } catch {
          firestoreDbInstance = getFirestore(firebaseAppInstance, dbId);
        }
      } catch (dbInitErr) {
        console.warn('Firestore initialization warning (will use local fallback):', dbInitErr);
      }

      isFirebaseInitialized = true;
    }
  }
} catch (globalInitErr) {
  console.warn('Firebase global initialization note: operating in offline-first mode.', globalInitErr);
}

// Exported Auth instance (safe proxy if null)
export const auth: Auth = firebaseAuthInstance as Auth;

// Exported Firestore instance
export const db: Firestore = firestoreDbInstance as Firestore;

export const isFirebaseReady = (): boolean => {
  return isFirebaseInitialized && !!firebaseAuthInstance;
};

// Safe Google Auth Provider
let providerInstance: GoogleAuthProvider;
try {
  providerInstance = new GoogleAuthProvider();
  providerInstance.setCustomParameters({
    prompt: 'select_account',
  });
} catch {
  providerInstance = {} as GoogleAuthProvider;
}
export const googleProvider = providerInstance;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Resilient non-crashing Firestore error handler
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const currentFbUser = firebaseAuthInstance?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentFbUser?.uid,
      email: currentFbUser?.email,
      emailVerified: currentFbUser?.emailVerified,
      isAnonymous: currentFbUser?.isAnonymous,
      tenantId: currentFbUser?.tenantId,
      providerInfo: currentFbUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.info('Firestore operation note:', errInfo.error);
  return errInfo;
}

// Safe wrapper for onAuthStateChanged that never fails
export function onAuthStateChanged(
  authObj: Auth | null,
  nextOrObserver: (user: FirebaseUser | null) => void,
  errorCallback?: (error: Error) => void
): () => void {
  if (!authObj || !isFirebaseInitialized) {
    // If Firebase Auth is not available, immediately invoke with null user
    setTimeout(() => {
      try {
        nextOrObserver(null);
      } catch (e) {
        console.warn('Auth callback error in offline mode:', e);
      }
    }, 50);
    return () => {};
  }

  try {
    return fbOnAuthStateChanged(
      authObj,
      nextOrObserver,
      (err) => {
        console.warn('Firebase onAuthStateChanged notice:', err);
        if (errorCallback) errorCallback(err);
        else nextOrObserver(null);
      }
    );
  } catch (err) {
    console.warn('Failed to attach onAuthStateChanged listener, falling back to local:', err);
    setTimeout(() => nextOrObserver(null), 50);
    return () => {};
  }
}

// Safe wrapper for signInAnonymously
export async function signInAnonymously(authObj: Auth | null) {
  if (!authObj || !isFirebaseInitialized) {
    throw new Error('Firebase auth offline');
  }
  return fbSignInAnonymously(authObj);
}

// Safe wrapper for signInWithPopup
export async function signInWithPopup(authObj: Auth | null, provider: GoogleAuthProvider) {
  if (!authObj || !isFirebaseInitialized) {
    throw new Error('Firebase auth offline');
  }
  return fbSignInWithPopup(authObj, provider);
}

// Safe wrapper for linkWithPopup
export async function linkWithPopup(user: FirebaseUser, provider: GoogleAuthProvider) {
  if (!firebaseAuthInstance || !isFirebaseInitialized) {
    throw new Error('Firebase auth offline');
  }
  return fbLinkWithPopup(user, provider);
}

// Safe wrapper for signOut
export async function signOut(authObj: Auth | null) {
  if (!authObj || !isFirebaseInitialized) {
    return;
  }
  return fbSignOut(authObj);
}

// Test connection on boot gracefully without throwing
export async function testFirestoreConnection(): Promise<boolean> {
  if (!firestoreDbInstance) return false;
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('connection-timeout')), 2500)
    );
    await Promise.race([
      getDocFromServer(doc(firestoreDbInstance, 'test', 'connection')),
      timeoutPromise,
    ]);
    return true;
  } catch {
    return false;
  }
}

export {
  doc,
  getDoc,
  setDoc,
};
export type { FirebaseUser };
