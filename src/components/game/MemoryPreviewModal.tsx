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
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in text-center">
      {/* Header Info */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/70 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-rose-100/90 text-rose-800 font-black text-xs sm:text-sm px-3.5 py-1 rounded-full mb-3 border border-rose-200">
          <Sparkles className="w-4 h-4 text-rose-600" />
          <span>MEMORY PREVIEW</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
          {group.name}
        </h2>
        <p className="text-neutral-600 text-sm sm:text-base mt-1 font-medium">
          Simpan pola dan bunyi huruf ini dalam ingatanmu sebelum pertarungan dimulai...
        </p>

        {/* Kana Preview Cards Grid */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4 my-6 sm:my-8">
          {group.items.map((item) => (
            <div
              key={item.id}
              onClick={() => speakJapanese(item.kana)}
              className="bg-white/80 hover:bg-rose-50/90 border-2 border-neutral-200/80 hover:border-rose-300 rounded-2xl p-3 sm:p-4 text-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm group"
            >
              <span className="text-3xl sm:text-5xl font-black text-neutral-900 block font-japanese">
                {item.kana}
              </span>
              <span className="text-xs sm:text-base font-extrabold text-rose-600 uppercase mt-1 block">
                {item.romaji}
              </span>
              <button
                type="button"
                className="mt-2 text-neutral-400 group-hover:text-rose-600 transition-colors mx-auto block"
                title="Dengar pengucapan"
              >
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Countdown & Quick Action */}
        <div className="pt-2 space-y-3 max-w-sm mx-auto">
          <div className="bg-rose-50 rounded-2xl py-3 px-4 border border-rose-200">
            <span className="text-xs font-bold text-rose-700 block">Mulai otomatis dalam:</span>
            <span className="text-3xl sm:text-4xl font-black text-rose-600">
              {countdown}s
            </span>
          </div>

          <button
            id="btn-skip-preview"
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>MULAI SEKARANG</span>
            <FastForward className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
