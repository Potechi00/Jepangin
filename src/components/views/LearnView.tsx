import React, { useState, memo } from 'react';
import { Play, CheckCircle, ArrowRight, BookOpen, Volume2 } from 'lucide-react';
import { UserProgress } from '../../types';
import { COURSES } from '../../data/courses';
import { speakJapanese } from '../../utils/audio';

interface LearnViewProps {
  progress: UserProgress;
  onStartLesson: (lessonId: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = memo(({ progress, onStartLesson }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'huruf' | 'kosakata' | 'percakapan' | 'tatabahasa'>('all');

  const filteredCourses = selectedCategory === 'all'
    ? COURSES
    : COURSES.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* 1. Header with clear context */}
      <div className="cinematic-content-card rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 text-rose-300 mb-2">
          <BookOpen className="w-5 h-5 text-rose-400" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-md border border-rose-400/30">
            Kurikulum Terstruktur
          </span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-white">
          Pilih Materi Belajar
        </h1>
        <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
          Mulai dari huruf dasar Hiragana, kosakata sapaan harian, hingga percakapan praktis di Jepang.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-5 pt-3 border-t border-white/10">
          {[
            { id: 'all', label: '🌟 Semua Materi' },
            { id: 'huruf', label: '🔤 Huruf (Hiragana & Katakana)' },
            { id: 'kosakata', label: '💬 Kosakata & Salam' },
            { id: 'percakapan', label: '🗣️ Percakapan' },
            { id: 'tatabahasa', label: '📐 Tata Bahasa' },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id}`}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/15'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Course Cards Grid */}
      <div className="space-y-5 sm:space-y-6">
        {filteredCourses.map((course) => {
          const totalLessonsInModule = course.lessons.length;
          const completedInModule = course.lessons.filter(l => progress.completedLessonIds.includes(l.id)).length;
          const modulePercent = Math.round((completedInModule / totalLessonsInModule) * 100);

          return (
            <div
              key={course.id}
              className="cinematic-content-card rounded-3xl p-5 sm:p-7 shadow-xl transition-all"
            >
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
                    {course.iconSymbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-black text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-400/30">
                        {course.badge}
                      </span>
                      <span className="text-xs font-bold text-white/70">
                        {completedInModule}/{totalLessonsInModule} Selesai ({modulePercent}%)
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-white mt-1">
                      {course.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/75 font-medium mt-0.5">
                      {course.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lessons List in Module */}
              <div className="mt-4 space-y-2.5">
                {course.lessons.map((lesson, idx) => {
                  const isCompleted = progress.completedLessonIds.includes(lesson.id);
                  const isCurrent = progress.activeLessonId === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      className={`rounded-2xl p-3.5 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                        isCompleted
                          ? 'bg-emerald-950/35 border border-emerald-400/35 shadow-xs'
                          : isCurrent
                          ? 'bg-rose-950/45 border-2 border-rose-500 shadow-md'
                          : 'cinematic-floating-card'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5">
                          {isCompleted ? (
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                          ) : (
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-black text-xs sm:text-sm flex items-center justify-center ${
                                isCurrent
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-white/15 border border-white/25 text-white/80'
                              }`}
                            >
                              {idx + 1}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-white text-sm sm:text-base">
                              {lesson.title}
                            </h3>
                            {isCompleted && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-black px-1.5 py-0.5 rounded-md">
                                Tuntas ✅
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/70 font-medium mt-0.5 leading-relaxed">
                            {lesson.description}
                          </p>

                          {/* Quick Character Preview Badges */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {lesson.items.slice(0, 5).map((item) => (
                              <button
                                key={item.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakJapanese(item.japanese);
                                }}
                                title="Klik untuk dengar suara"
                                className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 border border-white/20 text-white px-2 py-0.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer"
                              >
                                <span className="text-rose-300 font-black">{item.japanese}</span>
                                <span className="text-white/70 font-semibold">({item.romaji})</span>
                                <Volume2 className="w-3 h-3 text-white/50" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        id={`btn-lesson-${lesson.id}`}
                        onClick={() => onStartLesson(lesson.id)}
                        className={`w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-white/15 hover:bg-white/25 text-emerald-300 border border-emerald-400/30 shadow-xs'
                            : isCurrent
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                            : 'bg-white/20 hover:bg-white/30 text-white shadow-xs border border-white/25'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <span>Ulangi Pelajaran</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Mulai Belajar</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
