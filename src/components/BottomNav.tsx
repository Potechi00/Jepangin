import React from 'react';
import { Home, BookOpen, PenTool, BarChart3, User } from 'lucide-react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const items: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'beranda', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { id: 'belajar', label: 'Belajar', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'latihan', label: 'Latihan', icon: <PenTool className="w-5 h-5" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'profil', label: 'Profil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t border-white/50 shadow-lg px-2 py-1.5 pb-safe">
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = currentTab === item.id || (item.id === 'latihan' && currentTab === 'battle');
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[52px] ${
                isActive
                  ? 'text-rose-600 font-extrabold bg-rose-50/80 shadow-xs'
                  : 'text-neutral-600 font-medium hover:text-neutral-900'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'scale-110 transition-transform' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[11px] leading-tight mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
