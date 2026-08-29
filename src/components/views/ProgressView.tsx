import React from 'react';
import { BarChart3, Flame, Sparkles, Trophy, CheckCircle2, Award, Calendar, BookOpen } from 'lucide-react';
import { UserProgress } from '../../types';
import { COURSES, TOTAL_LESSONS } from '../../data/courses';
import { getLevelTitle } from '../../utils/storage';

interface ProgressViewProps {
  progress: UserProgress;
  onStartLesson: (lessonId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ progress, onStartLesson }) => {
  const completedCount = progress.completedLessonIds.length;
  const percentComplete = Math.min(100, Math.round((completedCount / TOTAL_LESSONS) * 100));
  const levelTitle = getLevelTitle(progress.level);

  // Simple day streak tracker (last 7 days)
  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg">
        <div className="flex items-center gap-3 text-rose-600 mb-2">
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-wider bg-rose-100/90 text-rose-700 px-2.5 py-1 rounded-md border border-rose-200">
            Statistik Sederhana
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
          Kemajuan Belajar Anda
        </h1>
        <p className="text-neutral-700 text-sm sm:text-base mt-1 font-medium">
          Pantau konsistensi dan perkembangan belajarmu dengan ringkas dan jelas.
        </p>
      </div>

      {/* 3 CORE STATS AS SPECIFIED IN USER REQUIREMENTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Streak */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border-2 border-amber-300/80 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100/90 flex items-center justify-center text-amber-500 shrink-0 border border-amber-200">
            <Flame className="w-8 h-8 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase text-amber-700">Streak Harian</span>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900">
              {progress.currentStreak} <span className="text-sm font-bold text-neutral-500">Hari</span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5 font-medium">Belajar konsisten</p>
          </div>
        </div>

        {/* XP */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border-2 border-rose-300/80 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100/90 flex items-center justify-center text-rose-500 shrink-0 border border-rose-200">
            <Sparkles className="w-8 h-8 fill-rose-500" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase text-rose-700">Total XP</span>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900">
              {progress.totalXp.toLocaleString()} <span className="text-sm font-bold text-neutral-500">XP</span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5 font-medium">Poin pengalaman</p>
          </div>
        </div>

        {/* Level */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border-2 border-indigo-300/80 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100/90 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-200">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase text-indigo-700">Tingkat Level</span>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900">
              Level {progress.level}
            </div>
            <p className="text-xs text-indigo-700 font-bold mt-0.5 truncate">{levelTitle}</p>
          </div>
        </div>
      </div>

      {/* 7-Day Consistency Tracker */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/60 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-neutral-600" />
          <h3 className="font-extrabold text-neutral-900 text-base">
            Absensi Belajar Minggu Ini
          </h3>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayIdx;
            const isCompleted = idx <= todayIdx;

            return (
              <div
                key={day}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  isToday
                    ? 'bg-rose-100/90 border-rose-400 font-extrabold text-rose-900 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                    : 'bg-white/50 border-neutral-200 text-neutral-400'
                }`}
              >
                <span className="text-xs font-bold">{day}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum Completion Overview */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/60 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-neutral-900 text-base">
              Penyelesaian Materi Keseluruhan
            </h3>
          </div>
          <span className="text-sm font-black text-rose-600">
            {completedCount} dari {TOTAL_LESSONS} Pelajaran ({percentComplete}%)
          </span>
        </div>

        <div className="bg-white/60 rounded-full h-4 overflow-hidden p-0.5 border border-neutral-300">
          <div
            className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-700 ease-out shadow-xs"
            style={{ width: `${Math.max(5, percentComplete)}%` }}
          />
        </div>

        {/* List of courses status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {COURSES.map((course) => {
            const totalInCourse = course.lessons.length;
            const completedInCourse = course.lessons.filter(l => progress.completedLessonIds.includes(l.id)).length;
            const isAllDone = completedInCourse === totalInCourse && totalInCourse > 0;

            return (
              <div
                key={course.id}
                className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-neutral-200/80 flex items-center justify-between hover:bg-white/90 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-bold text-lg shadow-2xs">
                    {course.iconSymbol}
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">{course.title}</h4>
                    <p className="text-xs text-neutral-600">
                      {completedInCourse}/{totalInCourse} Selesai
                    </p>
                  </div>
                </div>

                {isAllDone && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
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
};
