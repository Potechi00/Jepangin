import React from 'react';
import { Trophy, Flame, Sparkles, RotateCcw, ArrowRight, Target, CheckCircle2, Award } from 'lucide-react';
import { BattleSessionSummary, getMemoryTier } from '../../game/types';
import { KanaGroup } from '../../game/kanaData';

interface BattleResultCardProps {
  summary: BattleSessionSummary;
  group?: KanaGroup;
  onContinue: () => void;
  onPracticeWeak: () => void;
  onReplay: () => void;
}

export const BattleResultCard: React.FC<BattleResultCardProps> = ({
  summary,
  group,
  onContinue,
  onPracticeWeak,
  onReplay,
}) => {
  const hasWeakKana = summary.weakKanaIds.length > 0;
  const isPerfect = summary.accuracy === 100;

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-12 animate-fade-in">
      <div className="cinematic-content-card rounded-3xl border border-emerald-400/50 p-5 sm:p-8 shadow-2xl text-center space-y-5">
        {/* Top Trophy Banner */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-400/40 shadow-inner">
          {summary.mode === 'boss' && summary.bossDefeated ? (
            <Award className="w-10 h-10 sm:w-12 sm:h-12 text-purple-300" />
          ) : isPerfect ? (
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 fill-amber-400" />
          ) : (
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-300" />
          )}
        </div>

        <div>
          <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-xs px-3.5 py-1 rounded-full border border-emerald-400/30">
            {summary.mode === 'boss'
              ? summary.bossDefeated
                ? '👹 BOS MEMORI DIKALAHKAN!'
                : 'BOS BATTLE SELESAI'
              : 'BATTLE COMPLETE! 🎉'}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-white mt-2">
            {summary.groupTitle}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1 font-medium">
            {isPerfect
              ? 'Luar biasa! Seluruh hafalan huruf kamu sempurna tanpa salah!'
              : 'Pertarungan yang hebat! Terus latih memori agar semakin melekat kuat.'}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Score */}
          <div className="cinematic-floating-card rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-[11px] font-bold text-white/60 block uppercase">Skor</span>
            <span className="text-base sm:text-xl font-black text-white mt-0.5">
              {summary.correctAnswers}/{summary.totalQuestions}
            </span>
          </div>

          {/* Accuracy */}
          <div className="cinematic-floating-card rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-[11px] font-bold text-white/60 block uppercase">Akurasi</span>
            <span className="text-base sm:text-xl font-black text-emerald-300 mt-0.5">
              {summary.accuracy}%
            </span>
          </div>

          {/* Best Combo */}
          <div className="cinematic-floating-card rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-[11px] font-bold text-white/60 block uppercase">Best Combo</span>
            <span className="text-base sm:text-xl font-black text-amber-300 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>x{summary.bestCombo}</span>
            </span>
          </div>
        </div>

        {/* XP Reward Banner */}
        <div className="bg-gradient-to-r from-rose-600/80 to-amber-600/80 border border-white/20 text-white rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 text-left">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-200 text-amber-200" />
            <div>
              <span className="text-[11px] font-bold text-rose-100 block">Bonus XP Didapat</span>
              <span className="text-lg sm:text-2xl font-black">+{summary.xpEarned} XP</span>
            </div>
          </div>
          <span className="text-[11px] font-black bg-white/20 px-2.5 py-1 rounded-full border border-white/30">
            Tersimpan Otomatis
          </span>
        </div>

        {/* Memory Status Breakdown */}
        <div className="text-left space-y-2 pt-2 border-t border-white/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-white/70">
              Status Kekuatan Memori Huruf
            </span>
            <span className="text-[10px] text-white/50">Tersimpan di Profil</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {summary.testedKanaRecords.map((rec) => {
              const tier = getMemoryTier(rec.strength);
              return (
                <div
                  key={rec.kanaId}
                  className="cinematic-floating-card rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl sm:text-2xl font-black font-japanese text-white">
                      {rec.kana}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-white/80 block">
                        {rec.romaji}
                      </span>
                      <div className="w-14 bg-white/10 rounded-full h-1.5 overflow-hidden mt-1 border border-white/15">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${rec.strength}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 ${tier.badgeColor}`}
                  >
                    <span>{tier.icon}</span>
                    <span>{tier.label.split(' ')[0]}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            id="btn-result-continue"
            onClick={onContinue}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 cursor-pointer transition-transform active:scale-95"
          >
            <span>LANJUTKAN</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            {hasWeakKana && (
              <button
                id="btn-result-practice-weak"
                onClick={onPracticeWeak}
                className="flex-1 py-3 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Target className="w-4 h-4" />
                <span>Latih Huruf Lemah ({summary.weakKanaIds.length})</span>
              </button>
            )}

            <button
              id="btn-result-replay"
              onClick={onReplay}
              className="flex-1 py-3 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer border border-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
