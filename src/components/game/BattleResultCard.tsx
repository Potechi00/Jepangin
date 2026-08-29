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
    <div className="max-w-xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-emerald-400/80 p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Top Trophy Banner */}
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-inner">
          {summary.mode === 'boss' && summary.bossDefeated ? (
            <Award className="w-12 h-12 text-purple-600" />
          ) : isPerfect ? (
            <Trophy className="w-12 h-12 text-amber-500 fill-amber-400" />
          ) : (
            <Trophy className="w-12 h-12 text-emerald-600" />
          )}
        </div>

        <div>
          <span className="bg-emerald-100 text-emerald-900 font-extrabold text-xs px-3.5 py-1 rounded-full border border-emerald-200">
            {summary.mode === 'boss'
              ? summary.bossDefeated
                ? '👹 BOS MEMORI DIKALAHKAN!'
                : 'BOS BATTLE SELESAI'
              : 'BATTLE COMPLETE! 🎉'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-2">
            {summary.groupTitle}
          </h2>
          <p className="text-neutral-600 text-xs sm:text-sm mt-1 font-medium">
            {isPerfect
              ? 'Luar biasa! Seluruh hafalan huruf kamu sempurna tanpa salah!'
              : 'Pertarungan yang hebat! Terus latih memori agar semakin melekat kuat.'}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Score */}
          <div className="bg-white/80 border border-neutral-200/90 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-bold text-neutral-500 block uppercase">Skor</span>
            <span className="text-lg sm:text-2xl font-black text-neutral-900 mt-0.5">
              {summary.correctAnswers}/{summary.totalQuestions}
            </span>
          </div>

          {/* Accuracy */}
          <div className="bg-white/80 border border-neutral-200/90 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-bold text-neutral-500 block uppercase">Akurasi</span>
            <span className="text-lg sm:text-2xl font-black text-emerald-600 mt-0.5">
              {summary.accuracy}%
            </span>
          </div>

          {/* Best Combo */}
          <div className="bg-white/80 border border-neutral-200/90 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-bold text-neutral-500 block uppercase">Best Combo</span>
            <span className="text-lg sm:text-2xl font-black text-amber-600 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>x{summary.bestCombo}</span>
            </span>
          </div>
        </div>

        {/* XP Reward Banner */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 text-left">
            <Sparkles className="w-6 h-6 fill-amber-200 text-amber-200" />
            <div>
              <span className="text-xs font-bold text-rose-100 block">Bonus XP Didapat</span>
              <span className="text-xl sm:text-2xl font-black">+{summary.xpEarned} XP</span>
            </div>
          </div>
          <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full border border-white/30">
            Tersimpan Otomatis
          </span>
        </div>

        {/* Memory Status Breakdown */}
        <div className="text-left space-y-2 pt-2 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
              Status Kekuatan Memori Huruf
            </span>
            <span className="text-[11px] text-neutral-400">Tersimpan di Profil</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {summary.testedKanaRecords.map((rec) => {
              const tier = getMemoryTier(rec.strength);
              return (
                <div
                  key={rec.kanaId}
                  className="bg-white/80 border border-neutral-200/80 rounded-xl p-2.5 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-black font-japanese text-neutral-900">
                      {rec.kana}
                    </span>
                    <div>
                      <span className="text-xs font-bold uppercase text-neutral-700 block">
                        {rec.romaji}
                      </span>
                      <div className="w-16 bg-neutral-100 rounded-full h-1.5 overflow-hidden mt-1">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${rec.strength}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 ${tier.badgeColor}`}
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
        <div className="space-y-3 pt-2">
          <button
            id="btn-result-continue"
            onClick={onContinue}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-lg sm:text-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 cursor-pointer transition-transform active:scale-95"
          >
            <span>LANJUTKAN</span>
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            {hasWeakKana && (
              <button
                id="btn-result-practice-weak"
                onClick={onPracticeWeak}
                className="flex-1 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
              >
                <Target className="w-4 h-4" />
                <span>Latih Huruf Lemah ({summary.weakKanaIds.length})</span>
              </button>
            )}

            <button
              id="btn-result-replay"
              onClick={onReplay}
              className="flex-1 py-3.5 px-4 rounded-xl bg-white/80 hover:bg-white text-neutral-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer border border-neutral-200 transition-colors"
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
