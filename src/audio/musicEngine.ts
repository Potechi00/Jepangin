// Centralized Real MP3 Audio Manager for JEPANGIN
// Strictly native HTML5 Audio only: NO AudioContext, NO GainNode, NO synthesis, NO sound processing
// Owns EXACTLY three persistent HTMLAudioElement instances for the 3 original MP3 files.

export type MusicMode = 'kecapi' | 'seruling' | 'tokyo' | 'strings' | 'flute' | 'kyoto' | 'sakura';
export type CleanTrackKey = 'kecapi' | 'seruling' | 'tokyoNight';

export type PlaybackStatus = 'playing' | 'paused' | 'stopped' | 'loading' | 'error';

export interface MusicTrackInfo {
  id: MusicMode;
  key: CleanTrackKey;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  src: string;
}

export const MUSIC_TRACKS: MusicTrackInfo[] = [
  {
    id: 'kecapi',
    key: 'kecapi',
    name: 'Kecapi',
    subtitle: 'Instrumental Tradisional',
    icon: '🎻',
    description: 'Suasana petikan dawai tradisional kecapi yang tenang, damai, dan elegan untuk belajar bahasa Jepang.',
    src: '/Kecapi.mp3',
  },
  {
    id: 'seruling',
    key: 'seruling',
    name: 'Seruling',
    subtitle: 'Asian Flute Atmosphere',
    icon: '🎋',
    description: 'Suasana hening seruling Asia bernuansa pegunungan, kuil, hutan, angin, dan alam Jepang yang damai.',
    src: '/Seruling.mp3',
  },
  {
    id: 'tokyo',
    key: 'tokyoNight',
    name: 'Tokyo Night',
    subtitle: 'Japanese Lo-Fi',
    icon: '🌃',
    description: 'Suasana malam Tokyo yang modern, santai, dan nyaman untuk menemani fokus belajar.',
    src: '/Tokyo Night.mp3',
  },
];

class CentralizedAudioManager {
  // Exactly three persistent HTMLAudioElement instances
  public kecapi: HTMLAudioElement | null = null;
  public seruling: HTMLAudioElement | null = null;
  public tokyoNight: HTMLAudioElement | null = null;

  public currentTrackKey: CleanTrackKey = 'kecapi';
  public isPlaying = false;
  public isPaused = false;

