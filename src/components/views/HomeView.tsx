import React from 'react';
import { Play, Flame, Sparkles, Trophy, ArrowRight, Volume2, CheckCircle2, BookOpen, PenTool, Brain, Zap } from 'lucide-react';
import { UserProgress, NavigationTab } from '../../types';
import { COURSES, findLessonById, TOTAL_LESSONS } from '../../data/courses';
import { speakJapanese } from '../../utils/audio';

interface HomeViewProps {
  progress: UserProgress;
  onStartLesson: (lessonId: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ progress, onStartLesson, onNavigateTab }) => {
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
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. JAPANESE SCENIC HERO SECTION (Mount Fuji, Torii & Sakura Panorama) */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/70 bg-gradient-to-r from-rose-900/80 via-rose-800/70 to-slate-900/80 backdrop-blur-md p-6 sm:p-9 text-white">
        {/* Scenic Art Underlay with Parallax & Vector Highlights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          {/* Glowing Red Sun Disc (Hinomaru) */}
          <div className="absolute -top-10 right-16 w-48 h-48 rounded-full bg-rose-500/60 blur-xl animate-pulse-glow" />
          
          {/* Japanese Torii Gate vector silhouette */}
          <svg className="absolute bottom-0 right-8 w-44 h-44 text-white/40" viewBox="0 0 100 100" fill="currentColor">
            {/* Top curved beam */}
            <path d="M5,22 Q50,15 95,22 L93,27 Q50,21 7,27 Z" />
            <path d="M12,29 L88,29 L86,33 L14,33 Z" />
            {/* Pillars */}
            <rect x="24" y="27" width="7" height="70" rx="1" />
            <rect x="69" y="27" width="7" height="70" rx="1" />
            {/* Central tablet */}
            <rect x="45" y="24" width="10" height="12" rx="1" />
          </svg>

          {/* Mount Fuji Silhouette in background */}
          <svg className="absolute bottom-0 right-1/4 w-72 h-36 text-white/20" viewBox="0 0 200 100" fill="currentColor">
            <path d="M0,100 L70,30 Q100,20 130,30 L200,100 Z" />
            {/* Snow cap */}
            <path d="M70,30 Q100,20 130,30 L120,48 Q100,38 80,48 Z" fill="white" opacity="0.6" />
          </svg>

          {/* Japanese Kanji Watermark */}
          <div className="absolute top-2 right-4 text-white/15 select-none font-black text-7xl tracking-widest pointer-events-none">
            日本
          </div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold tracking-wide border border-white/30 text-rose-100">
              <span className="text-base">{progress.avatar}</span>
              <span>Konnichiwa, {progress.userName}!</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-400/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-amber-200 border border-amber-300/30">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{progress.currentStreak} Hari Beruntun</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            Selamat Datang di <span className="text-rose-300">JEPANGIN</span>
          </h1>

          <p className="text-rose-100/90 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
            Belajar huruf Hiragana, Katakana, dan percakapan harian dengan mudah, ramah pemula, dan audio penutur asli Jepang 🌸
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="btn-hero-start-now"
              onClick={() => onStartLesson(activeLesson?.id || 'hira-1')}
              className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-rose-600/40 transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Mulai Belajar Sekarang</span>
            </button>
            <button
              id="btn-hero-browse-courses"
              onClick={() => onNavigateTab('belajar')}
              className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/30 transition-all cursor-pointer"
            >
              Lihat Semua Materi
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE GRANDMA TEST: BIG PRIMARY NEXT ACTION CARD */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl border-2 border-rose-500/40 p-6 sm:p-8 shadow-xl shadow-neutral-900/5 relative">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100/90 text-rose-700 flex items-center justify-center font-black text-2xl shadow-inner border border-rose-200">
              {activeCourse?.iconSymbol || 'あ'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-md border border-rose-200/60">
                  Pelajaran Aktif Anda
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-neutral-900 mt-0.5">
                {activeCourse?.title}: {activeLesson?.title || 'Hiragana Dasar'}
              </h2>
            </div>
          </div>
        </div>

        <p className="text-neutral-700 text-sm sm:text-base mb-6 leading-relaxed font-medium">
          {activeLesson?.description || 'Pelajari huruf dasar paling penting dalam bahasa Jepang dengan mudah.'}
        </p>

        {/* Progress Bar for Active Course */}
        <div className="bg-white/60 backdrop-blur-xs rounded-full h-3.5 overflow-hidden mb-6 p-0.5 border border-neutral-300/80">
          <div
            className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-700 ease-out shadow-xs"
            style={{ width: `${Math.max(10, percentCompleted)}%` }}
          />
        </div>

        {/* HUGE OBVIOUS PRIMARY BUTTON */}
        <button
          id="btn-primary-continue-learning"
          onClick={() => onStartLesson(activeLesson?.id || 'hira-1')}
          className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-lg sm:text-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>LANJUTKAN BELAJAR</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* 2.5 FEATURED: JEPANGIN — MEMORY BATTLE GAME CARD */}
      <div className="bg-gradient-to-r from-rose-900/90 via-slate-900/90 to-purple-950/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border-2 border-rose-400/40 shadow-xl text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-600/30 animate-pulse-glow">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-rose-500/30 text-rose-200 px-2.5 py-0.5 rounded-full border border-rose-400/40">
                  ⚡ Game Memori Pintar
                </span>
                <span className="text-[11px] font-extrabold text-amber-300">Hafal Tanpa Mencatat</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                JEPANGIN — MEMORY BATTLE
              </h2>
              <p className="text-rose-100/80 text-xs sm:text-sm mt-0.5 max-w-lg font-medium">
                Pertarungan memori pintar untuk menguasai Hiragana & Katakana dengan sistem pengulangan tunda & bos penjaga.
              </p>
            </div>
          </div>

          <button
            id="btn-home-start-memory-battle"
            onClick={() => onNavigateTab('battle')}
            className="px-6 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-sm sm:text-base shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shrink-0"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>MAIN BATTLE ⚔️</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. SIMPLIFIED STATS (Streak, XP, Level) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Streak */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-md flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-100/90 flex items-center justify-center text-amber-600 mb-2 border border-amber-200">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <span className="text-xs text-neutral-600 font-bold uppercase tracking-wider">Streak</span>
          <span className="text-xl sm:text-2xl font-black text-neutral-900 mt-0.5">
            {progress.currentStreak} <span className="text-xs font-semibold text-neutral-500">Hari</span>
          </span>
        </div>

        {/* Total XP */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-md flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-xl bg-rose-100/90 flex items-center justify-center text-rose-600 mb-2 border border-rose-200">
            <Sparkles className="w-6 h-6 fill-rose-500 text-rose-500" />
          </div>
          <span className="text-xs text-neutral-600 font-bold uppercase tracking-wider">Total XP</span>
          <span className="text-xl sm:text-2xl font-black text-neutral-900 mt-0.5">
            {progress.totalXp} <span className="text-xs font-semibold text-neutral-500">XP</span>
          </span>
        </div>

        {/* Level */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-md flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-100/90 flex items-center justify-center text-indigo-600 mb-2 border border-indigo-200">
            <Trophy className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-xs text-neutral-600 font-bold uppercase tracking-wider">Level</span>
          <span className="text-xl sm:text-2xl font-black text-neutral-900 mt-0.5">
            Lv. {progress.level}
          </span>
        </div>
      </div>

      {/* 4. QUICK SHORTCUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shortcut 1: Daftar Semua Materi */}
        <button
          id="btn-shortcut-all-lessons"
          onClick={() => onNavigateTab('belajar')}
          className="bg-white/80 backdrop-blur-md hover:bg-white/95 p-5 rounded-2xl border border-white/60 flex items-center gap-4 text-left transition-all group cursor-pointer shadow-md"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-100/90 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform border border-rose-200">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-neutral-900 text-base group-hover:text-rose-600 transition-colors">
              Pilih Daftar Materi Lengkap
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Hiragana, Katakana, Angka, Salam & Percakapan
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
        </button>

        {/* Shortcut 2: Latihan Kuis Cepat */}
        <button
          id="btn-shortcut-quick-practice"
          onClick={() => onNavigateTab('latihan')}
          className="bg-white/80 backdrop-blur-md hover:bg-white/95 p-5 rounded-2xl border border-white/60 flex items-center gap-4 text-left transition-all group cursor-pointer shadow-md"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform border border-amber-200">
            <PenTool className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-neutral-900 text-base group-hover:text-amber-600 transition-colors">
              Kuis & Latihan Cepat
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Uji hafalan huruf dan kosakata dalam 3 menit
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* 5. KATA HARI INI (Daily Audio Word) */}
      <div className="bg-amber-50/85 backdrop-blur-md border border-amber-200/80 rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <button
            id="btn-speak-daily-word"
            onClick={() => speakJapanese(dailyWord.japanese)}
            className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 transition-transform active:scale-95 cursor-pointer"
            title="Dengarkan pengucapan suara"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                Kata Hari Ini
              </span>
              <span className="text-xs text-amber-700 font-medium">Klik ikon 🔊 untuk dengar</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-neutral-900">{dailyWord.japanese}</span>
              <span className="text-sm font-bold text-amber-900">({dailyWord.romaji})</span>
              <span className="text-sm text-neutral-700 font-medium">= {dailyWord.indonesian}</span>
            </div>
            <p className="text-xs text-neutral-600 mt-1">{dailyWord.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
