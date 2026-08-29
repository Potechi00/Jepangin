import { KanaMemoryRecord } from './types';
import { ALL_KANA_ITEMS } from './kanaData';

const STORAGE_KEY_RECORDS = 'jepangin_memory_records_v1';
const STORAGE_KEY_PROGRESS = 'jepangin_game_progress_v1';

export interface GameProgressState {
  completedGroupIds: string[];
  defeatedBossIds: string[];
  totalBattlesCount: number;
  bestEverCombo: number;
  totalMasteredKana: number;
  recoveryQueue: string[]; // Kana IDs requiring review
  lastBattleDate: string | null;
}

const DEFAULT_PROGRESS: GameProgressState = {
  completedGroupIds: [],
  defeatedBossIds: [],
  totalBattlesCount: 0,
  bestEverCombo: 0,
  totalMasteredKana: 0,
  recoveryQueue: [],
  lastBattleDate: null,
};

// Initialize or load all Kana memory records
export function loadKanaMemoryRecords(): Record<string, KanaMemoryRecord> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    const existing = raw ? JSON.parse(raw) : {};

    // Ensure all Kana items have an entry
    const records: Record<string, KanaMemoryRecord> = { ...existing };
    for (const item of ALL_KANA_ITEMS) {
      if (!records[item.id]) {
        records[item.id] = {
          kanaId: item.id,
          kana: item.kana,
          romaji: item.romaji,
          type: item.type,
          strength: 0,
          correctCount: 0,
          wrongCount: 0,
          consecutiveCorrect: 0,
          lastReviewedAt: null,
          needsReview: false,
        };
      }
    }
    return records;
  } catch (err) {
    console.error('Error loading kana records:', err);
    return {};
  }
}

export function saveKanaMemoryRecords(records: Record<string, KanaMemoryRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving kana records:', err);
  }
}

export function loadGameProgress(): GameProgressState {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading game progress:', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveGameProgress(progress: GameProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving game progress:', err);
  }
}
