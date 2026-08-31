import React, { memo } from 'react';
import { Mountain, Sunset, Moon, Sparkles } from 'lucide-react';
import { SceneryMode } from './JapanSceneryBackground';

interface Props {
  currentMode: SceneryMode;
  onSelectMode: (mode: SceneryMode) => void;
}

export const SceneryControlBar: React.FC<Props> = memo(({ currentMode, onSelectMode }) => {
  const options: { id: SceneryMode; label: string; icon: any; desc: string }[] = [
    {
      id: 'fuji_day',
      label: 'Fuji & Sakura',
      icon: Mountain,
      desc: 'Siang Cerah Gunung Fuji',
    },
    {
      id: 'kyoto_sunset',
      label: 'Kyoto Torii',
      icon: Sunset,
      desc: 'Senja Kencana Fushimi Inari',
    },
    {
      id: 'tokyo_night',
      label: 'Tokyo Shibuya',
      icon: Moon,
      desc: 'Malam Neon Shibuya Sky',
    },
  ];

  return (
    <div
      className="flex items-center justify-between gap-1.5 sm:gap-2 p-1.5 rounded-2xl shadow-lg max-w-fit mx-auto mb-4 select-none"
      style={{
        background: 'rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
      }}
    >
      <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-black text-rose-800">
        <Sparkles className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
        <span className="hidden sm:inline">Pemandangan:</span>
      </div>

      <div className="flex items-center gap-1">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = currentMode === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelectMode(opt.id)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-white/25 hover:bg-white/45 text-neutral-800 border border-white/20'
              }`}
              title={opt.desc}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
