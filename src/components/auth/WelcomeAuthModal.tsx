import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../auth/authContext';

export const WelcomeAuthModal: React.FC = () => {
  const { loginWithGoogle, loginWithGuest, hasLegacyData, migrateLegacyData } = useAuth();
  const [loadingType, setLoadingType] = useState<'google' | 'guest' | null>(null);
  const [showLegacyModal, setShowLegacyModal] = useState<boolean>(hasLegacyData);

  const handleGoogle = async () => {
    setLoadingType('google');
    try {
      await loginWithGoogle();
    } finally {
      setLoadingType(null);
    }
  };

  const handleGuest = async () => {
    setLoadingType('guest');
    try {
      await loginWithGuest();
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl max-w-md w-full rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl relative overflow-hidden text-neutral-900">
        {/* Japanese Torii & Hinomaru Decorative Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Logo & Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-rose-600/30">
            <span className="text-3xl sm:text-4xl font-black">日</span>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
                JEPANGIN
              </h1>
              <span className="text-xs bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
                ID
              </span>
            </div>
            <p className="text-neutral-600 text-sm font-semibold mt-1">
              Belajar Jepang, selangkah demi selangkah.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3.5 my-7 relative z-10">
          {/* Continue with Google */}
          <button
            id="btn-login-google"
            onClick={handleGoogle}
            disabled={loadingType !== null}
            className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-neutral-50 active:bg-neutral-100 border-2 border-neutral-200/90 text-neutral-900 font-extrabold text-sm sm:text-base shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60"
          >
            {/* Google G SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loadingType === 'google' ? 'Menghubungkan...' : 'Lanjut dengan Google'}</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">atau</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Continue as Guest */}
          <button
            id="btn-login-guest"
            onClick={handleGuest}
            disabled={loadingType !== null}
            className="w-full py-4 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
          >
            <User className="w-5 h-5" />
            <span>{loadingType === 'guest' ? 'Menyiapkan Akun...' : 'Lanjut sebagai Tamu 👤'}</span>
          </button>
        </div>

        {/* Reassurance Footer */}
        <div className="text-center pt-2 border-t border-neutral-100 relative z-10">
          <p className="text-xs text-neutral-500 font-medium leading-relaxed">
            Progress belajarmu dapat disimpan dan dilanjutkan kapan saja.
          </p>
        </div>
      </div>

      {/* Migration Prompt Modal (if legacy data detected) */}
      {showLegacyModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-neutral-200 text-neutral-900 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              📦
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">
                Kami Menemukan Progress Belajar
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Ditemukan catatan belajar sebelumnya di perangkat ini. Apakah kamu ingin menyimpannya ke akun barumu?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                id="btn-keep-legacy-progress"
                onClick={() => {
                  migrateLegacyData(true);
                  setShowLegacyModal(false);
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Gunakan Progress Ini
              </button>
              <button
                id="btn-discard-legacy-progress"
                onClick={() => {
                  migrateLegacyData(false);
                  setShowLegacyModal(false);
                }}
                className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Mulai Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
