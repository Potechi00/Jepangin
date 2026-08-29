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
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/80 shadow-2xl space-y-6 text-neutral-900 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xl border border-rose-200">
              📊
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                Peta Kekuatan Memori Kana
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600">
                Status hafalan otomatis tersimpan setiap kali kamu bermain
              </p>
            </div>
          </div>

          <button
            id="btn-close-kana-status"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Hiragana vs Katakana */}
        <div className="flex bg-neutral-100 p-1 rounded-2xl">
          <button
            id="btn-tab-kana-hiragana"
            onClick={() => setActiveTab('hiragana')}
            className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
              activeTab === 'hiragana'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            🌸 Hiragana
          </button>
          <button
            id="btn-tab-kana-katakana"
            onClick={() => setActiveTab('katakana')}
            className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
              activeTab === 'katakana'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            ⚡ Katakana
          </button>
        </div>

        {/* Groups & Kana items */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white/80 border border-neutral-200/90 rounded-2xl p-4 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {group.name}
                  </span>
                  <h4 className="text-base font-bold text-neutral-900 mt-1">
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
                      className="bg-white border border-neutral-200 hover:border-rose-300 rounded-xl p-2 text-center cursor-pointer transition-all hover:scale-105 active:scale-95 group relative"
                    >
                      <span className="text-2xl sm:text-3xl font-black font-japanese text-neutral-900 block group-hover:text-rose-600">
                        {item.kana}
                      </span>
                      <span className="text-[11px] font-bold text-neutral-500 uppercase block">
                        {item.romaji}
                      </span>

                      {/* Mini strength bar */}
                      <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden mt-1.5">
                        <div
                          className={`h-full ${
                            rec.strength >= 70
                              ? 'bg-emerald-500'
                              : rec.strength >= 40
                              ? 'bg-amber-500'
                              : 'bg-rose-400'
                          }`}
                          style={{ width: `${Math.max(8, rec.strength)}%` }}
                        />
                      </div>

                      <span className="text-[9px] font-extrabold text-neutral-500 mt-0.5 block">
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
        <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200 flex flex-wrap items-center justify-around gap-2 text-xs font-bold text-neutral-700">
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
          className="w-full py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-sm cursor-pointer transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
