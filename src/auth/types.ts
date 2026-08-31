import { UserProgress } from '../types';
import { GameProgressState } from '../game/gameStorage';
import { KanaMemoryRecord } from '../game/types';
import { ReadingProgressState } from '../game/readingTypes';

export type AuthProviderType = 'google' | 'anonymous';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  provider: AuthProviderType;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserCloudData {
  userId: string;
  profile: UserProfile;
  progress: UserProgress;
  gameProgress: GameProgressState;
  kanaRecords: Record<string, KanaMemoryRecord>;
  readingProgress?: ReadingProgressState;
  updatedAt: string;
}
