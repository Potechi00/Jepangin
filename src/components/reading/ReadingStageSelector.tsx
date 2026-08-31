import React, { useState, memo } from 'react';
import { Lock, Star, Play, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ReadingProgressState } from '../../game/readingTypes';
import { READING_STAGES } from '../../game/readingData';

interface ReadingStageSelectorProps {
  progressState: ReadingProgressState;
  onSelectStage: (stageId: number) => void;
  onBackToIntro: () => void;
}

type DifficultyMode = 'easy' | 'normal' | 'hard';

export const ReadingStageSelector: React.FC<ReadingStageSelectorProps> = memo(({
  progressState,
  onSelectStage,
  onBackToIntro,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyMode>('easy');

  // Check unlocks
  const isNormalUnlocked = progressState.unlockedStages.includes(6) || progressState.normalModeUnlocked;
  const isHardUnlocked = progressState.unlockedStages.includes(10) || progressState.hardModeUnlocked;

  return (
    <div className="space-y-5 animate-fade-in select-none max-w-4xl mx-auto">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <button
          id="btn-stage-selector-back"
          onClick={onBackToIntro}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/15 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-rose-400" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-400/30">
            Pilih Stage
          </span>
        </div>
      </div>

      {/* Difficulty Mode Selector Tabs (Translucent HUD) */}
      <div className="grid grid-cols-3 gap-2 cinematic-floating-card p-1.5 rounded-2xl">
        {/* EASY (Active) */}
        <button
          id="btn-diff-easy"
          onClick={() => setSelectedDifficulty('easy')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            selectedDifficulty === 'easy'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="text-emerald-400">🟢</span>
          <span>EASY</span>
          <span className="text-[10px] sm:text-xs opacity-80 hidden sm:inline">(Short Words)</span>
        </button>

        {/* NORMAL (Locked placeholder) */}
        <button
          id="btn-diff-normal"
          onClick={() => {
            if (isNormalUnlocked) {
              setSelectedDifficulty('normal');
            }
          }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-black text-xs sm:text-sm transition-all ${
            isNormalUnlocked
              ? (selectedDifficulty === 'normal' ? 'bg-rose-600 text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer')
              : 'text-white/40 bg-white/5 cursor-not-allowed opacity-60'
          }`}
          title={isNormalUnlocked ? 'Mode Normal' : 'Terkunci: Selesaikan Stage 5 Easy'}
        >
          <Lock className="w-3.5 h-3.5 text-white/50" />
          <span>NORMAL</span>
          <span className="text-[10px] opacity-75 hidden sm:inline">(Medium)</span>
        </button>

        {/* HARD (Locked placeholder) */}
        <button
          id="btn-diff-hard"
          onClick={() => {
            if (isHardUnlocked) {
              setSelectedDifficulty('hard');
            }
          }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-black text-xs sm:text-sm transition-all ${
            isHardUnlocked
              ? (selectedDifficulty === 'hard' ? 'bg-rose-600 text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer')
              : 'text-white/40 bg-white/5 cursor-not-allowed opacity-60'
          }`}
          title={isHardUnlocked ? 'Mode Hard' : 'Terkunci: Selesaikan Stage 10 Easy'}
        >
          <Lock className="w-3.5 h-3.5 text-white/50" />
          <span>HARD</span>
          <span className="text-[10px] opacity-75 hidden sm:inline">(Sentences)</span>
        </button>
      </div>

      {/* Mode Description & Lock Notice */}
      {selectedDifficulty === 'easy' ? (
        <div className="cinematic-floating-card rounded-2xl p-3.5 sm:p-4 text-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-white">EASY MODE: 250 Kosakata Pendek</h2>
              <p className="text-[11px] sm:text-xs text-white/75 font-medium">
                10 Stage progresif (25 kata/stage). Sesi bermain mengambil 10 kata acak.
              </p>
            </div>
          </div>
          <div className="text-xs font-black text-rose-300 bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-400/30 text-center shrink-0">
            Terbuka: {progressState.unlockedStages.length} / 10 Stage
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-4 bg-amber-500/15 border border-amber-400/30 text-amber-200 flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h2 className="font-black text-xs sm:text-sm text-white">Mode Ini Masih Terkunci</h2>
            <p className="text-[11px] text-amber-200/80 font-semibold mt-0.5">
              {selectedDifficulty === 'normal'
                ? 'Selesaikan hingga Stage 5 di mode EASY dengan minimal 1 bintang untuk membuka mode NORMAL.'
                : 'Selesaikan seluruh 10 Stage di mode EASY untuk membuka tantangan mode HARD.'}
            </p>
          </div>
        </div>
      )}

      {/* 10 STAGES LIST / GRID */}
      {selectedDifficulty === 'easy' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {READING_STAGES.map((stage) => {
            const isUnlocked = progressState.unlockedStages.includes(stage.id) || stage.id === 1;
            const stageRecord = progressState.stages[stage.id] || {
              stageId: stage.id,
              isUnlocked,
              isCompleted: false,
              stars: 0,
              bestScore: 0,
              bestAccuracy: 0,
              timesPlayed: 0,
            };

            const stars = stageRecord.stars;

            return (
              <div
                key={stage.id}
                id={`stage-card-${stage.id}`}
                className={`rounded-3xl p-5 shadow-lg relative transition-all flex flex-col justify-between gap-3.5 ${
                  isUnlocked
                    ? 'cinematic-content-card hover:border-rose-400/50 cursor-pointer group'
                    : 'cinematic-floating-card opacity-50 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectStage(stage.id);
                  }
                }}
              >
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl border ${
                        isUnlocked
                          ? 'bg-rose-500/20 border-rose-400/30 text-white'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      {stage.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-400/30">
                          {stage.title}
                        </span>
                        {stageRecord.isCompleted && (
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-400/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Selesai
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-black text-white mt-0.5">
                        {stage.subtitle}
                      </h3>
                    </div>
                  </div>

                  {/* Lock Indicator or Stars */}
                  {isUnlocked ? (
                    <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-white/75 font-medium leading-relaxed">
                  {stage.description}
                </p>

                {/* Footer / Stats and Action */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="text-[11px] text-white/60 font-medium">
                    {stageRecord.timesPlayed > 0 ? (
                      <span>Skor Terbaik: <strong className="text-white font-extrabold">{stageRecord.bestScore}</strong></span>
                    ) : (
                      <span className="italic">Belum dimainkan</span>
                    )}
                  </div>

                  {isUnlocked ? (
                    <button
                      id={`btn-play-stage-${stage.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStage(stage.id);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{stageRecord.timesPlayed > 0 ? 'Main Lagi' : 'Mulai'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-white/40 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Selesaikan Stage {stage.id - 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
