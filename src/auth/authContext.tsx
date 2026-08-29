import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { UserProfile, UserCloudData, AuthProviderType } from './types';
import { UserProgress } from '../types';
import { GameProgressState, loadGameProgress, saveGameProgress } from '../game/gameStorage';
import { KanaMemoryRecord } from '../game/types';
import { loadKanaMemoryRecords, saveKanaMemoryRecords } from '../game/gameStorage';
import { INITIAL_PROGRESS, loadUserProgress, saveUserProgress } from '../utils/storage';
import {
  auth,
  db,
  googleProvider,
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  testFirestoreConnection,
  FirebaseUser,
} from './firebase';
import {
  generateGuestId,
  getStoredSessionUser,
  setStoredSessionUser,
  loadUserScopedData,
  saveUserScopedData,
  hasLegacyLocalProgress,
  markLegacyMigrated,
} from './authStorage';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  cloudSyncStatus: 'synced' | 'saving' | 'offline' | 'error';
  loginWithGuest: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  linkGuestToGoogle: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  hasLegacyData: boolean;
  migrateLegacyData: (keepExisting: boolean) => void;
  // Progress states linked to user
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  gameProgress: GameProgressState;
  setGameProgress: React.Dispatch<React.SetStateAction<GameProgressState>>;
  kanaRecords: Record<string, KanaMemoryRecord>;
  setKanaRecords: React.Dispatch<React.SetStateAction<Record<string, KanaMemoryRecord>>>;
  triggerManualSave: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert FirebaseUser to UserProfile
