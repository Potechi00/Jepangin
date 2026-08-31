import { GameProgressState } from '../game/gameStorage';
import { KanaMemoryRecord } from '../game/types';
import { UserProfile, UserCloudData } from './types';

const SESSION_USER_KEY = 'jepangin_current_session_user_v1';
const USER_DATA_PREFIX = 'jepangin_userdata_v1_';
const LEGACY_MIGRATED_FLAG = 'jepangin_legacy_migrated_v1';

// In-memory fallback if localStorage is blocked by browser policies
const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // Fallback to memory
  }
  return memoryStore[key] || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {
    // Fallback to memory
  }
  memoryStore[key] = value;
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }
  } catch {
    // Fallback to memory
  }
  delete memoryStore[key];
}

// Generate unique ID for guest sessions
export function generateGuestId(): string {
  return 'guest_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Get active session user
export function getStoredSessionUser(): UserProfile | null {
  try {
    const raw = safeGetItem(SESSION_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Set active session user
export function setStoredSessionUser(user: UserProfile | null): void {
  try {
    if (user) {
      safeSetItem(SESSION_USER_KEY, JSON.stringify(user));
    } else {
      safeRemoveItem(SESSION_USER_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

// Load user-specific container data
export function loadUserScopedData(userId: string): UserCloudData | null {
  try {
    const raw = safeGetItem(`${USER_DATA_PREFIX}${userId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Save user-specific container data
export function saveUserScopedData(data: UserCloudData): void {
  try {
    safeSetItem(`${USER_DATA_PREFIX}${data.userId}`, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
}

// Check if legacy local progress exists
export function hasLegacyLocalProgress(): boolean {
  try {
    if (safeGetItem(LEGACY_MIGRATED_FLAG)) return false;
    const raw = safeGetItem('jepangin_user_progress_v1');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return (parsed.totalXp && parsed.totalXp > 0) || (parsed.completedLessonIds && parsed.completedLessonIds.length > 0);
  } catch {
    return false;
  }
}

// Mark legacy as handled/migrated
export function markLegacyMigrated(): void {
  try {
    safeSetItem(LEGACY_MIGRATED_FLAG, 'true');
  } catch {
    // Ignore
  }
}
