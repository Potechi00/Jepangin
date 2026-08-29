import { UserProgress } from '../types';
import { GameProgressState } from '../game/gameStorage';
import { KanaMemoryRecord } from '../game/types';
import { UserProfile, UserCloudData } from './types';
import { INITIAL_PROGRESS } from '../utils/storage';

const SESSION_USER_KEY = 'jepangin_current_session_user_v1';
const USER_DATA_PREFIX = 'jepangin_userdata_v1_';
const LEGACY_MIGRATED_FLAG = 'jepangin_legacy_migrated_v1';

// Generate unique ID for guest sessions
export function generateGuestId(): string {
  return 'guest_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Get active session user
export function getStoredSessionUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Set active session user
export function setStoredSessionUser(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_USER_KEY);
    }
  } catch {
    // Ignore storage quota
  }
}

// Load user-specific container data
export function loadUserScopedData(userId: string): UserCloudData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Save user-specific container data
export function saveUserScopedData(data: UserCloudData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${USER_DATA_PREFIX}${data.userId}`, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
}

// Check if legacy local progress exists
export function hasLegacyLocalProgress(): boolean {
  if (typeof window === 'undefined') return false;
  if (localStorage.getItem(LEGACY_MIGRATED_FLAG)) return false;
  const raw = localStorage.getItem('jepangin_user_progress_v1');
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    return (parsed.totalXp && parsed.totalXp > 0) || (parsed.completedLessonIds && parsed.completedLessonIds.length > 0);
  } catch {
    return false;
  }
}

// Mark legacy as handled/migrated
export function markLegacyMigrated(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LEGACY_MIGRATED_FLAG, 'true');
}
