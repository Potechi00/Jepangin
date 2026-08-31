import React, { useState, useMemo, memo } from 'react';
import { Play, ArrowLeft, Volume2 } from 'lucide-react';
import { ReadingProgressState } from '../../game/readingTypes';
import { speakJapanese } from '../../utils/audio';

interface ReadingReviewHubProps {
  progressState: ReadingProgressState;
  onStartReviewPractice: () => void;
  onBackToIntro: () => void;
}

type TabCategory = 'all' | 'difficult' | 'learning' | 'mastered';

export const ReadingReviewHub: React.FC<ReadingReviewHubProps> = memo(({
  progressState,
  onStartReviewPractice,
  onBackToIntro,
}) => {
  const [activeTab, setActiveTab] = useState<TabCategory>('all');

  const allReviewItems = useMemo(() => {
    return Object.values(progressState.reviewWords);
  }, [progressState.reviewWords]);

  const difficultItems = useMemo(() => {
    return allReviewItems.filter((i) => i.masteryLevel === 'difficult');
  }, [allReviewItems]);

  const learningItems = useMemo(() => {
    return allReviewItems.filter((i) => i.masteryLevel === 'learning');
  }, [allReviewItems]);

  const masteredItems = useMemo(() => {
    return allReviewItems.filter((i) => i.masteryLevel === 'mastered');
  }, [allReviewItems]);

  const displayedItems = useMemo(() => {
    if (activeTab === 'difficult') return difficultItems;
    if (activeTab === 'learning') return learningItems;
    if (activeTab === 'mastered') return masteredItems;
    return allReviewItems;
  }, [activeTab, difficultItems, learningItems, masteredItems, allReviewItems]);

  return (
    <div className="space-y-5 animate-fade-in select-none max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="btn-review-back"
          onClick={onBackToIntro}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/15 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-rose-400" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-400/30">
            Smart Review Center
          </span>
        </div>
      </div>

      {/* Hero Action Card (Cinematic Content Card) */}
      <div className="cinematic-content-card rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-2xl font-black border border-amber-400/30 shrink-0">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">
                Pusat Latihan Kata Sulit
              </h1>
              <span className="text-[10px] font-extrabold bg-amber-400/25 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                {allReviewItems.length} Kata Tersimpan
              </span>
            </div>
            <p className="text-xs text-white/75 font-medium mt-0.5 max-w-lg">
              Sistem akan memprioritaskan kata-kata yang paling sering kamu jawab salah agar cepat kamu kuasai.
            </p>
          </div>
        </div>

        <button
          id="btn-start-difficult-practice"
          onClick={onStartReviewPractice}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>LATIH KATA SULIT 🎯</span>
        </button>
      </div>

      {/* Category Tabs (Translucent HUD) */}
      <div className="grid grid-cols-4 gap-1.5 cinematic-floating-card p-1.5 rounded-2xl text-center">
        {/* All */}
        <button
          id="tab-review-all"
          onClick={() => setActiveTab('all')}
          className={`py-2 px-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Semua ({allReviewItems.length})
        </button>

        {/* Difficult */}
        <button
          id="tab-review-difficult"
          onClick={() => setActiveTab('difficult')}
          className={`py-2 px-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
            activeTab === 'difficult'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-red-300 hover:bg-red-500/15'
          }`}
        >
          🔴 Sulit ({difficultItems.length})
        </button>

        {/* Learning */}
        <button
          id="tab-review-learning"
          onClick={() => setActiveTab('learning')}
          className={`py-2 px-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
            activeTab === 'learning'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-amber-300 hover:bg-amber-500/15'
          }`}
        >
          🟡 Belajar ({learningItems.length})
        </button>

        {/* Mastered */}
        <button
          id="tab-review-mastered"
          onClick={() => setActiveTab('mastered')}
          className={`py-2 px-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
            activeTab === 'mastered'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-emerald-300 hover:bg-emerald-500/15'
          }`}
        >
          🟢 Dikuasai ({masteredItems.length})
        </button>
      </div>

      {/* Words List */}
      {displayedItems.length === 0 ? (
        <div className="cinematic-floating-card rounded-3xl p-8 text-center shadow-sm transition-all">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-2xl mb-3">
            ✨
          </div>
          <h2 className="text-base font-black text-white">Belum Ada Kata di Kategori Ini</h2>
          <p className="text-xs text-white/70 font-medium mt-1 max-w-sm mx-auto">
            Mainkan Stage di menu utama! Kata yang salah dijawab akan otomatis tercatat dan siap dilatih di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {displayedItems.map((item) => {
            let badgeStyle = 'bg-amber-400/20 text-amber-300 border-amber-400/30';
            let badgeText = 'Sedang Belajar';

            if (item.masteryLevel === 'difficult') {
              badgeStyle = 'bg-red-500/20 text-red-300 border-red-400/30';
              badgeText = '🔴 Perlu Latihan';
            } else if (item.masteryLevel === 'mastered') {
              badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
              badgeText = '🟢 Dikuasai';
            }

            return (
              <div
                key={item.wordId}
                className="cinematic-floating-card rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3 transition-all hover:bg-white/15"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-black text-white min-w-[48px]">
                    {item.japanese}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-rose-400">{item.romaji}</span>
                      <span className={`text-[10px] font-black px-2 py-0.2 rounded-full border ${badgeStyle}`}>
                        {badgeText}
                      </span>
                    </div>
                    <div className="text-xs text-white/70 font-medium mt-0.5">
                      {item.meaning}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-white/50 font-bold mt-0.5">
                      <span>Benar: <strong className="text-emerald-400">{item.correctCount}</strong></span>
                      <span>Salah: <strong className="text-red-400">{item.wrongCount}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-review-audio-${item.wordId}`}
                  onClick={() => speakJapanese(item.japanese)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-transform active:scale-90 cursor-pointer shrink-0"
                  title="Dengarkan suara"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
