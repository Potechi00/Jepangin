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
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/70 shadow-md mb-4">
      {/* Top row: Exit, Title, Sound */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          id="btn-exit-battle"
          onClick={onExit}
          className="flex items-center gap-1 text-neutral-600 hover:text-rose-600 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Keluar</span>
        </button>

        {/* Mode & Question Counter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-100/90 px-2.5 py-0.5 rounded-full border border-rose-200">
            {mode === 'learn' && '🌱 Mode Santai'}
            {mode === 'battle' && '⚔️ Memory Battle'}
            {mode === 'boss' && '👹 Boss Battle'}
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-neutral-700">
            Soal {currentIdx + 1} / {totalQuestions}
          </span>
        </div>

        {/* Sound toggle */}
        <button
          id="btn-toggle-sound-battle"
          onClick={onToggleSound}
          className="p-1.5 rounded-xl bg-neutral-100/80 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
          title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-600" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
        </button>
      </div>

      {/* Second Row: Hearts (if applicable) & Combo */}
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-bold">
        {/* Hearts for Challenge / Boss */}
        {mode !== 'learn' ? (
          <div className="flex items-center gap-1">
            {Array.from({ length: maxHearts }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  i < hearts
                    ? 'fill-rose-500 text-rose-500 scale-105'
                    : 'fill-neutral-300 text-neutral-300 opacity-60'
                }`}
              />
            ))}
          </div>
        ) : (
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            ✨ Tanpa Batas Nyawa
          </span>
        )}

        {/* Combo Indicator */}
        {combo >= 2 ? (
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-black px-3 py-1 rounded-full shadow-sm animate-bounce-subtle">
            <Flame className="w-4 h-4 fill-amber-200 text-amber-200" />
            <span>{combo >= 10 ? '⚡ PERFECT COMBO' : `🔥 COMBO x${combo}`}</span>
          </div>
        ) : (
          <span className="text-neutral-400 text-xs font-semibold">Fokus & Hafalkan</span>
        )}
      </div>

      {/* Linear Progress Bar */}
      <div className="bg-white/60 rounded-full h-2.5 overflow-hidden mt-3 p-0.5 border border-neutral-200/80">
        <div
          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
