import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Flame, Heart } from 'lucide-react';
import { GameMode } from '../../game/types';

interface BattleHeaderProps {
  mode: GameMode;
  currentIdx: number;
  totalQuestions: number;
  combo: number;
  hearts: number;
  maxHearts: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onExit: () => void;
}

export const BattleHeader: React.FC<BattleHeaderProps> = ({
  mode,
  currentIdx,
  totalQuestions,
  combo,
  hearts,
  maxHearts,
  soundEnabled,
  onToggleSound,
  onExit,
}) => {
  const progressPercent = Math.min(100, Math.round(((currentIdx + 1) / totalQuestions) * 100));

  return (
    <div
      className="shrink-0 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm"
      style={{
        background: 'rgba(20, 20, 30, 0.40)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      {/* Top row: Exit, Title, Sound */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <button
          id="btn-exit-battle"
          onClick={onExit}
          className="flex items-center gap-1 text-white/80 hover:text-rose-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Keluar</span>
        </button>

        {/* Mode & Question Counter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-300 bg-rose-500/25 px-2.5 py-0.5 rounded-full border border-rose-400/30">
            {mode === 'learn' && '🌱 Mode Santai'}
            {mode === 'battle' && '⚔️ Memory Battle'}
            {mode === 'boss' && '👹 Boss Battle'}
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white">
            Soal {currentIdx + 1} <span className="text-white/60 font-semibold">/ {totalQuestions}</span>
          </span>
        </div>

        {/* Sound toggle */}
        <button
          id="btn-toggle-sound-battle"
          onClick={onToggleSound}
          className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/15"
          title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-300" /> : <VolumeX className="w-4 h-4 text-white/40" />}
        </button>
      </div>

      {/* Second Row: Hearts (if applicable) & Combo */}
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-bold">
        {/* Hearts for Challenge / Boss */}
        {mode !== 'learn' ? (
          <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-xl border border-white/15">
            {Array.from({ length: maxHearts }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-transform ${
                  i < hearts
                    ? 'fill-red-500 text-red-500 scale-105'
                    : 'fill-white/20 text-white/20 opacity-40'
                }`}
              />
            ))}
          </div>
        ) : (
          <span className="text-xs text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
            ✨ Tanpa Batas Nyawa
          </span>
        )}

        {/* Combo Indicator */}
        {combo >= 2 ? (
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-black px-3 py-0.5 rounded-full shadow-sm animate-bounce-subtle">
            <Flame className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
            <span>{combo >= 10 ? '⚡ PERFECT COMBO' : `🔥 COMBO x${combo}`}</span>
          </div>
        ) : (
          <span className="text-white/60 text-xs font-semibold">Fokus & Hafalkan</span>
        )}
      </div>

      {/* Linear Progress Bar */}
      <div className="bg-white/15 rounded-full h-2 overflow-hidden mt-2.5 p-0.5 border border-white/20">
        <div
          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
