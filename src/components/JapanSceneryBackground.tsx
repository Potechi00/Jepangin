import React, { memo } from 'react';
import fujiSceneryImg from '../assets/images/fuji_shibuya_japan_scenery_1787842951647.jpg';
import tokyoNightImg from '../assets/images/shibuya_sky_tokyo_night_1787842966554.jpg';
import kyotoToriiImg from '../assets/images/kyoto_fushimi_scenery_1787843003360.jpg';

export type SceneryMode = 'fuji_day' | 'tokyo_night' | 'kyoto_sunset';

interface Props {
  mode?: SceneryMode;
  onModeChange?: (mode: SceneryMode) => void;
}

export const LivingJapaneseBackground: React.FC<Props> = memo(({
  mode = 'fuji_day',
}) => {
  const activeMode = mode;

  return (
    <div
      id="living-japanese-environment"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. SKY & ATMOSPHERIC GRADIENTS (Zero lag CSS transitions) */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-sky-400 via-rose-100/70 to-amber-50/40 transition-opacity duration-700 ${
          activeMode === 'fuji_day' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b from-purple-900 via-orange-600/70 to-amber-200/50 transition-opacity duration-700 ${
          activeMode === 'kyoto_sunset' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/90 to-purple-950/80 transition-opacity duration-700 ${
          activeMode === 'tokyo_night' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 2. PERSISTENT PHOTOREALISTIC PANORAMA BACKDROP */}
      <div className="absolute inset-0 opacity-90 mix-blend-normal">
        <img
          src={fujiSceneryImg}
          alt="Mount Fuji and Sakura Scenery"
          fetchPriority="high"
          decoding="async"
          loading="eager"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
            activeMode === 'fuji_day' ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
        />
        <img
          src={tokyoNightImg}
          alt="Tokyo Shibuya Sky Night"
          decoding="async"
          loading="eager"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
            activeMode === 'tokyo_night' ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
        />
        <img
          src={kyotoToriiImg}
          alt="Kyoto Fushimi Inari Torii Gate"
          decoding="async"
          loading="eager"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
            activeMode === 'kyoto_sunset' ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Subtle depth lighting overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/15" />

      {/* 3. CELESTIAL SUN / MOON WITH COMPOSITED GLOW */}
      <div
        className={`absolute top-10 right-1/4 w-32 h-32 rounded-full bg-rose-200/50 blur-xl animate-pulse-glow transition-opacity duration-700 ${
          activeMode === 'fuji_day' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute top-16 right-1/3 w-28 h-28 rounded-full bg-amber-400/80 blur-lg animate-pulse-glow transition-opacity duration-700 ${
          activeMode === 'kyoto_sunset' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-orange-500/90 mx-auto my-auto shadow-lg" />
      </div>
      <div
        className={`absolute top-12 right-24 w-20 h-20 rounded-full bg-amber-100/90 shadow-[0_0_35px_rgba(254,243,199,0.6)] animate-pulse-glow flex items-center justify-center transition-opacity duration-700 ${
          activeMode === 'tokyo_night' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-amber-50/95" />
      </div>

      {/* 4. ANIMATED CLOUDS (Hardware-accelerated parallax drifting) */}
      <div className="absolute inset-x-0 top-0 h-72 pointer-events-none opacity-60 overflow-hidden">
        {/* Slow cloud layer */}
        <div className="absolute top-8 -left-20 w-[140%] animate-cloud-slow">
          <svg className="w-full h-32 text-white/40 fill-current" viewBox="0 0 1000 120">
            <path d="M50 80 Q90 30 140 70 Q190 20 260 60 Q330 30 380 80 Q450 40 520 75 Q600 25 680 70 Q750 35 830 75 Q900 30 960 80 L1000 120 L0 120 Z" />
          </svg>
        </div>

        {/* Faster cloud layer */}
        <div className="absolute top-20 -left-10 w-[130%] animate-cloud-fast">
          <svg className="w-full h-24 text-rose-100/35 fill-current" viewBox="0 0 1000 100">
            <path d="M30 60 Q80 20 130 50 Q200 10 270 45 Q350 15 420 55 Q500 20 580 50 Q660 10 740 50 Q820 20 890 55 L1000 100 L0 100 Z" />
          </svg>
        </div>
      </div>

      {/* 5. ANIMATED BIRDS / TSURU (Flying across mountains) */}
      <div className="absolute top-24 left-0 w-full pointer-events-none">
        <div className="animate-birds-fly flex items-center gap-6 opacity-75">
          <svg className="w-6 h-6 text-neutral-800" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 14 Q6 4 12 10 Q18 4 22 14 Q16 11 12 14 Q8 11 2 14 Z" />
          </svg>
          <svg className="w-4 h-4 text-neutral-800 -translate-y-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 14 Q6 4 12 10 Q18 4 22 14 Q16 11 12 14 Q8 11 2 14 Z" />
          </svg>
          <svg className="w-5 h-5 text-neutral-800 translate-y-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 14 Q6 4 12 10 Q18 4 22 14 Q16 11 12 14 Q8 11 2 14 Z" />
          </svg>
        </div>
      </div>

      {/* 6. WATER RIPPLE EFFECT (Lake Kawaguchi / Kyoto Pond) */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-sky-950/40 via-sky-800/20 to-transparent pointer-events-none">
        <div className="w-full h-full animate-water-ripple opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent" />
      </div>

      {/* 7. FOREGROUND SWAYING CHERRY BLOSSOM BRANCHES */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 pointer-events-none opacity-85 animate-branch-sway">
        <svg viewBox="0 0 300 240" className="w-full h-full drop-shadow-sm">
          {/* Main Branch */}
          <path
            d="M300,0 Q240,40 180,30 Q120,20 80,70 Q40,120 0,130"
            fill="none"
            stroke="#451a03"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Sub twigs */}
          <path d="M220,25 Q180,80 140,90" fill="none" stroke="#451a03" strokeWidth="4" />
          <path d="M110,40 Q80,10 40,20" fill="none" stroke="#451a03" strokeWidth="3.5" />
          <path d="M60,95 Q30,130 10,150" fill="none" stroke="#451a03" strokeWidth="3" />

          {/* Blossoms */}
          {[
            { cx: 240, cy: 30, r: 12 },
            { cx: 200, cy: 50, r: 15 },
            { cx: 160, cy: 35, r: 14 },
            { cx: 130, cy: 80, r: 16 },
            { cx: 90, cy: 60, r: 15 },
            { cx: 50, cy: 110, r: 14 },
            { cx: 15, cy: 135, r: 12 },
            { cx: 50, cy: 25, r: 13 },
            { cx: 110, cy: 15, r: 11 },
            { cx: 180, cy: 85, r: 13 },
          ].map((b, i) => (
            <g key={i} className="animate-pulse-glow" style={{ animationDelay: `${i * 0.4}s` }}>
              <circle cx={b.cx} cy={b.cy} r={b.r} fill="#fda4af" opacity="0.9" />
              <circle cx={b.cx} cy={b.cy} r={b.r * 0.7} fill="#fb7185" opacity="0.95" />
              <circle cx={b.cx} cy={b.cy} r={b.r * 0.3} fill="#fff1f2" />
            </g>
          ))}
        </svg>
      </div>

      {/* 8. SWAYING RED JAPANESE LANTERNS (CHOCHIN) */}
      <div className="absolute top-0 left-6 sm:left-12 pointer-events-none flex gap-8 z-10">
        {/* Lantern 1 */}
        <div className="animate-lantern flex flex-col items-center">
          <div className="w-1 h-14 bg-neutral-900 shadow-sm" />
          <div className="w-12 h-16 rounded-2xl bg-gradient-to-b from-rose-600 via-red-600 to-rose-700 shadow-[0_0_15px_rgba(225,29,72,0.6)] border border-rose-400/60 flex flex-col items-center justify-between py-1.5 text-white">
            <div className="w-8 h-1 bg-neutral-900 rounded-full" />
            <span className="font-black text-xs tracking-widest text-amber-200">祭</span>
            <div className="w-8 h-1 bg-neutral-900 rounded-full" />
          </div>
          <div className="w-1 h-3 bg-red-900" />
        </div>

        {/* Lantern 2 */}
        <div className="animate-lantern hidden sm:flex flex-col items-center" style={{ animationDelay: '1.2s' }}>
          <div className="w-1 h-8 bg-neutral-900 shadow-sm" />
          <div className="w-10 h-14 rounded-2xl bg-gradient-to-b from-rose-600 via-red-600 to-rose-700 shadow-[0_0_12px_rgba(225,29,72,0.5)] border border-rose-400/60 flex flex-col items-center justify-between py-1.5 text-white">
            <div className="w-6 h-1 bg-neutral-900 rounded-full" />
            <span className="font-black text-[10px] tracking-widest text-amber-200">和</span>
            <div className="w-6 h-1 bg-neutral-900 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
});
