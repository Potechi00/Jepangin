export interface EasyWord {
  id: string;
  japanese: string;
  romaji: string;
  meaning: string;
  script: 'hiragana' | 'katakana';
  difficulty: 'easy' | 'normal' | 'hard';
  category: string;
}

export interface ReadingStage {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  startWordIndex: number; // 0-based
  endWordIndex: number;   // exclusive
  colorAccent: string;
}

export interface ReadingQuestionItem {
  id: string;
  word: EasyWord;
  options: string[]; // 4 options (romaji or capitalized romaji)
  correctOptionIndex: number;
  correctRomaji: string;
}

export type MasteryLevel = 'difficult' | 'learning' | 'mastered';

export interface ReviewWordItem {
  wordId: string;
  japanese: string;
  romaji: string;
  meaning: string;
  category: string;
  script: 'hiragana' | 'katakana';
  wrongCount: number;
  correctCount: number;
  lastSeen: string;
  masteryLevel: MasteryLevel;
}

export interface StageProgressRecord {
  stageId: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number; // 0 to 3
  bestScore: number;
  bestAccuracy: number;
  timesPlayed: number;
  lastPlayedAt?: string;
}

export interface ReadingProgressState {
  highestCombo: number;
  totalGamesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  totalScore: number;
  totalReadingXp: number;
  unlockedStages: number[]; // e.g. [1, 2, 3]
  stages: Record<number, StageProgressRecord>;
  reviewWords: Record<string, ReviewWordItem>; // key is wordId
  normalModeUnlocked: boolean;
  hardModeUnlocked: boolean;
  lastPlayedDate?: string;
}

export interface ReadingSessionResult {
  stageId: number;
  isReviewSession: boolean;
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  bestCombo: number;
  speedBonusXp: number;
  baseXp: number;
  totalXpEarned: number;
  starsEarned: number; // 0, 1, 2, 3
  isNewBestScore: boolean;
  isStagePassed: boolean;
  missedWords: EasyWord[];
}

export type ReadingGameScreen =
  | 'intro'
  | 'difficulty_select'
  | 'stage_select'
  | 'playing'
  | 'result'
  | 'review_hub'
  | 'how_to_play';
