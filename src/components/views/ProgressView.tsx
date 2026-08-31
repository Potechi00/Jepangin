import React, { memo } from 'react';
import { BarChart3, Flame, Sparkles, Trophy, CheckCircle2, Award, Calendar } from 'lucide-react';
import { UserProgress } from '../../types';
import { COURSES, TOTAL_LESSONS } from '../../data/courses';
import { getLevelTitle } from '../../utils/storage';

interface ProgressViewProps {
  progress: UserProgress;
  onStartLesson: (lessonId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = memo(({ progress }) => {
  const completedCount = progress.completedLessonIds.length;
  const percentComplete = Math.min(100, Math.round((completedCount / TOTAL_LESSONS) * 100));
  const levelTitle = getLevelTitle(progress.level);

  // Simple day streak tracker (last 7 days)
  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="space-y-5 pb-12 animate-fade-in select-none">
      {/* Header HUD */}
      <div className="cinematic-content-card rounded-3xl p-5 sm:p-7 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-rose-400" />
          <span className="cinematic-tag text-rose-300 border-rose-400/30">
            Statistik Belajar
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-sm">
          Kemajuan Belajar Anda
        </h1>
        <p className="text-white/80 text-xs sm:text-sm mt-1 font-medium">
          Pantau konsistensi dan perkembangan belajarmu dengan ringkas dan jelas.
        </p>
      </div>

      {/* 3 CORE STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Streak */}
        <div className="cinematic-floating-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 hover:border-amber-400/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0 border border-amber-400/30">
            <Flame className="w-7 h-7 fill-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-300/90 tracking-wider">Streak Harian</span>
            <div className="text-xl sm:text-2xl font-black text-white">
              {progress.currentStreak} <span className="text-xs font-bold text-white/60">Hari</span>
            </div>
            <p className="text-[11px] text-white/70 font-medium">Belajar konsisten</p>
          </div>
        </div>

        {/* XP */}
        <div className="cinematic-floating-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 hover:border-rose-400/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400 shrink-0 border border-rose-400/30">
            <Sparkles className="w-7 h-7 fill-rose-400" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-rose-300/90 tracking-wider">Total XP</span>
            <div className="text-xl sm:text-2xl font-black text-white">
              {progress.totalXp.toLocaleString()} <span className="text-xs font-bold text-white/60">XP</span>
            </div>
            <p className="text-[11px] text-white/70 font-medium">Poin pengalaman</p>
          </div>
        </div>

        {/* Level */}
        <div className="cinematic-floating-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 hover:border-indigo-400/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-400/30">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-indigo-300/90 tracking-wider">Tingkat Level</span>
            <div className="text-xl sm:text-2xl font-black text-white">
              Level {progress.level}
            </div>
            <p className="text-[11px] text-indigo-300 font-extrabold truncate">{levelTitle}</p>
          </div>
        </div>
      </div>

      {/* 7-Day Consistency Tracker */}
      <div className="cinematic-content-card rounded-3xl p-5 sm:p-6 space-y-3.5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-rose-400" />
          <h3 className="font-black text-white text-sm sm:text-base">
            Absensi Belajar Minggu Ini
          </h3>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayIdx;
            const isCompleted = idx <= todayIdx;

            return (
              <div
                key={day}
                className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  isToday
                    ? 'bg-rose-500/25 border-rose-400 font-black text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300 font-bold'
                    : 'bg-white/5 border-white/10 text-white/50'
                }`}
              >
                <span className="text-[11px] sm:text-xs">{day}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/20" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum Completion Overview */}
      <div className="cinematic-content-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-rose-400" />
            <h3 className="font-black text-white text-sm sm:text-base">
              Penyelesaian Materi Keseluruhan
            </h3>
          </div>
          <span className="text-xs sm:text-sm font-black text-rose-400">
            {completedCount} dari {TOTAL_LESSONS} Pelajaran ({percentComplete}%)
          </span>
        </div>

        <div className="bg-white/10 rounded-full h-3 overflow-hidden p-0.5 border border-white/15">
          <div
            className="bg-gradient-to-r from-rose-500 to-red-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(5, percentComplete)}%` }}
          />
        </div>

        {/* List of courses status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {COURSES.map((course) => {
            const totalInCourse = course.lessons.length;
            const completedInCourse = course.lessons.filter(l => progress.completedLessonIds.includes(l.id)).length;
            const isAllDone = completedInCourse === totalInCourse && totalInCourse > 0;

            return (
              <div
                key={course.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-bold text-base text-white">
                    {course.iconSymbol}
                  </span>
                  <div>
                    <h4 className="font-black text-white text-xs sm:text-sm">{course.title}</h4>
                    <p className="text-[11px] text-white/70 font-medium">
                      {completedInCourse}/{totalInCourse} Selesai
                    </p>
                  </div>
                </div>

                {isAllDone && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-md border border-emerald-400/30">
                    Tuntas 🏆
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
