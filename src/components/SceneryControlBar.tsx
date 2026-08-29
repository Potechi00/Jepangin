import React from 'react';
import { Mountain, Sunset, Moon, Sparkles } from 'lucide-react';
import { SceneryMode } from './JapanSceneryBackground';

interface Props {
  currentMode: SceneryMode;
  onSelectMode: (mode: SceneryMode) => void;
}

export const SceneryControlBar: React.FC<Props> = ({ currentMode, onSelectMode }) => {
  const options: { id: SceneryMode; label: string; icon: any; desc: string }[] = [
    {
      id: 'fuji_day',
      label: 'Fuji & Sakura',
      icon: Mountain,
      desc: 'Siang Cerah',
    },
    {
      id: 'kyoto_sunset',
      label: 'Kyoto Torii',
      icon: Sunset,
      desc: 'Senja Kencana',
    },
    {
      id: 'tokyo_night',
      label: 'Tokyo Shibuya',
      icon: Moon,
      desc: 'Malam Neon',
    },
  ];

  return (
    <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-md max-w-fit mx-auto mb-4">
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-black text-rose-700">
        <Sparkles className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
        <span className="hidden sm:inline">Pemandangan Jepang:</span>
      </div>

      <div className="flex items-center gap-1">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = currentMode === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelectMode(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white/50 hover:bg-white/80 text-neutral-700'
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
};
