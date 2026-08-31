import React, { useState, useCallback, memo } from 'react';
import { UserProgress } from '../../types';
import {
  ReadingGameScreen,
  ReadingQuestionItem,
  ReadingSessionResult,
  EasyWord,
} from '../../game/readingTypes';
import {
  generateStageSession,
  generateReviewPracticeSession,
  processSessionCompletion,
} from '../../game/readingEngine';
import { ReadingGameIntro } from './ReadingGameIntro';
import { ReadingStageSelector } from './ReadingStageSelector';
import { ReadingGameplayScreen } from './ReadingGameplayScreen';
import { ReadingResultScreen } from './ReadingResultScreen';
import { ReadingReviewHub } from './ReadingReviewHub';
import { ReadingHowToPlayModal } from './ReadingHowToPlayModal';
import { useAuth } from '../../auth/authContext';

interface YomeruReadingViewProps {
  progress: UserProgress;
  onAddXp: (amount: number) => void;
  onBackToApp?: () => void;
  onFocusModeChange?: (isFocused: boolean) => void;
}

export const YomeruReadingView: React.FC<YomeruReadingViewProps> = memo(({
  progress,
  onAddXp,
  onBackToApp,
  onFocusModeChange,
}) => {
  const { readingProgress, setReadingProgress } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<ReadingGameScreen>('intro');
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [isReviewSession, setIsReviewSession] = useState<boolean>(false);
  const [activeQuestions, setActiveQuestions] = useState<ReadingQuestionItem[]>([]);
  const [latestResult, setLatestResult] = useState<ReadingSessionResult | null>(null);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);

  // 1. Start a specific Stage (1 to 10)
  const handleStartStage = useCallback((stageId: number) => {
    setActiveStageId(stageId);
    setIsReviewSession(false);
    const questions = generateStageSession(stageId);
    setActiveQuestions(questions);
    setCurrentScreen('playing');
    onFocusModeChange?.(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onFocusModeChange]);

  // 2. Start Difficult Words Review Practice Session
  const handleStartReviewPractice = useCallback(() => {
    setIsReviewSession(true);
    const questions = generateReviewPracticeSession(readingProgress.reviewWords);
    setActiveQuestions(questions);
    setCurrentScreen('playing');
    onFocusModeChange?.(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [readingProgress.reviewWords, onFocusModeChange]);

  // 3. Handle Finish Gameplay Session
  const handleFinishGameplay = useCallback((stats: {
    correctCount: number;
    wrongCount: number;
    bestCombo: number;
    speedBonusXp: number;
    score: number;
    missedWords: EasyWord[];
  }) => {
    onFocusModeChange?.(false);
    const { result, updatedState } = processSessionCompletion(
      activeStageId,
      isReviewSession,
      activeQuestions.length,
      stats.correctCount,
      stats.wrongCount,
      stats.bestCombo,
      stats.speedBonusXp,
      stats.score,
      stats.missedWords,
      readingProgress
    );

    // Save updated reading progress to cloud / local
    setReadingProgress(updatedState);

    // Award XP to main user progress
    if (result.totalXpEarned > 0) {
      onAddXp(result.totalXpEarned);
    }

    setLatestResult(result);
    setCurrentScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStageId, isReviewSession, activeQuestions.length, readingProgress, setReadingProgress, onAddXp, onFocusModeChange]);

  // 4. Handle Next Stage
  const handleNextStage = useCallback(() => {
    const nextId = activeStageId + 1;
    if (nextId <= 10) {
      handleStartStage(nextId);
    } else {
      setCurrentScreen('stage_select');
      onFocusModeChange?.(false);
    }
  }, [activeStageId, handleStartStage, onFocusModeChange]);

  return (
    <div className="w-full pb-10">
      {/* Cara Bermain Modal */}
      <ReadingHowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Screen 1: INTRO */}
      {currentScreen === 'intro' && (
        <ReadingGameIntro
          progressState={readingProgress}
          onStartGame={() => setCurrentScreen('stage_select')}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenReviewHub={() => setCurrentScreen('review_hub')}
          onBackToApp={onBackToApp}
        />
      )}

      {/* Screen 2: STAGE SELECTION */}
      {currentScreen === 'stage_select' && (
        <ReadingStageSelector
          progressState={readingProgress}
          onSelectStage={handleStartStage}
          onBackToIntro={() => setCurrentScreen('intro')}
        />
      )}

      {/* Screen 3: PLAYING */}
      {currentScreen === 'playing' && (
        <ReadingGameplayScreen
          stageId={activeStageId}
          isReviewMode={isReviewSession}
          questions={activeQuestions}
          onFinishSession={handleFinishGameplay}
          onExitGame={() => {
            onFocusModeChange?.(false);
            setCurrentScreen(isReviewSession ? 'review_hub' : 'stage_select');
          }}
          soundEnabled={progress.soundEffects}
        />
      )}

      {/* Screen 4: RESULT */}
      {currentScreen === 'result' && latestResult && (
        <ReadingResultScreen
          result={latestResult}
          onPlayAgain={() => {
            if (isReviewSession) {
              handleStartReviewPractice();
            } else {
              handleStartStage(activeStageId);
            }
          }}
          onNextStage={handleNextStage}
          onPracticeDifficultWords={handleStartReviewPractice}
          onReturnToStages={() => setCurrentScreen('stage_select')}
          onReturnHome={() => setCurrentScreen('intro')}
          hasNextStage={activeStageId < 10}
        />
      )}

      {/* Screen 5: SMART REVIEW HUB */}
      {currentScreen === 'review_hub' && (
        <ReadingReviewHub
          progressState={readingProgress}
          onStartReviewPractice={handleStartReviewPractice}
          onBackToIntro={() => setCurrentScreen('intro')}
        />
      )}
    </div>
  );
});
