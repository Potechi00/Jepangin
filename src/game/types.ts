import { KanaItem, KanaGroup } from './kanaData';

export type GameMode = 'learn' | 'battle' | 'boss';

export type QuestionType =
  | 'recognition' // Kana -> Romaji
  | 'reverse' // Romaji -> Kana
  | 'audio' // Audio sound -> Kana/Romaji
  | 'differentiation'; // Confused pairs e.g. "あ vs お"

export interface BattleOption {
  text: string;
  isCorrect: boolean;
  kanaItem?: KanaItem;
}

export interface BattleQuestion {
  id: string;
  type: QuestionType;
  targetKana: KanaItem;
  promptText: string;
  promptDisplay: string; // Big main visual
  promptAudio?: string;
  subPrompt?: string;
  options: BattleOption[];
  isRecoveryQuestion?: boolean;
}

export interface KanaMemoryRecord {
  kanaId: string;
  kana: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  strength: number; // 0 - 100
  correctCount: number;
  wrongCount: number;
  consecutiveCorrect: number;
  lastReviewedAt: string | null;
  needsReview: boolean;
}

export type MemoryTier = 'needs_practice' | 'learning' | 'strong' | 'mastered';

export function getMemoryTier(strength: number): {
  tier: MemoryTier;
  label: string;
  badgeColor: string;
  textColor: string;
  icon: string;
} {
  if (strength >= 90) {
    return {
      tier: 'mastered',
      label: 'Dikuasai (Mastered)',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      textColor: 'text-amber-600',
      icon: '🏆',
    };
  }
  if (strength >= 70) {
    return {
      tier: 'strong',
      label: 'Kuat (Strong)',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      textColor: 'text-emerald-600',
      icon: '🟢',
    };
  }
  if (strength >= 40) {
    return {
      tier: 'learning',
      label: 'Sedang Belajar',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      textColor: 'text-sky-600',
      icon: '🟡',
    };
  }
  return {
    tier: 'needs_practice',
    label: 'Butuh Latihan',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    textColor: 'text-rose-600',
    icon: '🔴',
  };
}

export interface BattleSessionSummary {
  groupId: string;
  groupTitle: string;
  mode: GameMode;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  bestCombo: number;
  xpEarned: number;
  testedKanaRecords: KanaMemoryRecord[];
  weakKanaIds: string[];
  bossDefeated?: boolean;
}

export interface FocusBattleConfig {
  primaryKana: KanaItem;
  confusedWithKana: KanaItem;
  questions: BattleQuestion[];
}
