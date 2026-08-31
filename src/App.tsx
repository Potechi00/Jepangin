import React, { useState, useCallback } from 'react';
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
import { YomeruReadingView } from './components/reading/YomeruReadingView';
import { AuthProvider, useAuth } from './auth/authContext';
import { WelcomeAuthModal } from './components/auth/WelcomeAuthModal';

function MainAppContent() {
  const { user, isLoading, userProgress, setUserProgress } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('beranda');
  const [activePlayingLessonId, setActivePlayingLessonId] = useState<string | null>(null);
  const [sceneryMode, setSceneryMode] = useState<SceneryMode>('fuji_day');
  const [isGameFocusMode, setIsGameFocusMode] = useState<boolean>(false);

  // Lock body scroll during active game sessions
  const isGameActive = isGameFocusMode || Boolean(activePlayingLessonId);

  React.useEffect(() => {
    if (isGameActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGameActive]);

  // Handle starting a lesson from any view
  const handleStartLesson = useCallback((lessonId: string) => {
    setActivePlayingLessonId(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle tab switching
  const handleSelectTab = useCallback((tab: NavigationTab) => {
    setActivePlayingLessonId(null);
    setIsGameFocusMode(false);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle finishing a lesson
  const handleFinishLesson = useCallback((lessonId: string, earnedXp: number) => {
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
  }, [setUserProgress]);

  // Handle adding XP from quick practice / memory battle / yomeru
  const handleAddXp = useCallback((amount: number) => {
    setUserProgress((prev) => {
      const newXp = prev.totalXp + amount;
      const newLevel = calculateLevel(newXp);
      return {
        ...prev,
        totalXp: newXp,
        level: newLevel,
      };
    });
  }, [setUserProgress]);

  // Update avatar
  const handleUpdateAvatar = useCallback((avatar: string) => {
    setUserProgress((prev) => ({ ...prev, avatar }));
  }, [setUserProgress]);

  // Update user name
  const handleUpdateName = useCallback((userName: string) => {
    setUserProgress((prev) => ({ ...prev, userName }));
  }, [setUserProgress]);

  // Toggle sound fx
  const handleToggleSound = useCallback(() => {
    setUserProgress((prev) => ({ ...prev, soundEffects: !prev.soundEffects }));
  }, [setUserProgress]);

  // Reset progress completely
  const handleResetProgress = useCallback(() => {
    setUserProgress(INITIAL_PROGRESS);
    setActivePlayingLessonId(null);
    setIsGameFocusMode(false);
    setCurrentTab('beranda');
  }, [setUserProgress]);

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

  // Determine if scenery switcher bar should be hidden (during game focus mode, lesson playing, or direct game tabs)
  const isHideControls = isGameActive || currentTab === 'battle' || currentTab === 'yomeru';

  return (
    <div
      className={`min-h-[100dvh] w-full bg-transparent text-neutral-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white relative ${
        userProgress.largeFontMode ? 'text-lg' : 'text-base'
      } ${isGameActive ? 'h-[100dvh] overflow-hidden' : ''}`}
    >
      {/* Welcome / Auth Modal if user has no session yet */}
      {!user && <WelcomeAuthModal />}

      {/* LAYER 1: LIVING JAPANESE SCENERY BACKGROUND (z-index: 0) */}
      <LivingJapaneseBackground mode={sceneryMode} onModeChange={setSceneryMode} />

      {/* LAYER 2: GLASS UI & MAIN APPLICATION CONTENT (z-index: 10 & 20) */}
      {/* Completely hide header during active fullscreen game sessions */}
      {!isGameActive && (
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          progress={userProgress}
        />
      )}

      <main
        className={`w-full mx-auto relative z-10 ${
          isGameActive
            ? 'flex-1 h-[100dvh] p-0 overflow-hidden max-w-full'
            : 'flex-1 max-w-5xl px-4 sm:px-6 pt-4 sm:pt-6 pb-[calc(100px+env(safe-area-inset-bottom,0px))] md:pb-14 overflow-visible'
        }`}
      >
        {/* Scenery Atmosphere Switcher Bar (Hidden in Game Focus Mode & Lessons) */}
        {!isHideControls && (
          <SceneryControlBar
            currentMode={sceneryMode}
            onSelectMode={setSceneryMode}
          />
        )}

        {activePlayingLessonId && activeLessonInfo ? (
          <LessonPlayerView
            course={activeLessonInfo.course}
            lesson={activeLessonInfo.lesson}
            progress={userProgress}
            onFinishLesson={handleFinishLesson}
            onBack={() => setActivePlayingLessonId(null)}
            onStartNextLesson={handleStartLesson}
          />
        ) : (
          <>
            {currentTab === 'beranda' && (
              <HomeView
                progress={userProgress}
                onStartLesson={handleStartLesson}
                onNavigateTab={handleSelectTab}
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
                onFocusModeChange={setIsGameFocusMode}
              />
            )}

            {currentTab === 'battle' && (
              <MemoryBattleView
                progress={userProgress}
                onAddXp={handleAddXp}
                onBackToApp={() => handleSelectTab('latihan')}
                onFocusModeChange={setIsGameFocusMode}
              />
            )}

            {currentTab === 'yomeru' && (
              <YomeruReadingView
                progress={userProgress}
                onAddXp={handleAddXp}
                onBackToApp={() => handleSelectTab('latihan')}
                onFocusModeChange={setIsGameFocusMode}
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
                onUpdateName={handleUpdateName}
                onUpdateAvatar={handleUpdateAvatar}
                onToggleSound={handleToggleSound}
                onResetProgress={handleResetProgress}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar: Completely removed/unmounted during active game session taking ZERO vertical space */}
      {!isGameActive && (
        <BottomNav
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
        />
      )}

      {/* LAYER 3: FOREGROUND SAKURA PETALS & LEAVES (z-index: 30, above UI, pointer-events: none) */}
      <SakuraCanvas />
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
