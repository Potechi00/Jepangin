import React, { useState, useEffect } from 'react';
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

export const LessonPlayerView: React.FC<LessonPlayerViewProps> = ({
  course,
  lesson,
  progress,
  onFinishLesson,
  onBack,
  onStartNextLesson,
}) => {
  // Step type: 'item' (learning vocabulary/character) or 'quiz' (testing) or 'complete'
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
      // Finished all items -> move to Quiz Phase if quizzes exist
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
      // All quizzes completed!
      setPhase('complete');
    }
  };

  const nextLessonId = getNextLessonId(lesson.id);

  // Total steps for progress bar calculation
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
    <div className="max-w-2xl mx-auto pb-16 animate-fade-in">
      {/* 1. TOP HEADER & LINEAR PROGRESS BAR */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/60 shadow-md mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <button
            id="btn-back-to-course-list"
            onClick={onBack}
            className="flex items-center gap-1.5 text-neutral-700 hover:text-rose-600 font-bold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs sm:text-sm font-extrabold text-neutral-700">
            {phase === 'study' && `Materi ${currentItemIdx + 1} dari ${lesson.items.length}`}
            {phase === 'quiz' && `Latihan ${currentQuizIdx + 1} dari ${lesson.quizzes.length}`}
            {phase === 'complete' && 'Selesai! 🎉'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/60 rounded-full h-3 overflow-hidden p-0.5 border border-neutral-300">
          <div
            className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. PHASE 1: STUDY ITEMS */}
      {phase === 'study' && currentItem && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/70 p-6 sm:p-10 shadow-xl text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 bg-rose-100/90 text-rose-800 font-extrabold text-xs sm:text-sm px-3.5 py-1 rounded-full mb-6 border border-rose-200">
              <span>{course.title}</span>
              <span>•</span>
              <span>{lesson.title}</span>
            </div>

            {/* Giant Japanese Character / Word Display */}
            <div className="my-4">
              <span className="text-7xl sm:text-9xl font-black text-neutral-900 tracking-wider block drop-shadow-xs">
                {currentItem.japanese}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 block mt-2">
                "{currentItem.romaji}"
              </span>
            </div>

            {/* Big Audio Play Button */}
            <div className="my-6">
              <button
                id={`btn-listen-sound-${currentItem.id}`}
                onClick={() => speakJapanese(currentItem.japanese)}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-rose-50/90 hover:bg-rose-100 text-rose-700 border-2 border-rose-200 font-extrabold text-base transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              >
                <Volume2 className="w-6 h-6 text-rose-600" />
                <span>Dengar Pengucapan 🔊</span>
              </button>
            </div>

            {/* Indonesian Meaning & Notes */}
            <div className="bg-white/70 backdrop-blur-xs rounded-2xl p-5 border border-neutral-200/80 text-left mt-6 space-y-3">
              <div>
                <span className="text-xs font-bold uppercase text-neutral-500 block">Arti / Penjelasan</span>
                <p className="text-base sm:text-lg font-bold text-neutral-900 mt-0.5">
                  {currentItem.indonesian}
                </p>
              </div>

              {currentItem.notes && (
                <div className="pt-2 border-t border-neutral-200">
                  <span className="text-xs font-bold uppercase text-neutral-500 block">Tips Mengingat</span>
                  <p className="text-sm text-neutral-700 mt-0.5 italic">
                    💡 {currentItem.notes}
                  </p>
                </div>
              )}

              {/* Example Word */}
              {currentItem.exampleJapanese && (
                <div className="pt-2 border-t border-neutral-200">
                  <span className="text-xs font-bold uppercase text-neutral-500 block">Contoh Penggunaan Kata</span>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm sm:text-base font-bold text-neutral-900">
                      <span className="text-rose-600 font-black">{currentItem.exampleJapanese}</span> ({currentItem.exampleRomaji}) = {currentItem.exampleIndonesian}
                    </p>
                    <button
                      onClick={() => speakJapanese(currentItem.exampleJapanese || '')}
                      className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 cursor-pointer"
                      title="Dengar contoh suara"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls: PREV and NEXT BUTTON */}
          <div className="flex items-center gap-3">
            {currentItemIdx > 0 && (
              <button
                id="btn-prev-item"
                onClick={handlePrevItem}
                className="w-1/3 py-4 px-4 rounded-2xl bg-white/80 backdrop-blur-md hover:bg-white text-neutral-800 font-bold text-base transition-all cursor-pointer border border-white/60 shadow-md"
              >
                Kembali
              </button>
            )}

            <button
              id="btn-next-item"
              onClick={handleNextItem}
              className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-lg sm:text-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer ${
                currentItemIdx === 0 ? 'w-full' : ''
              }`}
            >
              <span>{currentItemIdx === lesson.items.length - 1 ? 'MULAI LATIHAN SOAL' : 'BERIKUTNYA'}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* 3. PHASE 2: QUIZZES */}
      {phase === 'quiz' && currentQuiz && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/70 p-6 sm:p-8 shadow-xl">
            <span className="inline-block bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-md mb-4 border border-amber-200">
              Latihan Soal #{currentQuizIdx + 1}
            </span>

            {/* Question Title */}
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 leading-snug">
              {currentQuiz.question}
            </h2>

            {/* Prompt Display or Audio Prompt */}
            {currentQuiz.promptDisplay && (
              <div className="my-6 py-6 bg-white/60 backdrop-blur-xs rounded-2xl text-center border border-neutral-200/80">
                <span className="text-5xl sm:text-6xl font-black text-neutral-900">
                  {currentQuiz.promptDisplay}
                </span>
              </div>
            )}

            {currentQuiz.promptAudio && (
              <div className="my-6 flex justify-center">
                <button
                  id="btn-play-quiz-audio"
                  onClick={() => speakJapanese(currentQuiz.promptAudio || '')}
                  className="px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base flex items-center gap-3 shadow-md shadow-rose-600/20 cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
                >
                  <Volume2 className="w-6 h-6" />
                  <span>Putar Suara 🔊</span>
                </button>
              </div>
            )}

            {/* Multiple Choice Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {currentQuiz.options?.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                let optionStyle = 'bg-white/80 hover:bg-rose-50 border-neutral-200/90 text-neutral-800';

                if (isAnswerSubmitted) {
                  if (option === currentQuiz.correctAnswer) {
                    optionStyle = 'bg-emerald-50/95 border-emerald-500 text-emerald-900 font-black';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-50/95 border-rose-500 text-rose-900 line-through';
                  } else {
                    optionStyle = 'bg-white/50 border-neutral-200 text-neutral-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-rose-100/90 border-rose-600 text-rose-900 font-extrabold shadow-sm';
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswerSubmitted}
                    className={`p-4 sm:p-5 rounded-2xl border-2 text-left font-bold text-lg transition-all flex items-center justify-between cursor-pointer min-h-[64px] ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && option === currentQuiz.correctAnswer && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box on Answer Submission */}
            {isAnswerSubmitted && (
              <div
                className={`mt-6 p-5 rounded-2xl border ${
                  isCorrect
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50/90 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-base">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Luar biasa, jawabanmu BENAR! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Jawaban kurang tepat. Kunci: {currentQuiz.correctAnswer}</span>
                    </>
                  )}
                </div>
                <p className="text-sm mt-1 leading-relaxed opacity-90">
                  {currentQuiz.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          {!isAnswerSubmitted ? (
            <button
              id="btn-submit-answer"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className={`w-full py-4 sm:py-5 px-6 rounded-2xl font-black text-lg sm:text-xl transition-all flex items-center justify-center gap-3 ${
                selectedAnswer
                  ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-lg shadow-rose-600/30 cursor-pointer'
                  : 'bg-white/40 text-neutral-400 cursor-not-allowed border border-white/40'
              }`}
            >
              <span>PERIKSA JAWABAN</span>
            </button>
          ) : (
            <button
              id="btn-next-quiz"
              onClick={handleNextQuiz}
              className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-lg sm:text-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <span>{currentQuizIdx === lesson.quizzes.length - 1 ? 'LIHAT HASIL BELAJAR' : 'SOAL BERIKUTNYA'}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* 4. PHASE 3: LESSON COMPLETED CELEBRATION */}
      {phase === 'complete' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-emerald-400 p-8 sm:p-12 text-center shadow-xl shadow-emerald-500/10 space-y-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-12 h-12 sm:w-14 sm:h-14" />
          </div>

          <div>
            <div className="inline-block bg-emerald-100 text-emerald-800 font-black text-xs px-3 py-1 rounded-md mb-2">
              PELAJARAN SELESAI
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900">
              Hebat Sekali! おめでとう!
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-md mx-auto">
              Kamu telah menyelesaikan <strong>{lesson.title}</strong> dengan sangat baik.
            </p>
          </div>

          {/* Earned Rewards */}
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-4">
              <span className="text-xs text-rose-700 font-bold block">XP Didapat</span>
              <span className="text-2xl font-black text-rose-600 mt-0.5">+{lesson.xpReward} XP</span>
            </div>
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4">
              <span className="text-xs text-amber-700 font-bold block">Streak Bertambah</span>
              <span className="text-2xl font-black text-amber-600 mt-0.5">🔥 1 Hari</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-3 pt-4">
            {nextLessonId ? (
              <button
                id="btn-continue-next-lesson"
                onClick={() => onStartNextLesson(nextLessonId)}
                className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-lg sm:text-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <span>LANJUTKAN KE MATERI BERIKUTNYA</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="btn-retry-lesson"
                onClick={() => {
                  setPhase('study');
                  setCurrentItemIdx(0);
                  setCurrentQuizIdx(0);
                  setSelectedAnswer(null);
                  setIsAnswerSubmitted(false);
                }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-white/80 hover:bg-white text-neutral-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors border border-neutral-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Pelajaran</span>
              </button>

              <button
                id="btn-back-to-home"
                onClick={onBack}
                className="flex-1 py-3.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
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
};
