import React, { useState } from 'react';
import { Play, CheckCircle, ArrowRight, Lock, Sparkles, BookOpen, Volume2 } from 'lucide-react';
import { UserProgress, CourseModule } from '../../types';
import { COURSES } from '../../data/courses';
import { speakJapanese } from '../../utils/audio';

interface LearnViewProps {
  progress: UserProgress;
  onStartLesson: (lessonId: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ progress, onStartLesson }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'huruf' | 'kosakata' | 'percakapan' | 'tatabahasa'>('all');

  const filteredCourses = selectedCategory === 'all'
    ? COURSES
    : COURSES.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Header with clear context */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg">
        <div className="flex items-center gap-3 text-rose-600 mb-2">
          <BookOpen className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-wider bg-rose-100/90 text-rose-700 px-2.5 py-1 rounded-md border border-rose-200">
            Kurikulum Terstruktur
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
          Pilih Materi Belajar
        </h1>
        <p className="text-neutral-700 text-sm sm:text-base mt-1 max-w-2xl font-medium">
          Mulai dari huruf dasar Hiragana, kosakata sapaan harian, hingga percakapan praktis di Jepang. Pilih materi di bawah ini:
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-neutral-200/60">
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
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-white/70 text-neutral-700 hover:bg-rose-50 hover:text-rose-700 border border-neutral-200/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Course Cards Grid */}
      <div className="space-y-6">
        {filteredCourses.map((course) => {
          // Calculate completed lessons in this module
          const totalLessonsInModule = course.lessons.length;
          const completedInModule = course.lessons.filter(l => progress.completedLessonIds.includes(l.id)).length;
          const modulePercent = Math.round((completedInModule / totalLessonsInModule) * 100);

          return (
            <div
              key={course.id}
              className="bg-white/85 backdrop-blur-md rounded-3xl border border-white/60 p-6 sm:p-7 shadow-lg hover:border-rose-300 transition-colors"
            >
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200/50">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-100 to-rose-200 text-rose-700 border border-rose-300 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
                    {course.iconSymbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-md border border-rose-200">
                        {course.badge}
                      </span>
                      <span className="text-xs font-semibold text-neutral-500">
                        {completedInModule}/{totalLessonsInModule} Selesai ({modulePercent}%)
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mt-1">
                      {course.title}
                    </h2>
                    <p className="text-sm text-neutral-600 mt-0.5">
                      {course.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lessons List in Module */}
              <div className="mt-5 space-y-3">
                {course.lessons.map((lesson, idx) => {
                  const isCompleted = progress.completedLessonIds.includes(lesson.id);
                  const isCurrent = progress.activeLessonId === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        isCompleted
                          ? 'bg-emerald-50/80 backdrop-blur-sm border border-emerald-300 shadow-xs'
                          : isCurrent
                          ? 'bg-rose-50/85 backdrop-blur-sm border-2 border-rose-500 shadow-md'
                          : 'bg-white/70 backdrop-blur-xs border border-neutral-200/70 hover:bg-white/95'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="pt-0.5">
                          {isCompleted ? (
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-full font-black text-sm flex items-center justify-center ${
                                isCurrent
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-neutral-200 text-neutral-600'
                              }`}
                            >
                              {idx + 1}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-neutral-900 text-base sm:text-lg">
                              {lesson.title}
                            </h3>
                            {isCompleted && (
                              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                                Tuntas ✅
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                            {lesson.description}
                          </p>

                          {/* Quick Character Preview Badges */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {lesson.items.slice(0, 5).map((item) => (
                              <button
                                key={item.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakJapanese(item.japanese);
                                }}
                                title="Klik untuk dengar suara"
                                className="inline-flex items-center gap-1 bg-white/90 hover:bg-rose-100 border border-neutral-200 hover:border-rose-300 text-neutral-800 px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                              >
                                <span className="text-rose-600 font-black">{item.japanese}</span>
                                <span className="text-neutral-500 font-normal">({item.romaji})</span>
                                <Volume2 className="w-3 h-3 text-neutral-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        id={`btn-lesson-${lesson.id}`}
                        onClick={() => onStartLesson(lesson.id)}
                        className={`w-full sm:w-auto px-5 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-xs'
                            : isCurrent
                            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
                            : 'bg-neutral-800 hover:bg-neutral-900 text-white shadow-xs'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <span>Ulangi Pelajaran</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Mulai Belajar</span>
                            <ArrowRight className="w-4 h-4" />
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
};
