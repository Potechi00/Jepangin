import React, { useState } from 'react';
import { X, Trophy, Volume2, Sparkles, Filter } from 'lucide-react';
import { ALL_KANA_ITEMS, KANA_GROUPS } from '../../game/kanaData';
import { KanaMemoryRecord, getMemoryTier } from '../../game/types';
import { speakJapanese } from '../../utils/audio';

interface KanaStatusModalProps {
  records: Record<string, KanaMemoryRecord>;
  onClose: () => void;
}

export const KanaStatusModal: React.FC<KanaStatusModalProps> = ({ records, onClose }) => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');

  const filteredGroups = KANA_GROUPS.filter((g) => g.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div
        className="rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl space-y-5 my-auto"
        style={{
          background: 'rgba(20, 20, 30, 0.94)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-black text-xl border border-rose-400/30">
              📊
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-white">
                Peta Kekuatan Memori Kana
              </h3>
              <p className="text-xs text-white/70">
                Status hafalan otomatis tersimpan setiap kali kamu bermain
              </p>
            </div>
          </div>

          <button
            id="btn-close-kana-status"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/15"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Hiragana vs Katakana */}
        <div className="flex bg-white/10 p-1 rounded-2xl border border-white/15">
          <button
            id="btn-tab-kana-hiragana"
            onClick={() => setActiveTab('hiragana')}
            className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'hiragana'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            🌸 Hiragana
          </button>
          <button
            id="btn-tab-kana-katakana"
            onClick={() => setActiveTab('katakana')}
            className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'katakana'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            ⚡ Katakana
          </button>
        </div>

        {/* Groups & Kana items */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="cinematic-floating-card rounded-2xl p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs font-black uppercase text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-400/30">
                    {group.name}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {group.title}
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {group.items.map((item) => {
                  const rec = records[item.id] || {
                    strength: 0,
                    correctCount: 0,
                    wrongCount: 0,
                  };
                  const tier = getMemoryTier(rec.strength);

                  return (
                    <div
                      key={item.id}
                      onClick={() => speakJapanese(item.kana)}
                      className="bg-white/10 border border-white/15 hover:border-rose-400 rounded-xl p-2 text-center cursor-pointer transition-all hover:scale-105 active:scale-95 group relative"
                    >
                      <span className="text-xl sm:text-2xl font-black font-japanese text-white block group-hover:text-rose-300">
                        {item.kana}
                      </span>
                      <span className="text-[10px] font-bold text-white/70 uppercase block">
                        {item.romaji}
                      </span>

                      {/* Mini strength bar */}
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mt-1 border border-white/10">
                        <div
                          className={`h-full ${
                            rec.strength >= 70
                              ? 'bg-emerald-400'
                              : rec.strength >= 40
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                          style={{ width: `${Math.max(8, rec.strength)}%` }}
                        />
                      </div>

                      <span className="text-[9px] font-extrabold text-white/60 mt-0.5 block">
                        {rec.strength}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="bg-white/10 rounded-2xl p-3 border border-white/15 flex flex-wrap items-center justify-around gap-2 text-xs font-bold text-white/80">
          <span className="flex items-center gap-1">
            <span>🏆</span>
            <span>Mastered (90-100%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span>🟢</span>
            <span>Kuat (70-89%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span>🟡</span>
            <span>Belajar (40-69%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span>🔴</span>
            <span>Butuh Latihan (&lt;40%)</span>
          </span>
        </div>

        <button
          id="btn-close-modal-bottom"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm cursor-pointer transition-colors border border-white/20"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
