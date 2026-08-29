import { UserProgress } from '../types';

const STORAGE_KEY = 'jepangin_user_progress_v1';

export const AVATARS = [
  { id: 'cat', emoji: '🐱', name: 'Kucing Maneki Neko' },
  { id: 'sakura', emoji: '🌸', name: 'Bunga Sakura' },
  { id: 'fuji', emoji: '🗻', name: 'Gunung Fuji' },
  { id: 'kitsune', emoji: '🦊', name: 'Rubah Kitsune' },
  { id: 'onigiri', emoji: '🍙', name: 'Onigiri Ceria' },
  { id: 'pagoda', emoji: '🏯', name: 'Pagoda Jepang' },
];

export const INITIAL_PROGRESS: UserProgress = {
  userName: 'Teman Belajar',
  avatar: '🐱',
  currentStreak: 3,
  lastStudyDate: new Date().toISOString().split('T')[0],
  totalXp: 150,
  level: 1,
  completedLessonIds: [],
  activeLessonId: 'hira-1',
  largeFontMode: false,
  soundEffects: true,
  autoVoice: true,
  selectedLandmark: 'fuji',
  sceneryTime: 'sunset',
  livingEffects: true,
};

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors
  }
}

export function calculateLevel(xp: number): number {
  // Level 1: 0 - 99 XP
  // Level 2: 100 - 249 XP
  // Level 3: 250 - 449 XP
  // Level 4: 450 - 699 XP
  // Level 5: 700+ XP
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 450) return 3;
  if (xp < 700) return 4;
  return Math.min(10, Math.floor((xp - 700) / 300) + 5);
}

export function getLevelTitle(level: number): string {
  switch (level) {
    case 1:
      return 'Pemula Baru (Shoshinsha)';
    case 2:
      return 'Pembelajar Rajin';
    case 3:
      return 'Penjelajah Huruf';
    case 4:
      return 'Jagoan Kosakata';
    case 5:
      return 'Ahli Percakapan';
    default:
      return 'Pendekar Bahasa Jepang';
  }
}
