import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Sparkles, FastForward } from 'lucide-react';
import { KanaGroup } from '../../game/kanaData';
import { speakJapanese } from '../../utils/audio';

interface MemoryPreviewModalProps {
  group: KanaGroup;
  onStartBattle: () => void;
}

export const MemoryPreviewModal: React.FC<MemoryPreviewModalProps> = ({ group, onStartBattle }) => {
  const [countdown, setCountdown] = useState(6);
  const onStartBattleRef = useRef(onStartBattle);
  onStartBattleRef.current = onStartBattle;

  const hasStartedRef = useRef(false);

  const handleStart = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    onStartBattleRef.current();
  };

  useEffect(() => {
    if (countdown <= 0) {
      handleStart();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12 animate-fade-in text-center">
      {/* Header Info */}
      <div className="cinematic-content-card rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 font-black text-xs sm:text-sm px-3.5 py-1 rounded-full mb-3 border border-rose-400/30">
          <Sparkles className="w-4 h-4 text-rose-300" />
          <span>MEMORY PREVIEW</span>
        </div>

        <h2 className="text-xl sm:text-3xl font-black text-white">
          {group.name}
        </h2>
        <p className="text-white/80 text-xs sm:text-sm mt-1 font-medium">
          Simpan pola dan bunyi huruf ini dalam ingatanmu sebelum pertarungan dimulai...
        </p>

        {/* Kana Preview Cards Grid */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3.5 my-5 sm:my-7">
          {group.items.map((item) => (
            <div
              key={item.id}
              onClick={() => speakJapanese(item.kana)}
              className="cinematic-floating-card hover:bg-white/25 rounded-2xl p-2.5 sm:p-4 text-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm group"
            >
              <span className="text-2xl sm:text-4xl font-black text-white block font-japanese">
                {item.kana}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-rose-300 uppercase mt-1 block">
                {item.romaji}
              </span>
              <button
                type="button"
                className="mt-1.5 text-white/50 group-hover:text-rose-300 transition-colors mx-auto block"
                title="Dengar pengucapan"
              >
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Countdown & Quick Action */}
        <div className="pt-2 space-y-3 max-w-sm mx-auto">
          <div className="bg-rose-500/15 rounded-2xl py-2.5 px-4 border border-rose-400/25">
            <span className="text-xs font-bold text-rose-300 block">Mulai otomatis dalam:</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-200">
              {countdown}s
            </span>
          </div>

          <button
            id="btn-skip-preview"
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-base shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>MULAI SEKARANG</span>
            <FastForward className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
