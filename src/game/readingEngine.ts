import { EasyWord, ReadingQuestionItem, ReadingSessionResult, ReadingProgressState, ReviewWordItem } from './readingTypes';
import { EASY_WORD_BANK, READING_STAGES } from './readingData';
import { calculateMastery } from './readingStorage';

// Capitalize helper e.g. "neko" -> "Neko"
export function formatRomaji(romaji: string): string {
  if (!romaji) return '';
  return romaji.charAt(0).toUpperCase() + romaji.slice(1).toLowerCase();
}

/**
 * Generate smart plausible distractors for a word
 */
export function generateSmartDistractors(targetWord: EasyWord, allWords: EasyWord[] = EASY_WORD_BANK): string[] {
  const correct = formatRomaji(targetWord.romaji);
  const distractors = new Set<string>();

  const targetRomaji = targetWord.romaji.toLowerCase();
  const firstLetter = targetRomaji.charAt(0);
  const lastLetter = targetRomaji.charAt(targetRomaji.length - 1);
  const wordLen = targetRomaji.length;

  // 1. Find words from database with same first letter or same category
  const sameCategoryOrLetter = allWords.filter(
    (w) => w.id !== targetWord.id && (w.romaji.startsWith(firstLetter) || w.category === targetWord.category)
  );

  // Shuffle candidate pool
  const shuffledCandidates = [...sameCategoryOrLetter].sort(() => Math.random() - 0.5);

  for (const candidate of shuffledCandidates) {
    const formatted = formatRomaji(candidate.romaji);
    if (formatted !== correct && !distractors.has(formatted)) {
      distractors.add(formatted);
      if (distractors.size >= 3) break;
    }
  }

  // 2. If we still need more distractors, find words with similar length
  if (distractors.size < 3) {
    const similarLength = allWords.filter(
      (w) => w.id !== targetWord.id && Math.abs(w.romaji.length - wordLen) <= 2
    ).sort(() => Math.random() - 0.5);

    for (const candidate of similarLength) {
      const formatted = formatRomaji(candidate.romaji);
      if (formatted !== correct && !distractors.has(formatted)) {
        distractors.add(formatted);
        if (distractors.size >= 3) break;
      }
    }
  }

  // 3. Fallback to any distinct word in the bank
  if (distractors.size < 3) {
    const fallbackWords = [...allWords].sort(() => Math.random() - 0.5);
    for (const candidate of fallbackWords) {
      const formatted = formatRomaji(candidate.romaji);
      if (formatted !== correct && !distractors.has(formatted)) {
        distractors.add(formatted);
        if (distractors.size >= 3) break;
      }
    }
  }

  // 4. In the rare case of shortfall, generate phonetic mutation
  const phoneticMutations = [
    targetRomaji + 'e',
    targetRomaji.slice(0, -1) + 'i',
    targetRomaji.slice(0, -1) + 'a',
    targetRomaji.slice(0, -1) + 'u',
  ];
  for (const mutation of phoneticMutations) {
    if (distractors.size >= 3) break;
    const formatted = formatRomaji(mutation);
    if (formatted !== correct && !distractors.has(formatted)) {
      distractors.add(formatted);
    }
  }

  return Array.from(distractors).slice(0, 3);
}

/**
 * Build a single reading question with 4 randomized options
 */
