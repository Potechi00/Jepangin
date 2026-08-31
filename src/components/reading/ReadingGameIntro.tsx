import React, { memo } from 'react';
import { Play, Flame, Star, BookOpen, Target, Sparkles, HelpCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { ReadingProgressState, ReviewWordItem } from '../../game/readingTypes';

interface ReadingGameIntroProps {
  progressState: ReadingProgressState;
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenReviewHub: () => void;
  onBackToApp?: () => void;
}

export const ReadingGameIntro: React.FC<ReadingGameIntroProps> = memo(({
  progressState,
  onStartGame,
  onOpenHowToPlay,
  onOpenReviewHub,
  onBackToApp,
}) => {
  // Compute overall accuracy
  const totalAnswered = progressState.totalQuestionsAnswered;
  const overallAccuracy = totalAnswered > 0
    ? Math.round((progressState.totalCorrect / totalAnswered) * 100)
    : 0;

  // Count mastered words
  const reviewValues: ReviewWordItem[] = Object.values(progressState.reviewWords || {});
  const masteredCount = reviewValues.filter((w) => w.masteryLevel === 'mastered').length;
  const difficultCount = reviewValues.filter((w) => w.masteryLevel === 'difficult').length;

  return (
    <div className="space-y-5 animate-fade-in select-none max-w-3xl mx-auto">
      {/* Top Header Row if back button provided */}
      {onBackToApp && (
        <div className="flex items-center justify-between">
          <button
            id="btn-yomeru-back-app"
            onClick={onBackToApp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/15 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400" />
            <span>Kembali ke Menu</span>
          </button>

          <button
            id="btn-yomeru-guide-top"
            onClick={onOpenHowToPlay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/15 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span>Cara Main</span>
          </button>
        </div>
      )}

      {/* Hero Visual Card (Cinematic Transparent Japanese Theme) */}
      <div className="cinematic-content-card rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl">
        {/* Soft Decorative Japanese Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
          <div className="absolute -top-4 -left-4 text-8xl font-black text-white/30 select-none">読</div>
          <div className="absolute -bottom-6 -right-4 text-9xl font-black text-rose-400/30 select-none">目</div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 space-y-3.5">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 px-3.5 py-1 rounded-full text-xs font-black tracking-widest text-rose-300 border border-rose-400/30 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>GAME 2 • JAPANESE READING CHALLENGE</span>
          </div>

          <div className="space-y-0.5">
            <div className="text-2xl sm:text-4xl font-black text-amber-200 tracking-tight drop-shadow-sm">
              「よめる？」
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
              YOMERU!
            </h1>
            <p className="text-rose-300 font-black text-xs sm:text-sm tracking-wider uppercase">
              "Lihat. Baca. Kuasai."
            </p>
          </div>

          <p className="text-white/80 text-xs sm:text-sm max-w-md mx-auto font-medium leading-relaxed">
            Latih kemampuanmu membaca huruf Hiragana dan Katakana secara cepat, akurat, dan seru dengan 250 kosakata Jepang terstruktur! 🌸
          </p>

          {/* Main Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="btn-yomeru-play-main"
              onClick={onStartGame}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-base shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>MULAI BERMAIN</span>
            </button>

            <button
              id="btn-yomeru-how-to-play"
              onClick={onOpenHowToPlay}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>Cara Bermain</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Performance Statistics Grid (Translucent Floating UI) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Highest Combo */}
        <div className="cinematic-floating-card rounded-2xl p-3.5 flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-1 border border-amber-400/30">
            <Flame className="w-4 h-4 fill-amber-400" />
          </div>
          <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
            Highest Combo
          </span>
          <span className="text-lg sm:text-xl font-black text-white mt-0.5">
            🔥 x{progressState.highestCombo}
          </span>
        </div>

        {/* Best Score */}
        <div className="cinematic-floating-card rounded-2xl p-3.5 flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400 mb-1 border border-rose-400/30">
            <Star className="w-4 h-4 fill-rose-400" />
          </div>
          <span className="text-[10px] text-rose-300 font-extrabold uppercase tracking-wider">
            Best Score
          </span>
          <span className="text-lg sm:text-xl font-black text-white mt-0.5">
            {progressState.totalScore.toLocaleString()}
          </span>
        </div>

        {/* Words Mastered */}
        <div className="cinematic-floating-card rounded-2xl p-3.5 flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-1 border border-emerald-400/30">
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-emerald-300 font-extrabold uppercase tracking-wider">
            Mastered
          </span>
          <span className="text-lg sm:text-xl font-black text-white mt-0.5">
            {masteredCount} <span className="text-xs font-semibold text-white/60">Kata</span>
          </span>
        </div>

        {/* Accuracy */}
        <div className="cinematic-floating-card rounded-2xl p-3.5 flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 mb-1 border border-indigo-400/30">
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-wider">
            Accuracy
          </span>
          <span className="text-lg sm:text-xl font-black text-white mt-0.5">
            {overallAccuracy}%
          </span>
        </div>
      </div>

      {/* Smart Review Quick Access Card */}
      <div className="cinematic-content-card rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3.5">
        <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400 text-xl font-black border border-amber-400/30 shrink-0">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white">
                Pusat Review & Kata Sulit
              </h2>
              {difficultCount > 0 && (
                <span className="text-[10px] font-black bg-red-500/80 text-white px-2 py-0.5 rounded-full">
                  {difficultCount} Sulit
                </span>
              )}
            </div>
            <p className="text-xs text-white/70 font-medium mt-0.5">
              {reviewValues.length > 0
                ? `Tersimpan ${reviewValues.length} kata yang pernah kamu temui untuk dilatih ulang.`
                : 'Kata yang salah saat bermain akan otomatis terkumpul di sini.'}
            </p>
          </div>
        </div>

        <button
          id="btn-open-review-center"
          onClick={onOpenReviewHub}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Buka Review Kata</span>
        </button>
      </div>
    </div>
  );
});
