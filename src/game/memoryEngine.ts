import { KanaItem, KANA_GROUPS, ALL_KANA_ITEMS, getKanaById } from './kanaData';
import {
  BattleQuestion,
  BattleOption,
  KanaMemoryRecord,
  QuestionType,
  FocusBattleConfig,
} from './types';

/**
 * Update memory strength for a Kana based on battle outcome
 */
export function updateKanaMemoryStrength(
  currentRecord: KanaMemoryRecord,
  isCorrect: boolean,
  isDelayedRecall: boolean = false
): KanaMemoryRecord {
  const updated = { ...currentRecord };
  const now = new Date().toISOString();
  updated.lastReviewedAt = now;

  if (isCorrect) {
    updated.correctCount += 1;
    updated.consecutiveCorrect += 1;

    // Bonus for consecutive recall and delayed recall
    let gain = 15;
    if (isDelayedRecall) gain += 12; // Extra reward for delayed memory retrieval
    if (updated.consecutiveCorrect >= 3) gain += 8;

    updated.strength = Math.min(100, updated.strength + gain);

    // If strength reaches 70+, clear needsReview
    if (updated.strength >= 70) {
      updated.needsReview = false;
    }
  } else {
    updated.wrongCount += 1;
    updated.consecutiveCorrect = 0;
    updated.needsReview = true;

    // Soft drop in strength (not punitive)
    updated.strength = Math.max(0, updated.strength - 12);
  }

  return updated;
}

/**
 * Generate 4 shuffled options for a question
 */
function generateOptions(
  targetKana: KanaItem,
  candidatePool: KanaItem[],
  isReverse: boolean
): BattleOption[] {
  // Correct answer
  const correctText = isReverse ? targetKana.kana : targetKana.romaji.toUpperCase();
  const options: BattleOption[] = [
    { text: correctText, isCorrect: true, kanaItem: targetKana },
  ];

  // Distractors
  const distractors: KanaItem[] = [];

  // Priority 1: Pick items from same group
  const sameGroup = candidatePool.filter((k) => k.id !== targetKana.id);
  const shuffledSameGroup = [...sameGroup].sort(() => 0.5 - Math.random());

  for (const item of shuffledSameGroup) {
    if (distractors.length < 3) {
      distractors.push(item);
    }
  }

  // Priority 2: If needed, pick from ALL_KANA_ITEMS with same type
  if (distractors.length < 3) {
    const otherPool = ALL_KANA_ITEMS.filter(
      (k) => k.type === targetKana.type && k.id !== targetKana.id && !distractors.some((d) => d.id === k.id)
    ).sort(() => 0.5 - Math.random());

    for (const item of otherPool) {
      if (distractors.length < 3) {
        distractors.push(item);
      }
    }
  }

  // Add distractors to options
  for (const distractor of distractors.slice(0, 3)) {
    const text = isReverse ? distractor.kana : distractor.romaji.toUpperCase();
    options.push({ text, isCorrect: false, kanaItem: distractor });
  }

  // Shuffle options so correct answer position is completely randomized
  return options.sort(() => 0.5 - Math.random());
}

/**
 * Generate a single battle question
 */
export function buildQuestion(
  targetKana: KanaItem,
  candidatePool: KanaItem[],
  preferredType?: QuestionType,
  isRecovery: boolean = false
): BattleQuestion {
  const types: QuestionType[] = ['recognition', 'reverse'];
  const chosenType = preferredType || types[Math.floor(Math.random() * types.length)];
  const isReverse = chosenType === 'reverse';

  const options = generateOptions(targetKana, candidatePool, isReverse);

  let promptText = '';
  let promptDisplay = '';
  let subPrompt = '';

  if (chosenType === 'recognition') {
    promptText = 'Apa bunyi huruf ini?';
    promptDisplay = targetKana.kana;
    subPrompt = 'Pilih bunyi Romaji yang tepat:';
  } else if (chosenType === 'reverse') {
    promptText = 'Pilih huruf yang benar';
    promptDisplay = targetKana.romaji.toUpperCase();
    subPrompt = `Manakah huruf untuk bunyi "${targetKana.romaji.toUpperCase()}"?`;
  } else {
    // Audio or differentiation
    promptText = 'Dengarkan & pilih hurufnya';
    promptDisplay = '🔊';
    subPrompt = 'Sentuh tombol audio jika ingin mendengar ulang';
  }

  return {
    id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    type: chosenType,
    targetKana,
    promptText,
    promptDisplay,
    subPrompt,
    promptAudio: targetKana.kana,
    options,
    isRecoveryQuestion: isRecovery,
  };
}

