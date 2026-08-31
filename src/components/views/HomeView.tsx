import React, { memo } from 'react';
import { Play, Flame, Sparkles, Trophy, ArrowRight, Volume2, Brain, Eye } from 'lucide-react';
import { UserProgress, NavigationTab } from '../../types';
import { findLessonById, TOTAL_LESSONS } from '../../data/courses';
import { speakJapanese } from '../../utils/audio';

interface HomeViewProps {
  progress: UserProgress;
  onStartLesson: (lessonId: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = memo(({ progress, onStartLesson, onNavigateTab }) => {
  // Find current active lesson
  const activeInfo = findLessonById(progress.activeLessonId) || findLessonById('hira-1');
  const activeLesson = activeInfo?.lesson;
  const activeCourse = activeInfo?.course;

  // Calculate percentage completed
  const completedCount = progress.completedLessonIds.length;
  const percentCompleted = Math.min(100, Math.round((completedCount / TOTAL_LESSONS) * 100));

  // Word of the day for delightful quick listening
  const dailyWord = {
    japanese: 'こんにちは',
    romaji: 'Konnichiwa',
    indonesian: 'Halo / Selamat Siang',
    tip: 'Sapaan ramah serbaguna yang bisa digunakan kepada siapa saja!',
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-fade-in select-none">
      {/* 1. JAPANESE SCENIC HERO SECTION (Cinematic Transparent Floating Card) */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 text-white transition-all cinematic-content-card">
        {/* Subtle Silhouette Highlights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <svg className="absolute bottom-0 right-6 w-36 h-36 text-white/20" viewBox="0 0 100 100" fill="currentColor">
            <path d="M5,22 Q50,15 95,22 L93,27 Q50,21 7,27 Z" />
            <path d="M12,29 L88,29 L86,33 L14,33 Z" />
            <rect x="24" y="27" width="7" height="70" rx="1" />
            <rect x="69" y="27" width="7" height="70" rx="1" />
            <rect x="45" y="24" width="10" height="12" rx="1" />
          </svg>
          <div className="absolute top-2 right-4 text-white/10 select-none font-black text-6xl tracking-widest pointer-events-none">
            日本
          </div>
        </div>

        {/* Hero Content Layer */}
        <div className="relative z-10 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold tracking-wide border border-white/20 text-rose-200">
              <span className="text-base">{progress.avatar}</span>
              <span>Konnichiwa, {progress.userName}!</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full text-xs font-black text-amber-300 border border-amber-400/30">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{progress.currentStreak} Hari Beruntun</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            Selamat Datang di <span className="text-rose-400">JEPANGIN</span>
          </h1>

          <p className="text-white/85 text-xs sm:text-base max-w-xl font-medium leading-relaxed">
            Belajar huruf Hiragana, Katakana, dan percakapan harian dengan mudah, ramah pemula, dan audio penutur asli Jepang 🌸
          </p>

          <div className="pt-1 flex items-center">
            <button
              id="btn-hero-browse-courses"
              onClick={() => onNavigateTab('belajar')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
            >
              <span>Jelajahi Materi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY NEXT ACTION: ACTIVE LESSON CARD */}
      <div className="cinematic-content-card rounded-3xl p-6 sm:p-7 shadow-xl relative transition-all">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-black text-2xl border border-rose-400/30">
              {activeCourse?.iconSymbol || 'あ'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-md border border-rose-400/30">
                  Pelajaran Aktif Anda
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white mt-0.5">
                {activeCourse?.title}: {activeLesson?.title || 'Hiragana Dasar'}
              </h2>
            </div>
          </div>
        </div>

        <p className="text-white/80 text-xs sm:text-sm mb-4 leading-relaxed font-medium">
          {activeLesson?.description || 'Pelajari huruf dasar paling penting dalam bahasa Jepang dengan mudah.'}
        </p>

        {/* Progress Bar for Active Course */}
        <div className="bg-white/15 rounded-full h-3 overflow-hidden mb-5 p-0.5 border border-white/20">
          <div
            className="bg-gradient-to-r from-rose-500 to-red-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(10, percentCompleted)}%` }}
          />
        </div>

        {/* Big Primary Next Action Button */}
        <button
          id="btn-primary-continue-learning"
          onClick={() => onStartLesson(activeLesson?.id || 'hira-1')}
          className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-600/35 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>LANJUTKAN BELAJAR</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* 3. FEATURED GAMES SECTION: MEMORY BATTLE & YOMERU READING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GAME 2: YOMERU READING CHALLENGE */}
        <div
          className="cinematic-content-card rounded-3xl p-5 sm:p-6 shadow-xl text-white relative overflow-hidden transition-all flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 50, 100, 0.40), rgba(15, 25, 45, 0.30))',
          }}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500/25 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                ✨ Game Unggulan
              </span>
              <span className="text-[11px] font-extrabold text-sky-300">"Lihat. Baca. Kuasai."</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-sky-600/30 font-black text-lg">
                よ
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  「よめる？」YOMERU!
                </h2>
                <p className="text-sky-300 text-xs font-bold">
                  Japanese Reading Challenge
                </p>
              </div>
            </div>

            <p className="text-white/75 text-xs font-medium leading-relaxed">
              Tantangan membaca kata Jepang asli langsung dengan kartu kosakata, audio asli, dan 10 stage bertahap.
            </p>
          </div>

          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-sky-300 font-semibold flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>10 Stage & Review Hub</span>
            </span>
            <button
              id="btn-home-start-yomeru"
              onClick={() => onNavigateTab('yomeru')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xs sm:text-sm shadow-md shadow-sky-600/30 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>MAIN YOMERU!</span>
            </button>
          </div>
        </div>

        {/* GAME 1: MEMORY BATTLE */}
        <div
          className="cinematic-content-card rounded-3xl p-5 sm:p-6 shadow-xl text-white relative overflow-hidden transition-all flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(100, 20, 45, 0.40), rgba(30, 15, 35, 0.30))',
          }}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/25 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-400/30">
                ⚡ Game Memori
              </span>
              <span className="text-[11px] font-extrabold text-amber-300">Hafal Cepat & Seru</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-600/30">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  MEMORY BATTLE
                </h2>
                <p className="text-rose-300 text-xs font-bold">
                  Kana Matching Challenge
                </p>
              </div>
            </div>

            <p className="text-white/75 text-xs font-medium leading-relaxed">
              Pertarungan kartu memori pintar untuk melatih refleks Hiragana & Katakana dengan kombo dan rekor kecepatan.
            </p>
          </div>

          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-rose-300 font-semibold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistem Kombo & Skor</span>
            </span>
            <button
              id="btn-home-start-memory-battle"
              onClick={() => onNavigateTab('battle')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>MAIN BATTLE ⚔️</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. CLEAN STATS ROW */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Streak */}
        <div className="cinematic-floating-card rounded-2xl p-3.5 sm:p-4 flex flex-col items-center text-center transition-all">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-1 border border-amber-400/30">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">Streak</span>
          <span className="text-base sm:text-xl font-black text-white mt-0.5">
            {progress.currentStreak} <span className="text-xs font-semibold text-white/60">Hari</span>
          </span>
        </div>

        {/* Total XP */}
        <div className="cinematic-floating-card rounded-2xl p-3.5 sm:p-4 flex flex-col items-center text-center transition-all">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 mb-1 border border-rose-400/30">
            <Sparkles className="w-4 h-4 fill-rose-400 text-rose-400" />
          </div>
          <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">Total XP</span>
          <span className="text-base sm:text-xl font-black text-white mt-0.5">
            {progress.totalXp} <span className="text-xs font-semibold text-white/60">XP</span>
          </span>
        </div>

        {/* Level */}
        <div className="cinematic-floating-card rounded-2xl p-3.5 sm:p-4 flex flex-col items-center text-center transition-all">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-1 border border-indigo-400/30">
            <Trophy className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">Level</span>
          <span className="text-base sm:text-xl font-black text-white mt-0.5">
            Lv. {progress.level}
          </span>
        </div>
      </div>

      {/* 5. KATA HARI INI (Daily Audio Word) */}
      <div className="cinematic-floating-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all">
        <div className="flex items-start sm:items-center gap-3.5">
          <button
            id="btn-speak-daily-word"
            onClick={() => speakJapanese(dailyWord.japanese)}
            className="w-11 h-11 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 transition-transform active:scale-95 cursor-pointer"
            title="Dengarkan pengucapan suara"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                Kata Hari Ini
              </span>
              <span className="text-[11px] text-white/70 font-semibold">Klik 🔊 untuk mendengar</span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white">{dailyWord.japanese}</span>
              <span className="text-xs font-bold text-amber-300">({dailyWord.romaji})</span>
              <span className="text-xs text-white/80 font-medium">= {dailyWord.indonesian}</span>
            </div>
            <p className="text-[11px] text-white/70 font-medium mt-0.5">{dailyWord.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
});
