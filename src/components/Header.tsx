import React from 'react';
import { Home, BookOpen, PenTool, BarChart3, User, Flame, Sparkles, Cloud } from 'lucide-react';
import { NavigationTab, UserProgress } from '../types';
import { useAuth } from '../auth/authContext';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  progress: UserProgress;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, progress }) => {
  const { user } = useAuth();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'beranda', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { id: 'belajar', label: 'Belajar', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'latihan', label: 'Latihan', icon: <PenTool className="w-5 h-5" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'profil', label: 'Profil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-lg border-b border-white/40 shadow-xs transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          id="btn-brand-home"
          onClick={() => onSelectTab('beranda')}
          className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform">
            <span className="text-xl sm:text-2xl font-black">日</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">JEPANGIN</span>
              <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">ID</span>
            </div>
            <p className="text-xs text-neutral-600 font-medium hidden sm:block">Belajar Bahasa Jepang Santai & Mudah</p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id || (item.id === 'latihan' && currentTab === 'battle');
            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                    : 'text-neutral-700 hover:text-neutral-900 hover:bg-white/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Gamification Badge: Streak & XP */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user?.provider === 'google' && (
            <div
              className="hidden sm:flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-xl text-xs font-bold"
              title="Progress tersimpan aman di cloud"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-600" />
              <span>Tersimpan</span>
            </div>
          )}

          <div
            className="flex items-center gap-1.5 bg-amber-50/90 backdrop-blur-sm border border-amber-200/80 text-amber-900 px-3 py-1.5 rounded-xl text-sm font-bold shadow-2xs"
            title="Streak belajar harian"
          >
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-extrabold">{progress.currentStreak}</span>
            <span className="text-xs text-amber-700 hidden sm:inline">Hari</span>
          </div>

          <div
            className="flex items-center gap-1.5 bg-rose-50/90 backdrop-blur-sm border border-rose-200/80 text-rose-900 px-3 py-1.5 rounded-xl text-sm font-bold shadow-2xs"
            title="Poin Pengalaman (XP)"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500" />
            <span className="text-sm font-extrabold">{progress.totalXp}</span>
            <span className="text-xs text-rose-700 hidden sm:inline">XP</span>
          </div>
        </div>
      </div>
    </header>
  );
};
