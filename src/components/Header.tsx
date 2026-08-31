import React, { memo } from 'react';
import { Home, BookOpen, PenTool, BarChart3, User, Flame, Sparkles, Cloud } from 'lucide-react';
import { NavigationTab, UserProgress } from '../types';
import { useAuth } from '../auth/authContext';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  progress: UserProgress;
}

export const Header: React.FC<HeaderProps> = memo(({ currentTab, onSelectTab, progress }) => {
  const { user } = useAuth();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'beranda', label: 'Beranda', icon: <Home className="w-4 h-4" /> },
    { id: 'belajar', label: 'Belajar', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'latihan', label: 'Latihan', icon: <PenTool className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'profil', label: 'Profil', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header
      className="sticky top-0 z-20 transition-all select-none border-b border-white/10"
      style={{
        background: 'rgba(10, 15, 25, 0.28)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <button
          id="btn-brand-home"
          onClick={() => onSelectTab('beranda')}
          className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-hidden cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform">
            <span className="text-lg sm:text-2xl font-black">日</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                JEPANGIN
              </span>
              <span className="text-[10px] sm:text-xs bg-rose-500/25 text-rose-300 font-black px-2 py-0.5 rounded-full border border-rose-400/30">
                ID
              </span>
            </div>
            <p className="text-[11px] text-white/70 font-medium hidden sm:block">
              Belajar Bahasa Jepang Santai & Hidup
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 cinematic-floating-card p-1 rounded-2xl">
          {navItems.map((item) => {
            const isActive = currentTab === item.id || (item.id === 'latihan' && (currentTab === 'battle' || currentTab === 'yomeru'));
            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Streak & XP Badges */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {user?.provider === 'google' && (
            <div
              className="hidden lg:flex items-center gap-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-2.5 py-1 rounded-xl text-xs font-bold backdrop-blur-xs"
              title="Progress tersimpan aman di cloud"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              <span>Cloud</span>
            </div>
          )}

          <div
            className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-300 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-2xs"
            title="Streak belajar harian"
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs sm:text-sm font-black text-white">{progress.currentStreak}</span>
            <span className="text-[10px] text-amber-300/80 hidden sm:inline">Hari</span>
          </div>

          <div
            className="flex items-center gap-1 bg-rose-500/20 backdrop-blur-md border border-rose-400/30 text-rose-300 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-2xs"
            title="Poin Pengalaman (XP)"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 fill-rose-400" />
            <span className="text-xs sm:text-sm font-black text-white">{progress.totalXp}</span>
            <span className="text-[10px] text-rose-300/80 hidden sm:inline">XP</span>
          </div>
        </div>
      </div>
    </header>
  );
});
