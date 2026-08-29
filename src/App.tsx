import React, { useState } from 'react';
import { NavigationTab, UserProgress } from './types';
import { calculateLevel, INITIAL_PROGRESS } from './utils/storage';
import { findLessonById } from './data/courses';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SakuraCanvas } from './components/SakuraCanvas';
import { LivingJapaneseBackground, SceneryMode } from './components/JapanSceneryBackground';
import { SceneryControlBar } from './components/SceneryControlBar';
import { HomeView } from './components/views/HomeView';
import { LearnView } from './components/views/LearnView';
import { LessonPlayerView } from './components/views/LessonPlayerView';
import { PracticeView } from './components/views/PracticeView';
import { ProgressView } from './components/views/ProgressView';
import { ProfileView } from './components/views/ProfileView';
import { MemoryBattleView } from './components/game/MemoryBattleView';
import { AuthProvider, useAuth } from './auth/authContext';
import { WelcomeAuthModal } from './components/auth/WelcomeAuthModal';

function MainAppContent() {
  const { user, isLoading, userProgress, setUserProgress } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('beranda');
  const [activePlayingLessonId, setActivePlayingLessonId] = useState<string | null>(null);
  const [sceneryMode, setSceneryMode] = useState<SceneryMode>('fuji_day');

  // Handle starting a lesson from any view
  const handleStartLesson = (lessonId: string) => {
    setActivePlayingLessonId(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle finishing a lesson
  const handleFinishLesson = (lessonId: string, earnedXp: number) => {
    setUserProgress((prev) => {
      const isFirstTime = !prev.completedLessonIds.includes(lessonId);
      const updatedCompleted = isFirstTime
        ? [...prev.completedLessonIds, lessonId]
        : prev.completedLessonIds;

      const newXp = prev.totalXp + (isFirstTime ? earnedXp : Math.round(earnedXp / 2));
      const newLevel = calculateLevel(newXp);
      const todayStr = new Date().toISOString().split('T')[0];
      const isNewDay = prev.lastStudyDate !== todayStr;
      const updatedStreak = isNewDay ? prev.currentStreak + 1 : prev.currentStreak;

      return {
        ...prev,
        completedLessonIds: updatedCompleted,
        totalXp: newXp,
        level: newLevel,
        currentStreak: updatedStreak,
        lastStudyDate: todayStr,
        activeLessonId: lessonId,
      };
    });
  };

  // Handle adding XP from quick practice
  const handleAddXp = (amount: number) => {
    setUserProgress((prev) => {
      const newXp = prev.totalXp + amount;
      const newLevel = calculateLevel(newXp);
      return {
        ...prev,
        totalXp: newXp,
        level: newLevel,
      };
    });
  };

  // Update progress settings (avatar, name, font mode, etc.)
  const handleUpdateProgress = (updated: Partial<UserProgress>) => {
    setUserProgress((prev) => ({ ...prev, ...updated }));
  };

  // Reset progress completely
  const handleResetProgress = () => {
    setUserProgress(INITIAL_PROGRESS);
    setActivePlayingLessonId(null);
    setCurrentTab('beranda');
  };

  // If in lesson player mode
  const activeLessonInfo = activePlayingLessonId ? findLessonById(activePlayingLessonId) : null;

  // Lightweight non-flickering loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950 via-slate-900 to-neutral-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-3xl font-black shadow-xl shadow-rose-600/40 animate-pulse">
          日
        </div>
        <h2 className="text-xl font-black mt-4 tracking-tight">JEPANGIN</h2>
        <p className="text-xs text-rose-200/80 mt-1 font-medium">Menyiapkan perjalanan belajarmu...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-transparent text-neutral-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white relative ${
        userProgress.largeFontMode ? 'text-lg' : 'text-base'
      }`}
    >
      {/* Welcome / Auth Modal if user has no session yet */}
      {!user && <WelcomeAuthModal />}

      {/* 1. REAL FULL-SCREEN LIVING JAPANESE ENVIRONMENT */}
      <LivingJapaneseBackground mode={sceneryMode} onModeChange={setSceneryMode} />

      {/* 2. CONTINUOUS FALLING SAKURA PETALS */}
      <SakuraCanvas />

      {/* 3. MAIN TOP HEADER NAVIGATION */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActivePlayingLessonId(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        progress={userProgress}
      />

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-24 md:pb-12 relative z-10">
        {/* Scenery Atmosphere Switcher Bar */}
        <SceneryControlBar
          currentMode={sceneryMode}
          onSelectMode={(m) => setSceneryMode(m)}
        />

        {activePlayingLessonId && activeLessonInfo ? (
          <LessonPlayerView
            course={activeLessonInfo.course}
            lesson={activeLessonInfo.lesson}
            progress={userProgress}
            onFinishLesson={handleFinishLesson}
            onBack={() => setActivePlayingLessonId(null)}
            onStartNextLesson={(nextId) => {
              setActivePlayingLessonId(nextId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            {currentTab === 'beranda' && (
              <HomeView
                progress={userProgress}
                onStartLesson={handleStartLesson}
                onNavigateTab={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'belajar' && (
              <LearnView
                progress={userProgress}
                onStartLesson={handleStartLesson}
              />
            )}

            {currentTab === 'latihan' && (
              <PracticeView
                progress={userProgress}
                onAddXp={handleAddXp}
              />
            )}

            {currentTab === 'battle' && (
              <MemoryBattleView
                progress={userProgress}
                onAddXp={handleAddXp}
                onBackToApp={() => setCurrentTab('beranda')}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressView
                progress={userProgress}
                onStartLesson={handleStartLesson}
              />
            )}

            {currentTab === 'profil' && (
              <ProfileView
                progress={userProgress}
                onUpdateProgress={handleUpdateProgress}
                onResetProgress={handleResetProgress}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActivePlayingLessonId(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
