import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Heart, Flame, Volume2, ArrowLeft, Zap, CheckCircle2, XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { ReadingQuestionItem, EasyWord } from '../../game/readingTypes';
import { READING_STAGES } from '../../game/readingData';
import { speakJapanese, playSound } from '../../utils/audio';

interface ReadingGameplayScreenProps {
  stageId: number;
  isReviewMode?: boolean;
  questions: ReadingQuestionItem[];
  onFinishSession: (stats: {
    correctCount: number;
    wrongCount: number;
    bestCombo: number;
    speedBonusXp: number;
    score: number;
    missedWords: EasyWord[];
  }) => void;
  onExitGame: () => void;
  soundEnabled?: boolean;
}

const QUESTION_TIME_LIMIT_MS = 10000; // 10 seconds per question
const SPEED_BONUS_THRESHOLD_MS = 3000; // <3 seconds for speed bonus

export const ReadingGameplayScreen: React.FC<ReadingGameplayScreenProps> = memo(({
  stageId,
  isReviewMode = false,
  questions,
  onFinishSession,
  onExitGame,
  soundEnabled = true,
}) => {
  // Game session & interaction state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [bestCombo, setBestCombo] = useState<number>(0);
  const [speedBonusXp, setSpeedBonusXp] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [missedWords, setMissedWords] = useState<EasyWord[]>([]);

  // Current Question status
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const [earnedPopup, setEarnedPopup] = useState<string | null>(null);

  // Exit confirmation modal state
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Timestamp-based Timer states
  const [timeLeftMs, setTimeLeftMs] = useState<number>(QUESTION_TIME_LIMIT_MS);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<number | null>(null);
  const autoNextTimeoutRef = useRef<number | null>(null);

  const currentQ = questions[currentIndex];
  const stageInfo = READING_STAGES.find((s) => s.id === stageId);

  // Cleanup all timers
  const clearAllTimers = useCallback(() => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (autoNextTimeoutRef.current !== null) {
      window.clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
  }, []);

  // Move to next question or complete session
  const advanceToNextQuestion = useCallback((
    targetHearts: number,
    targetCorrect: number,
    targetWrong: number,
    targetBestCombo: number,
    targetSpeedXp: number,
    targetScore: number,
    targetMissed: EasyWord[],
    targetNextIndex: number
  ) => {
    clearAllTimers();

    // Check if session ends (all questions completed or hearts depleted)
    if (targetHearts <= 0 || targetNextIndex >= questions.length) {
      onFinishSession({
        correctCount: targetCorrect,
        wrongCount: targetWrong,
        bestCombo: targetBestCombo,
        speedBonusXp: targetSpeedXp,
        score: targetScore,
        missedWords: targetMissed,
      });
      return;
    }

    // Advance state to next question
    setCurrentIndex(targetNextIndex);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setIsTransitioning(false);
    setFeedbackType(null);
    setEarnedPopup(null);
    setTimeLeftMs(QUESTION_TIME_LIMIT_MS);
    questionStartTimeRef.current = Date.now();
  }, [clearAllTimers, questions.length, onFinishSession]);

  // Handle option selection or timeout
  const handleSelectOption = useCallback((optionIdx: number | null, timedOut = false) => {
    if (isAnswered || isTransitioning || !currentQ) return;

    clearAllTimers();
    setIsAnswered(true);
    setIsTransitioning(true);

    const elapsedMs = Date.now() - questionStartTimeRef.current;
    const isCorrect = !timedOut && optionIdx !== null && optionIdx === currentQ.correctOptionIndex;

    setSelectedOptionIndex(optionIdx);

    if (isCorrect) {
      playSound('correct');
      const isSpeedBonus = elapsedMs <= SPEED_BONUS_THRESHOLD_MS;
      const speedXp = isSpeedBonus ? 5 : 0;
      const newCombo = combo + 1;
      const newBestCombo = Math.max(bestCombo, newCombo);

      const earnedThisTurn = 100 + (isSpeedBonus ? 30 : 0) + (newCombo * 10);
      const newScore = score + earnedThisTurn;
      const newSpeedXp = speedBonusXp + speedXp;
      const newCorrect = correctCount + 1;

      setCombo(newCombo);
      setBestCombo(newBestCombo);
      setScore(newScore);
      setSpeedBonusXp(newSpeedXp);
      setCorrectCount(newCorrect);
      setFeedbackType('correct');
      setEarnedPopup(`+10 XP ${isSpeedBonus ? '⚡ +5' : ''}`);

      if (soundEnabled && currentQ.word?.japanese) {
        speakJapanese(currentQ.word.japanese);
      }

      // Auto continue after ~1100ms
      autoNextTimeoutRef.current = window.setTimeout(() => {
        advanceToNextQuestion(
          hearts,
          newCorrect,
          wrongCount,
          newBestCombo,
          newSpeedXp,
          newScore,
          missedWords,
          currentIndex + 1
        );
      }, 1100);
    } else {
      playSound('wrong');
      const newHearts = Math.max(0, hearts - 1);
      const newWrong = wrongCount + 1;
      const newMissed = [...missedWords, currentQ.word];

      setHearts(newHearts);
      setCombo(0);
      setWrongCount(newWrong);
      setMissedWords(newMissed);
      setFeedbackType('wrong');
      setEarnedPopup('-1 ❤️');

      // Auto continue after ~1500ms
      autoNextTimeoutRef.current = window.setTimeout(() => {
        advanceToNextQuestion(
          newHearts,
          correctCount,
          newWrong,
          bestCombo,
          speedBonusXp,
          score,
          newMissed,
          currentIndex + 1
        );
      }, 1500);
    }
  }, [
    isAnswered,
    isTransitioning,
    currentQ,
    clearAllTimers,
    combo,
    bestCombo,
    score,
    speedBonusXp,
    correctCount,
    wrongCount,
    missedWords,
    hearts,
    soundEnabled,
    advanceToNextQuestion,
    currentIndex,
  ]);

  // Fallback Button Action: user manually taps "Berikutnya →"
  const handleManualNext = useCallback(() => {
    if (!isAnswered) return;
    playSound('click');
    clearAllTimers();

    advanceToNextQuestion(
      hearts,
      correctCount,
      wrongCount,
      bestCombo,
      speedBonusXp,
      score,
      missedWords,
      currentIndex + 1
    );
  }, [
    isAnswered,
    clearAllTimers,
    advanceToNextQuestion,
    hearts,
    correctCount,
    wrongCount,
    bestCombo,
    speedBonusXp,
    score,
    missedWords,
    currentIndex,
  ]);

  // Handle Exit Confirmation
  const handleConfirmExit = useCallback(() => {
    clearAllTimers();
    setShowExitConfirm(false);
    onExitGame();
  }, [clearAllTimers, onExitGame]);

  // Timestamp-based Timer effect (Independent of scroll and idle)
  useEffect(() => {
    if (showExitConfirm || isAnswered) return;

    questionStartTimeRef.current = Date.now();
    setTimeLeftMs(QUESTION_TIME_LIMIT_MS);

    timerIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - questionStartTimeRef.current;
      const remaining = Math.max(0, QUESTION_TIME_LIMIT_MS - elapsed);
      setTimeLeftMs(remaining);

      if (remaining <= 0) {
        clearAllTimers();
        handleSelectOption(null, true);
      }
    }, 50);

    return () => {
      clearAllTimers();
    };
  }, [currentIndex, isAnswered, showExitConfirm, clearAllTimers, handleSelectOption]);

  if (!currentQ) return null;

  const timerRatio = timeLeftMs / QUESTION_TIME_LIMIT_MS;
  const isSpeedEligible = timeLeftMs >= QUESTION_TIME_LIMIT_MS - SPEED_BONUS_THRESHOLD_MS;
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div
      className="game-screen fixed inset-0 z-50 flex flex-col justify-between w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] overflow-hidden select-none bg-slate-950/20 box-border px-3.5 sm:px-6"
      style={{
        paddingTop: 'max(8px, env(safe-area-inset-top, 8px))',
        paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
      }}
    >
      <div className="w-full max-w-lg mx-auto flex-1 min-h-0 flex flex-col justify-between py-1">
        {/* 1. TOP AREA (game-header) */}
        <div
          className="game-header shrink-0 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm flex items-center justify-between gap-2"
          style={{
            background: 'rgba(10, 25, 30, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Back button & Stage info */}
          <div className="flex items-center gap-2">
            <button
              id="btn-gameplay-back"
              onClick={() => setShowExitConfirm(true)}
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/35 active:scale-95 text-white flex items-center justify-center cursor-pointer shrink-0 border border-white/20"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-rose-300 bg-rose-500/25 px-2 py-0.5 rounded-md border border-rose-400/30">
                {isReviewMode ? 'Review' : stageInfo?.title || `Stage ${stageId}`}
              </span>
              <div className="text-xs font-black text-white leading-none mt-0.5">
                Soal {currentIndex + 1} <span className="text-white/60 font-semibold">/ {questions.length}</span>
              </div>
            </div>
          </div>

          {/* Center: Lives ❤️ ❤️ ❤️ */}
          <div className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-2xl border border-white/20 shadow-2xs">
            {[1, 2, 3].map((heartIdx) => {
              const hasHeart = heartIdx <= hearts;
              return (
                <Heart
                  key={heartIdx}
                  className={`w-4 h-4 transition-all transform ${
                    hasHeart
                      ? 'text-red-500 fill-red-500 scale-100 drop-shadow-xs'
                      : 'text-white/30 fill-transparent scale-90 opacity-40'
                  }`}
                />
              );
            })}
          </div>

          {/* Right: Combo & Score */}
          <div className="flex items-center gap-2">
            {combo > 1 && (
              <span className="text-[10px] font-black text-amber-200 bg-amber-500/30 px-1.5 py-0.5 rounded-lg border border-amber-400/40 flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>x{combo}</span>
              </span>
            )}
            <div className="text-right">
              <span className="text-[8px] font-black text-white/70 uppercase block leading-none">Skor</span>
              <div className="text-xs sm:text-sm font-black text-white leading-tight">{score}</div>
            </div>
          </div>
        </div>

        {/* 2. TIMER AREA (timer-section) */}
        <div className="timer-section shrink-0 my-1 sm:my-1.5 px-0.5 space-y-0.5">
          <div className="flex items-center justify-between text-[10px] font-extrabold px-1">
            <span className={`flex items-center gap-1 ${isSpeedEligible ? 'text-amber-300 font-black' : 'text-white/80'}`}>
              <Zap className={`w-3 h-3 ${isSpeedEligible ? 'fill-amber-400 text-amber-400 animate-bounce' : 'text-white/50'}`} />
              {isSpeedEligible ? 'Bonus Kecepatan (+5 XP)' : 'Waktu'}
            </span>
            <span className="text-white font-bold">{Math.ceil(timeLeftMs / 1000)}s</span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-white/20 backdrop-blur-xs rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className={`h-full rounded-full transition-all duration-75 ease-linear ${
                isSpeedEligible
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                  : timerRatio > 0.3
                  ? 'bg-gradient-to-r from-rose-500 to-red-500'
                  : 'bg-red-600'
              }`}
              style={{ width: `${timerRatio * 100}%` }}
            />
          </div>
        </div>

        {/* 3. QUESTION CARD (question-card) */}
        <div
          className={`question-card flex-1 min-h-0 rounded-2xl p-2 sm:p-3.5 shadow-lg relative text-center flex flex-col justify-center items-center transition-all my-0.5 ${
            feedbackType === 'correct'
              ? 'border-emerald-400/80 bg-emerald-950/40'
              : feedbackType === 'wrong'
              ? 'border-red-400/80 bg-red-950/40'
              : ''
          }`}
          style={{
            background: feedbackType ? undefined : 'rgba(10, 25, 30, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: feedbackType ? undefined : '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {earnedPopup && (
            <div className="absolute top-2 right-2.5 text-[11px] font-black px-2 py-0.5 rounded-full bg-white text-neutral-900 shadow-md animate-fade-in z-10">
              {earnedPopup}
            </div>
          )}

          <p className="text-[10px] sm:text-[11px] font-black text-rose-200/90 uppercase tracking-wider mb-0.5">
            BAGAIMANA CARA MEMBACANYA?
          </p>

          {/* Main Japanese Word */}
          <div className="flex items-center justify-center gap-2 my-0.5">
            <div
              className="font-black tracking-tight text-white drop-shadow-md select-text font-japanese leading-tight"
              style={{ fontSize: 'clamp(48px, 13vw, 76px)' }}
            >
              {currentQ.word.japanese}
            </div>

            <button
              id="btn-play-word-audio"
              onClick={() => {
                playSound('click');
                speakJapanese(currentQ.word.japanese);
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/35 active:scale-95 text-rose-300 flex items-center justify-center cursor-pointer shrink-0 border border-white/25"
              title="Dengarkan suara"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Category & Script */}
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-[9px] font-black uppercase text-rose-200 bg-rose-500/30 px-2 py-0.5 rounded-full border border-rose-400/40">
              {currentQ.word.script}
            </span>
            <span className="text-[9px] font-bold text-white/80 bg-white/15 px-2 py-0.5 rounded-full border border-white/15">
              {currentQ.word.category}
            </span>
          </div>

          {/* Meaning box when answered */}
          <div className="h-5 sm:h-6 mt-1 flex items-center justify-center">
            {isAnswered ? (
              <div className="px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-xs border border-white/30 animate-fade-in flex items-center gap-1 text-[11px]">
                <span className="text-white/80 font-medium">Artinya:</span>
                <strong className="font-black text-white">{currentQ.word.meaning}</strong>
              </div>
            ) : (
              <span className="text-[10px] text-white/40 italic">Pilih cara baca yang tepat</span>
            )}
          </div>
        </div>

        {/* 4. ANSWER AREA (answers-container) */}
        <div className="answers-container shrink-0 grid grid-cols-2 gap-1.5 sm:gap-2 my-1">
          {currentQ.options.map((option, idx) => {
            const isCorrectChoice = idx === currentQ.correctOptionIndex;
            const isSelected = selectedOptionIndex === idx;

            let btnStyle = 'border-white/20 text-white';
            let customBg = 'rgba(10, 25, 30, 0.45)';
            let icon = null;

            if (isAnswered) {
              if (isCorrectChoice) {
                btnStyle = 'border-emerald-400 text-white font-black shadow-md scale-[1.01]';
                customBg = 'rgba(5, 150, 105, 0.85)';
                icon = <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />;
              } else if (isSelected) {
                btnStyle = 'border-red-400 text-white font-black';
                customBg = 'rgba(220, 38, 38, 0.85)';
                icon = <XCircle className="w-4 h-4 text-red-200 shrink-0" />;
              } else {
                btnStyle = 'border-white/10 text-white/50 opacity-40';
                customBg = 'rgba(10, 25, 30, 0.25)';
              }
            }

            return (
              <button
                key={idx}
                id={`btn-reading-option-${idx}`}
                disabled={isAnswered || isTransitioning}
                onClick={() => handleSelectOption(idx, false)}
                style={{
                  background: customBg,
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
                className={`w-full min-h-[44px] sm:min-h-[50px] px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border shadow-xs flex items-center justify-between gap-1.5 text-left transition-all active:scale-98 cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white/20 flex items-center justify-center font-black text-[11px] sm:text-xs text-white shrink-0 border border-white/25">
                    {optionLabels[idx]}
                  </span>
                  <span className="text-xs sm:text-sm font-black tracking-tight drop-shadow-2xs truncate">
                    {option}
                  </span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* 5. ACTION AREA / NEXT BUTTON (next-button-container) - ALWAYS VISIBLE, NEVER COVERED */}
        <div className="next-button-container shrink-0 w-full pt-1 pb-0.5">
          <button
            id="btn-reading-manual-next"
            onClick={handleManualNext}
            disabled={!isAnswered}
            style={{
              height: 'clamp(46px, 7vh, 52px)',
            }}
            className={`w-full py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
              isAnswered
                ? 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-lg shadow-rose-600/40 active:scale-98 border border-rose-400/40'
                : 'bg-white/10 text-white/25 border border-white/10 cursor-not-allowed opacity-40'
            }`}
          >
            <span>{currentIndex + 1 >= questions.length || hearts <= 0 ? 'Lihat Hasil Akhir' : 'Berikutnya →'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6. EXIT CONFIRMATION MODAL */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm rounded-3xl p-5 sm:p-6 text-center space-y-4 shadow-2xl animate-scale-up"
            style={{
              background: 'rgba(25, 25, 35, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Keluar dari permainan?
              </h3>
              <p className="text-xs text-white/70 mt-1 font-medium">
                Progress sesi ini tidak akan disimpan jika kamu keluar sebelum selesai.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                id="btn-cancel-exit-game"
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 sm:py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs cursor-pointer transition-colors border border-white/20"
              >
                Batalkan
              </button>
              <button
                id="btn-confirm-exit-game"
                onClick={handleConfirmExit}
                className="py-2.5 sm:py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs cursor-pointer shadow-md shadow-red-600/30 transition-transform active:scale-95"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