  private globalVolume = 0.6; // User-selected volume [0.0 - 1.0]
  private transitionTimer: number | null = null;
  private fadeInterval: number | null = null;
  private transitionId = 0;
  private statusListeners: Array<(status: PlaybackStatus) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initPersistentAudioElements();
    }
  }

  /**
   * Initialize exactly three persistent HTMLAudioElement objects once
   */
  private initPersistentAudioElements() {
    if (this.kecapi && this.seruling && this.tokyoNight) return;

    try {
      // 1. Kecapi
      this.kecapi = new Audio('/Kecapi.mp3');
      this.kecapi.loop = true;
      this.kecapi.preload = 'auto';
      this.kecapi.volume = this.globalVolume;

      // 2. Seruling
      this.seruling = new Audio('/Seruling.mp3');
      this.seruling.loop = true;
      this.seruling.preload = 'auto';
      this.seruling.volume = this.globalVolume;

      // 3. Tokyo Night
      this.tokyoNight = new Audio('/Tokyo Night.mp3');
      this.tokyoNight.loop = true;
      this.tokyoNight.preload = 'auto';
      this.tokyoNight.volume = this.globalVolume;

      // Attach event listeners to keep state synchronized
      const tracks: Array<{ key: CleanTrackKey; audio: HTMLAudioElement }> = [
        { key: 'kecapi', audio: this.kecapi },
        { key: 'seruling', audio: this.seruling },
        { key: 'tokyoNight', audio: this.tokyoNight },
      ];

      tracks.forEach(({ key, audio }) => {
        audio.addEventListener('playing', () => {
          if (this.currentTrackKey === key) {
            this.isPlaying = true;
            this.isPaused = false;
            this.notifyStatus('playing');
          }
        });

        audio.addEventListener('pause', () => {
          if (this.currentTrackKey === key) {
            if (!this.isPlaying) {
              this.notifyStatus('stopped');
            } else if (this.isPaused) {
              this.notifyStatus('paused');
            }
          }
        });

        audio.addEventListener('error', (e) => {
          console.warn(`Audio element error on track ${key}:`, e);
          // Fallback path check if needed
          if (key === 'tokyoNight' && audio.src.endsWith('/Tokyo Night.mp3')) {
            audio.src = '/tokyo_night.mp3';
            if (this.isPlaying && this.currentTrackKey === key) {
              audio.play().catch(() => {});
            }
          }
        });
      });
    } catch (err) {
      console.warn('Could not initialize HTMLAudioElements:', err);
    }
  }

  public getAudioElement(key: CleanTrackKey): HTMLAudioElement | null {
    this.initPersistentAudioElements();
    if (key === 'kecapi') return this.kecapi;
    if (key === 'seruling') return this.seruling;
    if (key === 'tokyoNight') return this.tokyoNight;
    return this.kecapi;
  }

  public subscribeStatus(listener: (status: PlaybackStatus) => void): () => void {
    this.statusListeners.push(listener);
    listener(this.getStatus());
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private notifyStatus(status: PlaybackStatus) {
    this.statusListeners.forEach((l) => l(status));
  }

  public getStatus(): PlaybackStatus {
    if (!this.isPlaying) return 'stopped';
    if (this.isPaused) return 'paused';
    return 'playing';
  }

  public normalizeKey(mode: MusicMode | CleanTrackKey): CleanTrackKey {
    if (mode === 'kecapi' || mode === 'strings' || mode === 'kyoto') return 'kecapi';
    if (mode === 'seruling' || mode === 'flute' || mode === 'sakura') return 'seruling';
    if (mode === 'tokyo' || mode === 'tokyoNight') return 'tokyoNight';
    return 'kecapi';
  }

  public getMode(): MusicMode {
    if (this.currentTrackKey === 'kecapi') return 'kecapi';
    if (this.currentTrackKey === 'seruling') return 'seruling';
    return 'tokyo';
  }

  public getTrackInfo(mode?: MusicMode): MusicTrackInfo {
    const key = this.normalizeKey(mode || this.currentTrackKey);
    return MUSIC_TRACKS.find((t) => t.key === key) || MUSIC_TRACKS[0];
  }

  /**
   * Set global volume and update the currently playing audio element volume directly
   */
  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.globalVolume = clamped;

    const currentAudio = this.getAudioElement(this.currentTrackKey);
    if (currentAudio && !this.fadeInterval) {
      currentAudio.volume = clamped;
    }
  }

  public getVolume(): number {
    return this.globalVolume;
  }

  /**
   * Play the current or specified track
   */
  public play(mode?: MusicMode) {
    this.initPersistentAudioElements();

    const targetKey = mode ? this.normalizeKey(mode) : this.currentTrackKey;

    if (targetKey !== this.currentTrackKey) {
      this.switchTrack(targetKey);
      return;
    }

    const currentAudio = this.getAudioElement(this.currentTrackKey);
    if (!currentAudio) return;

    this.clearAllTimers();
    this.transitionId++;

    // Ensure all other audio elements are paused and reset
    this.stopOtherTracks(this.currentTrackKey);

    this.isPlaying = true;
    this.isPaused = false;
    this.notifyStatus('loading');

    currentAudio.volume = this.globalVolume;
    const playPromise = currentAudio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.notifyStatus('playing');
        })
        .catch((err) => {
          console.warn('Autoplay prevented or playback issue:', err);
          this.isPlaying = false;
          this.isPaused = true;
          this.notifyStatus('paused');
        });
    }
  }

  /**
   * Pause the active track
   */
  public pause() {
    this.clearAllTimers();
    this.transitionId++;

    const currentAudio = this.getAudioElement(this.currentTrackKey);
    if (currentAudio) {
      currentAudio.pause();
    }

    this.isPlaying = false;
    this.isPaused = true;
    this.notifyStatus('paused');
  }

  public switchMode(newMode: MusicMode | CleanTrackKey) {
    this.switchTrack(newMode);
  }

  /**
   * Switch between tracks with smooth, artifact-free volume fade and strict single-track playback
   */
  public switchTrack(newMode: MusicMode | CleanTrackKey) {
    const targetKey = this.normalizeKey(newMode);

    // If already playing the same track, do nothing
    if (targetKey === this.currentTrackKey && this.isPlaying && !this.isPaused) {
      return;
    }

    const prevKey = this.currentTrackKey;
    this.currentTrackKey = targetKey;

    const prevAudio = this.getAudioElement(prevKey);
    const nextAudio = this.getAudioElement(targetKey);

    if (!nextAudio) return;

    // Cancel all previous fade intervals and timers
    this.clearAllTimers();
    this.transitionId++;
    const currentTransId = this.transitionId;

    if (prevAudio && prevKey !== targetKey && this.isPlaying && !this.isPaused) {
      // Step 2 & 3: Fade out previous track over 500ms, then pause
      const startVol = prevAudio.volume;
      const steps = 10;
      const stepTime = 500 / steps;
      let currentStep = 0;

      this.fadeInterval = window.setInterval(() => {
        currentStep++;
        const factor = Math.max(0, 1 - currentStep / steps);
        if (prevAudio) {
          prevAudio.volume = Math.max(0, startVol * factor);
        }

        if (currentStep >= steps) {
          this.clearFadeInterval();
          if (prevAudio) {
            prevAudio.pause();
            prevAudio.currentTime = 0;
            prevAudio.volume = this.globalVolume;
          }
          this.stopOtherTracks(targetKey);

          // Step 4 & 5 & 6: Play next track and fade in
          if (this.transitionId === currentTransId) {
            this.startNextTrack(nextAudio, currentTransId);
          }
        }
      }, stepTime);
    } else {
      // Direct clean start if not currently playing
      this.stopOtherTracks(targetKey);
      if (this.isPlaying && !this.isPaused) {
        this.startNextTrack(nextAudio, currentTransId);
      }
    }
  }

  private startNextTrack(audio: HTMLAudioElement, transId: number) {
    audio.volume = 0;
    const playPromise = audio.play();

    this.isPlaying = true;
    this.isPaused = false;
    this.notifyStatus('loading');

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (this.transitionId !== transId) return;

          // Step 6: Fade in to global volume over 500ms
          const targetVol = this.globalVolume;
          const steps = 10;
          const stepTime = 500 / steps;
          let currentStep = 0;

          this.clearFadeInterval();
          this.fadeInterval = window.setInterval(() => {
            currentStep++;
            const factor = Math.min(1, currentStep / steps);
            audio.volume = Math.min(1, targetVol * factor);

            if (currentStep >= steps) {
              this.clearFadeInterval();
              audio.volume = targetVol;
              this.notifyStatus('playing');
            }
          }, stepTime);
        })
        .catch((err) => {
          console.warn('Playback switch error:', err);
          this.isPlaying = false;
          this.isPaused = true;
          this.notifyStatus('paused');
        });
    }
  }

  /**
   * Ensure only the target track is playing; pause and reset all other Audio instances
   */
  private stopOtherTracks(activeKey: CleanTrackKey) {
    const allTracks: Array<{ key: CleanTrackKey; audio: HTMLAudioElement | null }> = [
      { key: 'kecapi', audio: this.kecapi },
      { key: 'seruling', audio: this.seruling },
      { key: 'tokyoNight', audio: this.tokyoNight },
    ];

    allTracks.forEach(({ key, audio }) => {
      if (key !== activeKey && audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = this.globalVolume;
      }
    });
  }

  private clearFadeInterval() {
    if (this.fadeInterval !== null) {
      window.clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  private clearAllTimers() {
    this.clearFadeInterval();
    if (this.transitionTimer !== null) {
      window.clearTimeout(this.transitionTimer);
      this.transitionTimer = null;
    }
  }
}

export const musicEngine = new CentralizedAudioManager();