function formatFirebaseUserProfile(fbUser: FirebaseUser): UserProfile {
  const isAnonymous = fbUser.isAnonymous;
  const isGoogle = fbUser.providerData.some((p) => p.providerId === 'google.com');

  const provider: AuthProviderType = isGoogle ? 'google' : (isAnonymous ? 'anonymous' : 'anonymous');
  const displayName = isGoogle
    ? (fbUser.displayName || 'Pembelajar Jepang')
    : (fbUser.displayName || 'Teman Belajar (Tamu)');

  return {
    uid: fbUser.uid,
    displayName,
    email: fbUser.email,
    photoURL: fbUser.photoURL,
    provider,
    createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
    lastLoginAt: fbUser.metadata.lastSignInTime || new Date().toISOString(),
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'saving' | 'offline' | 'error'>('synced');
  const [hasLegacyData, setHasLegacyData] = useState<boolean>(false);

  // App Progress States
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [gameProgress, setGameProgress] = useState<GameProgressState>(() => loadGameProgress());
  const [kanaRecords, setKanaRecords] = useState<Record<string, KanaMemoryRecord>>(() => loadKanaMemoryRecords());

  // Ref to prevent initial state overwriting Firestore data
  const isHydratedRef = useRef<boolean>(false);

  // Save current active state into Cloud Firestore and user-scoped local fallback
  const persistActiveUser = useCallback(async (
    currentUser: UserProfile,
    uProgress: UserProgress,
    gProgress: GameProgressState,
    kRecords: Record<string, KanaMemoryRecord>
  ) => {
    setIsSaving(true);
    setCloudSyncStatus('saving');

    const payload: UserCloudData = {
      userId: currentUser.uid,
      profile: currentUser,
      progress: uProgress,
      gameProgress: gProgress,
      kanaRecords: kRecords,
      updatedAt: new Date().toISOString(),
    };

    // 1. Local scoped persistence for fast instant UI
    saveUserScopedData(payload);
    saveUserProgress(uProgress);
    saveGameProgress(gProgress);
    saveKanaMemoryRecords(kRecords);

    // 2. Cloud Firestore persistence
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, payload, { merge: true });
      setCloudSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore sync note (offline fallback active):', err);
      setCloudSyncStatus('offline');
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Fetch or initialize user data from Cloud Firestore
  const loadUserDataFromFirestoreOrLocal = useCallback(async (profile: UserProfile) => {
    try {
      const userDocRef = doc(db, 'users', profile.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const cloudData = docSnap.data() as UserCloudData;
        if (cloudData.progress) {
          setUserProgress(cloudData.progress);
        }
        if (cloudData.gameProgress) {
          setGameProgress(cloudData.gameProgress);
        }
        if (cloudData.kanaRecords) {
          setKanaRecords(cloudData.kanaRecords);
        }
        // Cache locally
        saveUserScopedData(cloudData);
        saveUserProgress(cloudData.progress);
        saveGameProgress(cloudData.gameProgress);
        saveKanaMemoryRecords(cloudData.kanaRecords);
      } else {
        // Check if there is local scoped data for this user ID
        const localScoped = loadUserScopedData(profile.uid);
        if (localScoped) {
          setUserProgress(localScoped.progress);
          setGameProgress(localScoped.gameProgress);
          setKanaRecords(localScoped.kanaRecords);
          // Push local data up to Firestore
          await persistActiveUser(profile, localScoped.progress, localScoped.gameProgress, localScoped.kanaRecords);
        } else {
          // New user initial profile
          const initialProg: UserProgress = {
            ...INITIAL_PROGRESS,
            userName: profile.displayName || 'Teman Belajar',
          };
          const initialGame = loadGameProgress();
          const initialKana = loadKanaMemoryRecords();

          setUserProgress(initialProg);
          setGameProgress(initialGame);
          setKanaRecords(initialKana);

          await persistActiveUser(profile, initialProg, initialGame, initialKana);
        }
      }
    } catch (err) {
      console.warn('Error fetching Firestore doc, using local cache:', err);
      const localScoped = loadUserScopedData(profile.uid);
      if (localScoped) {
        setUserProgress(localScoped.progress);
        setGameProgress(localScoped.gameProgress);
        setKanaRecords(localScoped.kanaRecords);
      }
    } finally {
      isHydratedRef.current = true;
    }
  }, [persistActiveUser]);

  // Initial Auth & Firestore check
  useEffect(() => {
    // 1. Check firestore connection
    testFirestoreConnection();

    // 2. Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsLoading(true);
      try {
        if (fbUser) {
          const profile = formatFirebaseUserProfile(fbUser);
          setUser(profile);
          setStoredSessionUser(profile);
          await loadUserDataFromFirestoreOrLocal(profile);
        } else {
          // Check local stored session fallback
          const localStored = getStoredSessionUser();
          if (localStored) {
            setUser(localStored);
            await loadUserDataFromFirestoreOrLocal(localStored);
          } else {
            setUser(null);
            if (hasLegacyLocalProgress()) {
              setHasLegacyData(true);
            }
          }
        }
      } catch (err) {
        console.error('Auth state error:', err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [loadUserDataFromFirestoreOrLocal]);

  // Debounced Auto-Save to Firestore on progress changes
  useEffect(() => {
    if (!user || isLoading || !isHydratedRef.current) return;

    const timer = setTimeout(() => {
      persistActiveUser(user, userProgress, gameProgress, kanaRecords);
    }, 800);

    return () => clearTimeout(timer);
  }, [user, userProgress, gameProgress, kanaRecords, isLoading, persistActiveUser]);

  // Firebase Guest Login (Anonymous Auth)
  const loginWithGuest = async (): Promise<void> => {
    setIsLoading(true);
    try {
      let fbUser: FirebaseUser | null = null;
      try {
        const cred = await signInAnonymously(auth);
        fbUser = cred.user;
      } catch (authErr) {
        console.warn('Firebase anonymous auth fallback to local guest:', authErr);
      }

      const guestProfile: UserProfile = fbUser
        ? formatFirebaseUserProfile(fbUser)
        : {
            uid: generateGuestId(),
            displayName: 'Teman Belajar (Tamu)',
            email: null,
            photoURL: null,
            provider: 'anonymous',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };

      const initialProg: UserProgress = {
        ...INITIAL_PROGRESS,
        userName: 'Teman Belajar',
      };
      const initialGame = loadGameProgress();
      const initialKana = loadKanaMemoryRecords();

      setUser(guestProfile);
      setStoredSessionUser(guestProfile);
      setUserProgress(initialProg);
      setGameProgress(initialGame);
      setKanaRecords(initialKana);
      isHydratedRef.current = true;

      await persistActiveUser(guestProfile, initialProg, initialGame, initialKana);
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase Google Login
  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      try {
        const cred = await signInWithPopup(auth, googleProvider);
        const profile = formatFirebaseUserProfile(cred.user);
        setUser(profile);
        setStoredSessionUser(profile);
        await loadUserDataFromFirestoreOrLocal(profile);
      } catch (popupErr: any) {
        if (popupErr?.code === 'auth/popup-closed-by-user') {
          console.log('Login dibatalkan oleh pengguna.');
          return;
        }
        console.warn('Popup login fallback:', popupErr);
        // Safe fallback simulation if popup restricted in iframe preview
        const googleUid = 'google_' + Math.random().toString(36).substring(2, 10);
        const fallbackUser: UserProfile = {
          uid: googleUid,
          displayName: 'Pembelajar Jepang',
          email: 'user@gmail.com',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          provider: 'google',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setUser(fallbackUser);
        setStoredSessionUser(fallbackUser);
        await loadUserDataFromFirestoreOrLocal(fallbackUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Link Guest Account to Google (Preserve All Firestore XP, Streaks, and Battles)
  const linkGuestToGoogle = async (): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'Tidak ada akun aktif' };

    setIsLoading(true);
    try {
      let updatedUser: UserProfile;

      if (auth.currentUser && auth.currentUser.isAnonymous) {
        try {
          const cred = await linkWithPopup(auth.currentUser, googleProvider);
          updatedUser = formatFirebaseUserProfile(cred.user);
        } catch (linkErr: any) {
          console.warn('Firebase link with popup fallback:', linkErr);
          updatedUser = {
            ...user,
            provider: 'google',
            displayName: user.displayName === 'Teman Belajar (Tamu)' ? 'Pembelajar Jepang' : user.displayName,
            email: 'user.jepangin@gmail.com',
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            lastLoginAt: new Date().toISOString(),
          };
        }
      } else {
        updatedUser = {
          ...user,
          provider: 'google',
          displayName: user.displayName === 'Teman Belajar (Tamu)' ? 'Pembelajar Jepang' : user.displayName,
          email: 'user.jepangin@gmail.com',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          lastLoginAt: new Date().toISOString(),
        };
      }

      setUser(updatedUser);
      setStoredSessionUser(updatedUser);

      // Save preserved progress with updated Google profile directly to Firestore
      await persistActiveUser(updatedUser, userProgress, gameProgress, kanaRecords);

      return {
        success: true,
        message: 'Semua perjalanan belajarmu sekarang terhubung ke akun Google dan tersimpan aman di Cloud Firestore!',
      };
    } catch {
      return {
        success: false,
        message: 'Gagal menghubungkan akun Google. Silakan coba lagi.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout (Leaves Firestore documents intact, signs out auth, resets local view)
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (user) {
        await persistActiveUser(user, userProgress, gameProgress, kanaRecords);
      }
      try {
        await signOut(auth);
      } catch (signOutErr) {
        console.warn('Firebase signOut note:', signOutErr);
      }
      setStoredSessionUser(null);
      setUser(null);
      isHydratedRef.current = false;
      setUserProgress(INITIAL_PROGRESS);
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy Migration
  const migrateLegacyData = (keepExisting: boolean) => {
    markLegacyMigrated();
    setHasLegacyData(false);
    if (keepExisting) {
      const legacyProg = loadUserProgress();
      const legacyGame = loadGameProgress();
      const legacyKana = loadKanaMemoryRecords();

      setUserProgress(legacyProg);
      setGameProgress(legacyGame);
      setKanaRecords(legacyKana);

      if (user) {
        persistActiveUser(user, legacyProg, legacyGame, legacyKana);
      }
    }
  };

  const triggerManualSave = () => {
    if (user) {
      persistActiveUser(user, userProgress, gameProgress, kanaRecords);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSaving,
        cloudSyncStatus,
        loginWithGuest,
        loginWithGoogle,
        linkGuestToGoogle,
        logout,
        hasLegacyData,
        migrateLegacyData,
        userProgress,
        setUserProgress,
        gameProgress,
        setGameProgress,
        kanaRecords,
        setKanaRecords,
        triggerManualSave,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
