import React, { createContext, useContext } from 'react';

interface MusicContextValue {
  isPlaying: boolean;
  isPaused: boolean;
  status: 'stopped' | 'playing' | 'paused' | 'loading';
  mode: string;
  volume: number;
  activeTrack: { id: string; title: string; subtitle: string; genre: string };
  tracks: any[];
  toggleMusic: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setMode: (mode: string) => void;
  setVolume: (volume: number) => void;
}

const noop = () => {};

const defaultContext: MusicContextValue = {
  isPlaying: false,
  isPaused: false,
  status: 'stopped',
  mode: 'none',
  volume: 0,
  activeTrack: { id: 'none', title: 'None', subtitle: 'Disabled', genre: '' },
  tracks: [],
  toggleMusic: noop,
  playMusic: noop,
  pauseMusic: noop,
  nextTrack: noop,
  prevTrack: noop,
  setMode: noop,
  setVolume: noop,
};

const MusicContext = createContext<MusicContextValue>(defaultContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MusicContext.Provider value={defaultContext}>
      {children}
    </MusicContext.Provider>
  );
};

export function useMusic(): MusicContextValue {
  return useContext(MusicContext) || defaultContext;
}