/**
 * Generate a complete sequence of questions for a battle session
 */
export function generateBattleSession(
  kanaGroupItems: KanaItem[],
  totalCount: number = 10,
  records: Record<string, KanaMemoryRecord> = {}
): BattleQuestion[] {
  if (kanaGroupItems.length === 0) return [];

  const questions: BattleQuestion[] = [];
  const pool = [...kanaGroupItems];

  // Identify weak kana in this group to weigh them more
  const weakItems = pool.filter((k) => {
    const rec = records[k.id];
    return rec && (rec.needsReview || rec.strength < 60);
  });

  // Ensure each Kana in the group appears at least once
  const initialPool = [...pool].sort(() => 0.5 - Math.random());
  for (const item of initialPool) {
    const type: QuestionType = Math.random() > 0.5 ? 'recognition' : 'reverse';
    questions.push(buildQuestion(item, pool, type));
  }

  // Fill the rest with mix, favoring weak items if available
  let lastKanaId = questions[questions.length - 1]?.targetKana.id;

  while (questions.length < totalCount) {
    let candidate: KanaItem;

    if (weakItems.length > 0 && Math.random() > 0.4) {
      // Pick weak item that wasn't just asked
      const validWeak = weakItems.filter((w) => w.id !== lastKanaId);
      candidate = validWeak.length > 0
        ? validWeak[Math.floor(Math.random() * validWeak.length)]
        : weakItems[Math.floor(Math.random() * weakItems.length)];
    } else {
      const valid = pool.filter((p) => p.id !== lastKanaId);
      candidate = valid.length > 0
        ? valid[Math.floor(Math.random() * valid.length)]
        : pool[Math.floor(Math.random() * pool.length)];
    }

    lastKanaId = candidate.id;
    const type: QuestionType = Math.random() > 0.5 ? 'recognition' : 'reverse';
    questions.push(buildQuestion(candidate, pool, type));
  }

  return questions;
}

/**
 * Generate a Boss Battle session (12-15 fast mixed questions)
 */
export function generateBossBattleSession(
  group: KanaItem[],
  records: Record<string, KanaMemoryRecord> = {}
): BattleQuestion[] {
  const questions: BattleQuestion[] = [];
  const pool = [...group];
  const count = 12;

  let lastKanaId = '';
  for (let i = 0; i < count; i++) {
    const valid = pool.filter((p) => p.id !== lastKanaId);
    const target = valid[Math.floor(Math.random() * valid.length)] || pool[0];
    lastKanaId = target.id;

    // Alternate question types rapidly
    const type: QuestionType = i % 2 === 0 ? 'recognition' : 'reverse';
    questions.push(buildQuestion(target, pool, type));
  }

  return questions;
}

/**
 * Generate a Focus Battle for a repeated mistake / confused pair
 */
export function generateFocusBattle(
  targetKana: KanaItem,
  candidatePool: KanaItem[]
): FocusBattleConfig | null {
  // Find confused character if defined, or another item in group
  let confusedKana: KanaItem | undefined;

  if (targetKana.similarTo && targetKana.similarTo.length > 0) {
    const char = targetKana.similarTo[0];
    confusedKana = ALL_KANA_ITEMS.find((k) => k.kana === char);
  }

  if (!confusedKana) {
    confusedKana = candidatePool.find((k) => k.id !== targetKana.id) || candidatePool[0];
  }

  if (!confusedKana || confusedKana.id === targetKana.id) {
    return null;
  }

  // Generate 4 focused differentiation questions
  const pair = [targetKana, confusedKana];
  const questions: BattleQuestion[] = [];

  // Q1: Target recognition
  questions.push(buildQuestion(targetKana, candidatePool, 'recognition'));
  // Q2: Confused partner recognition
  questions.push(buildQuestion(confusedKana, candidatePool, 'recognition'));
  // Q3: Target reverse
  questions.push(buildQuestion(targetKana, candidatePool, 'reverse'));
  // Q4: Confused partner reverse
  questions.push(buildQuestion(confusedKana, candidatePool, 'reverse'));

  return {
    primaryKana: targetKana,
    confusedWithKana: confusedKana,
    questions,
  };
}
