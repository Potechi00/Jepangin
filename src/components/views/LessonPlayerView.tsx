import React, { useState, useEffect, memo } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, Trophy, Home } from 'lucide-react';
import { Lesson, CourseModule, UserProgress } from '../../types';
import { speakJapanese, playSound } from '../../utils/audio';
import { getNextLessonId } from '../../data/courses';

interface LessonPlayerViewProps {
  course: CourseModule;
  lesson: Lesson;
  progress: UserProgress;
  onFinishLesson: (lessonId: string, earnedXp: number) => void;
  onBack: () => void;
  onStartNextLesson: (nextLessonId: string) => void;
}

export const LessonPlayerView: React.FC<LessonPlayerViewProps> = memo(({
  course,
  lesson,
  progress,
  onFinishLesson,
  onBack,
  onStartNextLesson,
}) => {
  const [phase, setPhase] = useState<'study' | 'quiz' | 'complete'>('study');
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);

  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const currentItem = lesson.items[currentItemIdx];
  const currentQuiz = lesson.quizzes[currentQuizIdx];

  // Auto-play voice on item change if autoVoice is enabled
  useEffect(() => {
    if (phase === 'study' && currentItem && progress.autoVoice) {
      speakJapanese(currentItem.japanese);
    }
  }, [currentItemIdx, phase]);

  // Trigger celebration effects on completion
  useEffect(() => {
    if (phase === 'complete') {
      playSound('complete');
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f43f5e', '#fb7185', '#f59e0b', '#10b981'],
      });
      onFinishLesson(lesson.id, lesson.xpReward);
    }
  }, [phase]);

  // Study Phase handlers
  const handleNextItem = () => {
    playSound('click');
    if (currentItemIdx < lesson.items.length - 1) {
      setCurrentItemIdx(prev => prev + 1);
    } else {
      if (lesson.quizzes.length > 0) {
        setPhase('quiz');
        setCurrentQuizIdx(0);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
      } else {
        setPhase('complete');
      }
    }
  };

  const handlePrevItem = () => {
    if (currentItemIdx > 0) {
      playSound('click');
      setCurrentItemIdx(prev => prev - 1);
    }
  };

  // Quiz Phase handlers
  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted) return;
    playSound('click');
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;

    const correct = selectedAnswer === currentQuiz.correctAnswer;
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      playSound('correct');
      setScore(prev => prev + 1);
    } else {
      playSound('wrong');
    }
  };

  const handleNextQuiz = () => {
    playSound('click');
    if (currentQuizIdx < lesson.quizzes.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setPhase('complete');
    }
  };

  const nextLessonId = getNextLessonId(lesson.id);

  const totalStudySteps = lesson.items.length;
  const totalQuizSteps = lesson.quizzes.length;
  const totalSteps = totalStudySteps + totalQuizSteps;

  const currentStepNumber = phase === 'study'
    ? currentItemIdx + 1
    : phase === 'quiz'
    ? totalStudySteps + currentQuizIdx + 1
    : totalSteps;

  const progressPercentage = Math.round((currentStepNumber / totalSteps) * 100);

  return (
    <div className="max-w-2xl mx-auto pb-16 animate-fade-in select-none">
      {/* 1. TOP HEADER HUD & PROGRESS BAR */}
      <div className="cinematic-floating-card rounded-2xl p-3.5 sm:p-4 mb-5">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <button
            id="btn-back-to-course-list"
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/80 hover:text-white font-extrabold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400" />
            <span>Kembali</span>
          </button>

          <span className="text-xs sm:text-sm font-black text-white">
            {phase === 'study' && `Materi ${currentItemIdx + 1} dari ${lesson.items.length}`}
            {phase === 'quiz' && `Latihan ${currentQuizIdx + 1} dari ${lesson.quizzes.length}`}
            {phase === 'complete' && 'Selesai! 🎉'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/10 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/15">
          <div
            className="bg-gradient-to-r from-rose-500 to-red-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. PHASE 1: STUDY ITEMS */}
      {phase === 'study' && currentItem && (
        <div className="space-y-4">
          <div className="cinematic-content-card rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 font-black text-xs sm:text-sm px-3.5 py-1 rounded-full mb-4 border border-rose-400/30">
              <span>{course.title}</span>
              <span>•</span>
              <span>{lesson.title}</span>
            </div>

            {/* Giant Japanese Character / Word Display */}
            <div className="my-3">
              <span className="text-7xl sm:text-8xl font-black text-white tracking-wider block drop-shadow-md">
                {currentItem.japanese}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-rose-400 block mt-2">
                "{currentItem.romaji}"
              </span>
            </div>

            {/* Big Audio Play Button */}
            <div className="my-5">
              <button
                id={`btn-listen-sound-${currentItem.id}`}
                onClick={() => speakJapanese(currentItem.japanese)}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                <Volume2 className="w-5 h-5 text-rose-400" />
                <span>Dengar Pengucapan 🔊</span>
              </button>
            </div>

            {/* Indonesian Meaning & Notes */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase text-white/50 block tracking-wider">Arti / Penjelasan</span>
                <p className="text-base sm:text-lg font-black text-white mt-0.5">
                  {currentItem.indonesian}
                </p>
              </div>

              {currentItem.notes && (
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] font-black uppercase text-white/50 block tracking-wider">Tips Mengingat</span>
                  <p className="text-xs sm:text-sm text-white/80 font-medium mt-0.5 italic">
                    💡 {currentItem.notes}
                  </p>
                </div>
              )}

              {/* Example Word */}
              {currentItem.exampleJapanese && (
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] font-black uppercase text-white/50 block tracking-wider">Contoh Penggunaan Kata</span>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs sm:text-sm font-bold text-white">
                      <span className="text-rose-400 font-black">{currentItem.exampleJapanese}</span> ({currentItem.exampleRomaji}) = {currentItem.exampleIndonesian}
                    </p>
                    <button
                      onClick={() => speakJapanese(currentItem.exampleJapanese || '')}
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                      title="Dengar contoh suara"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            {currentItemIdx > 0 && (
              <button
                id="btn-prev-item"
                onClick={handlePrevItem}
                className="w-1/3 py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-sm sm:text-base transition-all cursor-pointer border border-white/15"
              >
                Kembali
              </button>
            )}

            <button
              id="btn-next-item"
              onClick={handleNextItem}
              className={`flex-1 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentItemIdx === 0 ? 'w-full' : ''
              }`}
            >
              <span>{currentItemIdx === lesson.items.length - 1 ? 'MULAI LATIHAN SOAL' : 'BERIKUTNYA'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. PHASE 2: QUIZZES */}
      {phase === 'quiz' && currentQuiz && (
        <div className="space-y-4">
          <div className="cinematic-content-card rounded-3xl p-5 sm:p-7 shadow-xl">
            <span className="inline-block bg-amber-400/20 text-amber-300 font-black text-xs px-3 py-1 rounded-md mb-3 border border-amber-400/30">
              Latihan Soal #{currentQuizIdx + 1}
            </span>

            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
              {currentQuiz.question}
            </h2>

            {currentQuiz.promptDisplay && (
              <div className="my-5 py-5 bg-white/5 rounded-2xl text-center border border-white/10">
                <span className="text-5xl sm:text-6xl font-black text-white drop-shadow-sm">
                  {currentQuiz.promptDisplay}
                </span>
              </div>
            )}

            {currentQuiz.promptAudio && (
              <div className="my-4 flex justify-center">
                <button
                  id="btn-play-quiz-audio"
                  onClick={() => speakJapanese(currentQuiz.promptAudio || '')}
                  className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-base flex items-center gap-2 shadow-md shadow-rose-600/25 cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Putar Suara 🔊</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
              {currentQuiz.options?.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                let optionStyle = 'bg-white/5 hover:bg-white/15 border-white/10 text-white';

                if (isAnswerSubmitted) {
                  if (option === currentQuiz.correctAnswer) {
                    optionStyle = 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-black shadow-xs';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-500/25 border-rose-400 text-rose-300 line-through';
                  } else {
                    optionStyle = 'bg-white/5 border-white/10 text-white/30 opacity-50';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-rose-500/30 border-rose-400 text-white font-black shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswerSubmitted}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left font-bold text-base sm:text-lg transition-all flex items-center justify-between cursor-pointer min-h-[56px] ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && option === currentQuiz.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && (
              <div
                className={`mt-4 p-4 rounded-2xl border ${
                  isCorrect
                    ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200'
                    : 'bg-rose-500/15 border-rose-400/30 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Luar biasa, jawabanmu BENAR! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Jawaban kurang tepat. Kunci: {currentQuiz.correctAnswer}</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90 font-medium">
                  {currentQuiz.explanation}
                </p>
              </div>
            )}
          </div>

          {!isAnswerSubmitted ? (
            <button
              id="btn-submit-answer"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl font-black text-base sm:text-lg transition-all flex items-center justify-center gap-2 ${
                selectedAnswer
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg shadow-rose-600/30 cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
              }`}
            >
              <span>PERIKSA JAWABAN</span>
            </button>
          ) : (
            <button
              id="btn-next-quiz"
              onClick={handleNextQuiz}
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{currentQuizIdx === lesson.quizzes.length - 1 ? 'LIHAT HASIL BELAJAR' : 'SOAL BERIKUTNYA'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* 4. PHASE 3: LESSON COMPLETED CELEBRATION */}
      {phase === 'complete' && (
        <div className="cinematic-focus-card rounded-3xl border border-emerald-400/40 p-6 sm:p-10 text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/30">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div>
            <div className="inline-block bg-emerald-500/20 text-emerald-300 font-black text-xs px-3 py-1 rounded-md mb-2 border border-emerald-400/30">
              PELAJARAN SELESAI
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Hebat Sekali! おめでとう!
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-md mx-auto font-medium">
              Kamu telah menyelesaikan <strong>{lesson.title}</strong> dengan sangat baik.
            </p>
          </div>

          {/* Earned Rewards */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="bg-rose-500/20 border border-rose-400/30 rounded-2xl p-3.5">
              <span className="text-xs text-rose-300 font-extrabold block">XP Didapat</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5">+{lesson.xpReward} XP</span>
            </div>
            <div className="bg-amber-400/20 border border-amber-400/30 rounded-2xl p-3.5">
              <span className="text-xs text-amber-300 font-extrabold block">Streak Bertambah</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5">🔥 1 Hari</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-2.5 pt-2">
            {nextLessonId ? (
              <button
                id="btn-continue-next-lesson"
                onClick={() => onStartNextLesson(nextLessonId)}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>LANJUTKAN KE MATERI BERIKUTNYA</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                id="btn-retry-lesson"
                onClick={() => {
                  setPhase('study');
                  setCurrentItemIdx(0);
                  setCurrentQuizIdx(0);
                  setSelectedAnswer(null);
                  setIsAnswerSubmitted(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-white/15"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Ulangi Pelajaran</span>
              </button>

              <button
                id="btn-back-to-home"
                onClick={onBack}
                className="flex-1 py-3 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-white/20"
              >
                <Home className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
