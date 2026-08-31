import React, { memo } from 'react';
import { Star, Flame, RotateCcw, ArrowRight, BookOpen, Volume2, Sparkles, Home } from 'lucide-react';
import { ReadingSessionResult } from '../../game/readingTypes';
import { READING_STAGES } from '../../game/readingData';
import { speakJapanese } from '../../utils/audio';

interface ReadingResultScreenProps {
  result: ReadingSessionResult;
  onPlayAgain: () => void;
  onNextStage: () => void;
  onPracticeDifficultWords: () => void;
  onReturnToStages: () => void;
  onReturnHome: () => void;
  hasNextStage: boolean;
}

export const ReadingResultScreen: React.FC<ReadingResultScreenProps> = memo(({
  result,
  onPlayAgain,
  onNextStage,
  onPracticeDifficultWords,
  onReturnToStages,
  onReturnHome,
  hasNextStage,
}) => {
  const stageInfo = READING_STAGES.find((s) => s.id === result.stageId);
  const isPassed = result.isStagePassed;

  return (
    <div className="space-y-5 animate-fade-in select-none max-w-2xl mx-auto">
      {/* 1. HERO RESULT BANNER (Cinematic Floating Header) */}
      <div
        className="cinematic-focus-card rounded-3xl p-6 sm:p-7 text-white relative text-center overflow-hidden transition-all"
        style={{
          background: isPassed
            ? 'linear-gradient(135deg, rgba(16, 110, 60, 0.45), rgba(15, 25, 35, 0.55))'
            : 'linear-gradient(135deg, rgba(130, 30, 40, 0.45), rgba(15, 25, 35, 0.55))',
        }}
      >
        <div className="relative z-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border border-white/20 text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{result.isReviewSession ? 'Latihan Review Selesai' : `Hasil ${stageInfo?.title || `Stage ${result.stageId}`}`}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            {isPassed ? '🎉 GREAT JOB!' : '💪 TETAP SEMANGAT!'}
          </h1>

          <p className="text-xs sm:text-sm text-white/80 font-medium max-w-sm mx-auto">
            {isPassed
              ? `Kamu berhasil menyelesaikan ${stageInfo?.subtitle || 'sesi membaca'} dengan sangat baik!`
              : 'Jangan menyerah! Latih kata-kata yang belum kamu kuasai dan coba lagi.'}
          </p>

          {/* Stars display */}
          <div className="flex items-center justify-center gap-2 pt-1.5">
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border shadow-md transition-all ${
                  starIdx <= result.starsEarned
                    ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 border-amber-200 scale-105'
                    : 'bg-white/10 text-white/30 border-white/15 scale-95'
                }`}
              >
                <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${starIdx <= result.starsEarned ? 'fill-amber-500 text-amber-500' : ''}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. STATS SUMMARY GRID (Cinematic floating cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Score */}
        <div className="cinematic-floating-card rounded-2xl p-3 flex flex-col items-center text-center transition-all">
          <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">Score</span>
          <div className="text-lg sm:text-xl font-black text-white mt-0.5">{result.score}</div>
          {result.isNewBestScore && (
            <span className="text-[9px] font-black text-rose-300 bg-rose-500/25 px-2 py-0.2 rounded-full border border-rose-400/30 mt-1">
              ⭐ Rekor Baru
            </span>
          )}
        </div>

        {/* Accuracy */}
        <div className="cinematic-floating-card rounded-2xl p-3 flex flex-col items-center text-center transition-all">
          <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">Akurasi</span>
          <div className="text-lg sm:text-xl font-black text-white mt-0.5">{result.accuracy}%</div>
          <span className="text-[10px] font-bold text-white/50">
            {result.correctCount} / {result.totalQuestions} Benar
          </span>
        </div>

        {/* Best Combo */}
        <div className="cinematic-floating-card rounded-2xl p-3 flex flex-col items-center text-center transition-all">
          <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">Best Combo</span>
          <div className="text-lg sm:text-xl font-black text-amber-400 mt-0.5 flex items-center gap-1">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>x{result.bestCombo}</span>
          </div>
        </div>

        {/* Total XP Earned */}
        <div className="cinematic-floating-card rounded-2xl p-3 flex flex-col items-center text-center transition-all">
          <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">XP Diperoleh</span>
          <div className="text-lg sm:text-xl font-black text-rose-400 mt-0.5">+{result.totalXpEarned} XP</div>
          {result.speedBonusXp > 0 && (
            <span className="text-[9px] font-black text-amber-300 bg-amber-400/20 px-2 py-0.2 rounded-full border border-amber-400/30 mt-1">
              +{result.speedBonusXp} Speed
            </span>
          )}
        </div>
      </div>

      {/* 3. KATA YANG PERLU DIULANG (Missed Words Section) */}
      {result.missedWords.length > 0 && (
        <div className="cinematic-content-card rounded-3xl p-4 sm:p-5 shadow-xl space-y-3 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <h2 className="text-xs sm:text-sm font-black text-white">
                📚 Kata yang Perlu Diulang ({result.missedWords.length})
              </h2>
            </div>
            <span className="text-[10px] font-bold text-white/60">Otomatis masuk ke Review</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
            {result.missedWords.map((word, idx) => (
              <div
                key={`${word.id}_${idx}`}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-black text-white">{word.japanese}</span>
                  <div>
                    <div className="text-xs font-black text-rose-400">{word.romaji}</div>
                    <div className="text-[11px] text-white/70 font-medium">{word.meaning}</div>
                  </div>
                </div>
                <button
                  id={`btn-listen-missed-${word.id}`}
                  onClick={() => speakJapanese(word.japanese)}
                  className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-transform active:scale-90 cursor-pointer"
                  title="Dengarkan pengucapan"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            id="btn-result-practice-difficult"
            onClick={onPracticeDifficultWords}
            className="w-full py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-black text-xs border border-amber-400/30 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>🔄 LATIH KATA SULIT SEKARANG</span>
          </button>
        </div>
      )}

      {/* 4. MAIN ACTION BUTTONS */}
      <div className="space-y-2.5 pt-1">
        {/* Next Stage Button */}
        {isPassed && hasNextStage && (
          <button
            id="btn-result-next-stage"
            onClick={onNextStage}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
          >
            <span>STAGE BERIKUTNYA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Play Again Button */}
        <button
          id="btn-result-play-again"
          onClick={onPlayAgain}
          className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
        >
          <RotateCcw className="w-4 h-4" />
          <span>MAIN LAGI</span>
        </button>

        {/* Back to stages / Menu */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="btn-result-stage-menu"
            onClick={onReturnToStages}
            className="py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pilih Stage</span>
          </button>

          <button
            id="btn-result-home"
            onClick={onReturnHome}
            className="py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
});