export function buildReadingQuestion(word: EasyWord, allWords: EasyWord[] = EASY_WORD_BANK): ReadingQuestionItem {
  const correctRomaji = formatRomaji(word.romaji);
  const distractors = generateSmartDistractors(word, allWords);

  // Combine and shuffle 4 options
  const allOptions = [correctRomaji, ...distractors].sort(() => Math.random() - 0.5);
  const correctIndex = allOptions.indexOf(correctRomaji);

  return {
    id: `q_${word.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    word,
    options: allOptions,
    correctOptionIndex: correctIndex,
    correctRomaji,
  };
}

/**
 * Generate 10 random questions for a given Stage (from its 25 words pool)
 * Guarantees no duplicate words within the 10 questions of the session.
 */
export function generateStageSession(stageId: number): ReadingQuestionItem[] {
  const stage = READING_STAGES.find((s) => s.id === stageId) || READING_STAGES[0];
  const stageWords = EASY_WORD_BANK.slice(stage.startWordIndex, stage.endWordIndex);

  // Shuffle the 25 words and take exactly 10
  const shuffledWords = [...stageWords].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledWords.slice(0, Math.min(10, shuffledWords.length));

  return selectedWords.map((word) => buildReadingQuestion(word, EASY_WORD_BANK));
}

/**
 * Generate a Review Practice Session prioritizing most difficult / missed words
 */
export function generateReviewPracticeSession(reviewWords: Record<string, ReviewWordItem>): ReadingQuestionItem[] {
  const items = Object.values(reviewWords);

  if (items.length === 0) {
    // If no review words yet, fallback to stage 1
    return generateStageSession(1);
  }

  // Sort by priority: highest wrongCount first, then lowest correctCount
  const sorted = [...items].sort((a, b) => {
    const scoreA = a.wrongCount * 3 - a.correctCount;
    const scoreB = b.wrongCount * 3 - b.correctCount;
    return scoreB - scoreA;
  });

  const selectedReviewItems = sorted.slice(0, 10);
  // Map back to EasyWord objects
  const questions: ReadingQuestionItem[] = [];

  for (const revItem of selectedReviewItems) {
    const originalWord = EASY_WORD_BANK.find((w) => w.id === revItem.wordId) || {
      id: revItem.wordId,
      japanese: revItem.japanese,
      romaji: revItem.romaji,
      meaning: revItem.meaning,
      script: revItem.script,
      difficulty: 'easy' as const,
      category: revItem.category || 'general',
    };
    questions.push(buildReadingQuestion(originalWord, EASY_WORD_BANK));
  }

  // If fewer than 10 words in review, fill with random easy words
  if (questions.length < 10) {
    const existingIds = new Set(questions.map((q) => q.word.id));
    const extraPool = EASY_WORD_BANK.filter((w) => !existingIds.has(w.id)).sort(() => Math.random() - 0.5);
    const needed = 10 - questions.length;
    for (let i = 0; i < needed && i < extraPool.length; i++) {
      questions.push(buildReadingQuestion(extraPool[i], EASY_WORD_BANK));
    }
  }

  // Shuffle question order
  return questions.sort(() => Math.random() - 0.5);
}

/**
 * Calculate Stars:
 * 1 Star = Stage Finished (at least 1 correct)
 * 2 Stars = >= 70% Correct (>= 7 / 10)
 * 3 Stars = >= 90% Correct (>= 9 / 10)
 */
export function calculateStars(correctCount: number, totalQuestions: number): number {
  if (totalQuestions === 0 || correctCount <= 0) return 0;
  const percentage = (correctCount / totalQuestions) * 100;
  if (percentage >= 90) return 3;
  if (percentage >= 70) return 2;
  if (percentage >= 40) return 1;
  return 1; // Completed the session
}

/**
 * Calculate Final Session Summary and update user state
 */
export function processSessionCompletion(
  stageId: number,
  isReview: boolean,
  totalQuestions: number,
  correctCount: number,
  wrongCount: number,
  bestCombo: number,
  speedBonusXp: number,
  score: number,
  missedWords: EasyWord[],
  currentState: ReadingProgressState
): { result: ReadingSessionResult; updatedState: ReadingProgressState } {
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const starsEarned = calculateStars(correctCount, totalQuestions);
  const baseXp = correctCount * 10;
  const comboBonusXp = bestCombo >= 10 ? 50 : (bestCombo >= 5 ? 20 : (bestCombo >= 3 ? 10 : 0));
  const totalXpEarned = baseXp + speedBonusXp + comboBonusXp;

  const currentStageRecord = currentState.stages[stageId] || {
    stageId,
    isUnlocked: true,
    isCompleted: false,
    stars: 0,
    bestScore: 0,
    bestAccuracy: 0,
    timesPlayed: 0,
  };

  const isNewBestScore = score > currentStageRecord.bestScore;
  const isStagePassed = correctCount >= 6 || starsEarned >= 1;

  // Clone stages
  const newStages = { ...currentState.stages };
  newStages[stageId] = {
    ...currentStageRecord,
    isCompleted: currentStageRecord.isCompleted || isStagePassed,
    stars: Math.max(currentStageRecord.stars, starsEarned),
    bestScore: Math.max(currentStageRecord.bestScore, score),
    bestAccuracy: Math.max(currentStageRecord.bestAccuracy, accuracy),
    timesPlayed: currentStageRecord.timesPlayed + 1,
    lastPlayedAt: new Date().toISOString(),
  };

  // Unlock next stage if passed
  const nextStageId = stageId + 1;
  const newUnlockedStages = new Set(currentState.unlockedStages);
  newUnlockedStages.add(stageId);

  if (isStagePassed && nextStageId <= 10) {
    newUnlockedStages.add(nextStageId);
    if (newStages[nextStageId]) {
      newStages[nextStageId] = {
        ...newStages[nextStageId],
        isUnlocked: true,
      };
    }
  }

  // Update Review Words
  const newReviewWords: Record<string, ReviewWordItem> = { ...currentState.reviewWords };

  // For missed words, increment wrong count
  missedWords.forEach((word) => {
    const existing = newReviewWords[word.id];
    const newWrong = (existing?.wrongCount || 0) + 1;
    const newCorrect = existing?.correctCount || 0;
    newReviewWords[word.id] = {
      wordId: word.id,
      japanese: word.japanese,
      romaji: word.romaji,
      meaning: word.meaning,
      category: word.category,
      script: word.script,
      wrongCount: newWrong,
      correctCount: newCorrect,
      lastSeen: new Date().toISOString(),
      masteryLevel: calculateMastery(newCorrect, newWrong),
    };
  });

  // Calculate overall Mastered Words count
  const updatedUnlockedArray = Array.from(newUnlockedStages).sort((a, b) => a - b);

  const updatedState: ReadingProgressState = {
    ...currentState,
    highestCombo: Math.max(currentState.highestCombo, bestCombo),
    totalGamesPlayed: currentState.totalGamesPlayed + 1,
    totalQuestionsAnswered: currentState.totalQuestionsAnswered + totalQuestions,
    totalCorrect: currentState.totalCorrect + correctCount,
    totalWrong: currentState.totalWrong + wrongCount,
    totalScore: currentState.totalScore + score,
    totalReadingXp: currentState.totalReadingXp + totalXpEarned,
    unlockedStages: updatedUnlockedArray,
    stages: newStages,
    reviewWords: newReviewWords,
    normalModeUnlocked: updatedUnlockedArray.includes(6) || currentState.normalModeUnlocked,
    hardModeUnlocked: updatedUnlockedArray.includes(10) || currentState.hardModeUnlocked,
    lastPlayedDate: new Date().toISOString().split('T')[0],
  };

  const result: ReadingSessionResult = {
    stageId,
    isReviewSession: isReview,
    score,
    totalQuestions,
    correctCount,
    wrongCount,
    accuracy,
    bestCombo,
    speedBonusXp,
    baseXp,
    totalXpEarned,
    starsEarned,
    isNewBestScore,
    isStagePassed,
    missedWords,
  };

  return { result, updatedState };
}
