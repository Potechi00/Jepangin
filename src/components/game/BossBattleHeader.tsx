import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { KanaGroup } from '../../game/kanaData';

interface BossBattleHeaderProps {
  group: KanaGroup;
  bossHp: number;
  maxHp: number;
}

export const BossBattleHeader: React.FC<BossBattleHeaderProps> = ({ group, bossHp, maxHp }) => {
  const hpPercent = Math.max(0, Math.min(100, Math.round((bossHp / maxHp) * 100)));

  return (
    <div className="bg-gradient-to-r from-purple-900/90 via-slate-900/90 to-rose-950/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border-2 border-purple-400/50 shadow-xl text-white mb-5 relative overflow-hidden">
      {/* Visual glowing aura */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-800/80 border-2 border-purple-400/70 flex items-center justify-center text-3xl shadow-inner animate-pulse">
            {group.boss.avatar || '👹'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-md border border-purple-400/40">
                Ujian Bos Memori
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
              {group.boss.name}
            </h2>
            <p className="text-xs text-purple-200/80 line-clamp-1">{group.boss.title}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-purple-300 block">Sisa Daya Bos</span>
          <span className="text-lg sm:text-2xl font-black text-amber-300">
            {bossHp} / {maxHp} HP
          </span>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mt-4">
        <div className="bg-slate-950/80 rounded-full h-4 overflow-hidden p-0.5 border border-purple-400/40 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 shadow-md"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-purple-200/90 text-center mt-1.5 font-medium">
          Setiap jawaban tepat akan memecah kabut ingatan bos! ⚔️
        </p>
      </div>
    </div>
  );
};
