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
    <div
      className="rounded-3xl p-4 sm:p-5 border shadow-xl text-white mb-4 relative overflow-hidden shrink-0"
      style={{
        background: 'rgba(25, 15, 40, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(192, 132, 252, 0.35)',
      }}
    >
      {/* Visual glowing aura */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-800/60 border border-purple-400/50 flex items-center justify-center text-2xl sm:text-3xl shadow-inner animate-pulse">
            {group.boss.avatar || '👹'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-md border border-purple-400/40">
                Ujian Bos Memori
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
              {group.boss.name}
            </h2>
            <p className="text-[11px] text-purple-200/80 line-clamp-1">{group.boss.title}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold text-purple-300 block">Sisa Daya Bos</span>
          <span className="text-base sm:text-xl font-black text-amber-300">
            {bossHp} / {maxHp} HP
          </span>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mt-3">
        <div className="bg-slate-950/80 rounded-full h-3 sm:h-3.5 overflow-hidden p-0.5 border border-purple-400/30 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 shadow-md"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <p className="text-[10px] sm:text-[11px] text-purple-200/90 text-center mt-1 font-medium">
          Setiap jawaban tepat akan memecah kabut ingatan bos! ⚔️
        </p>
      </div>
    </div>
  );
};
