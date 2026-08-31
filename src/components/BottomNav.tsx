import React, { memo } from 'react';
import { Home, BookOpen, PenTool, BarChart3, User } from 'lucide-react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = memo(({ currentTab, onSelectTab }) => {
  const items: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'beranda', label: 'Beranda', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'belajar', label: 'Belajar', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'latihan', label: 'Latihan', icon: <PenTool className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'profil', label: 'Profil', icon: <User className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-20 px-3 py-2 pb-safe select-none border-t border-white/10"
      style={{
        background: 'rgba(10, 15, 25, 0.35)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <nav className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = currentTab === item.id || (item.id === 'latihan' && (currentTab === 'battle' || currentTab === 'yomeru'));
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] cursor-pointer ${
                isActive
                  ? 'text-white font-black bg-rose-600/80 border border-rose-400/40 shadow-xs'
                  : 'text-white/70 font-bold hover:text-white hover:bg-white/10'
              }`}
            >
              <div className={`p-0.5 ${isActive ? 'scale-105 transition-transform' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
});
