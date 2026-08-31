import { ReadingProgressState, StageProgressRecord, ReviewWordItem, EasyWord } from './readingTypes';
import { READING_STAGES, EASY_WORD_BANK } from './readingData';

const READING_STORAGE_KEY = 'jepangin_yomeru_reading_progress_v1';

export function createInitialReadingProgress(): ReadingProgressState {
  const initialStages: Record<number, StageProgressRecord> = {};

  READING_STAGES.forEach((stage) => {
    initialStages[stage.id] = {
      stageId: stage.id,
      isUnlocked: stage.id === 1, // Stage 1 is unlocked by default
      isCompleted: false,
      stars: 0,
      bestScore: 0,
      bestAccuracy: 0,
      timesPlayed: 0,
    };
  });

  return {
    highestCombo: 0,
    totalGamesPlayed: 0,
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    totalScore: 0,
    totalReadingXp: 0,
    unlockedStages: [1],
    stages: initialStages,
    reviewWords: {},
    normalModeUnlocked: false,
    hardModeUnlocked: false,
    lastPlayedDate: undefined,
  };
}

export function loadReadingProgressFromStorage(): ReadingProgressState {
  if (typeof window === 'undefined') return createInitialReadingProgress();

  try {
    const raw = localStorage.getItem(READING_STORAGE_KEY);
    if (!raw) return createInitialReadingProgress();

    const parsed = JSON.parse(raw);
    const initial = createInitialReadingProgress();

    // Deep merge to guarantee all 10 stages exist
    const mergedStages: Record<number, StageProgressRecord> = { ...initial.stages };
    if (parsed.stages && typeof parsed.stages === 'object') {
      Object.keys(parsed.stages).forEach((sKey) => {
        const id = Number(sKey);
        if (mergedStages[id]) {
          mergedStages[id] = {
            ...mergedStages[id],
            ...parsed.stages[id],
          };
        }
      });
    }

    return {
      ...initial,
      ...parsed,
      stages: mergedStages,
      reviewWords: parsed.reviewWords || {},
      unlockedStages: parsed.unlockedStages && Array.isArray(parsed.unlockedStages)
        ? parsed.unlockedStages
        : [1],
    };
  } catch (err) {
    console.warn('Failed to load reading progress from localStorage:', err);
    return createInitialReadingProgress();
  }
}

export function saveReadingProgressToStorage(state: ReadingProgressState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(READING_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save reading progress to localStorage:', err);
  }
}

/**
 * Helper to update review item mastery level:
 * - mastered: correctCount >= 5 and (wrongCount === 0 or correctCount >= wrongCount * 2)
 * - difficult: wrongCount >= 2 and correctCount < wrongCount
 * - learning: otherwise
 */
export function calculateMastery(correctCount: number, wrongCount: number): 'difficult' | 'learning' | 'mastered' {
  if (correctCount >= 5 && (wrongCount <= 1 || correctCount >= wrongCount * 2)) {
    return 'mastered';
  }
  if (wrongCount >= 2 && correctCount < wrongCount) {
    return 'difficult';
  }
  return 'learning';
}
