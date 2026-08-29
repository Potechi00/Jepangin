import React, { useState } from 'react';
import {
  User,
  Settings,
  Volume2,
  Type,
  RefreshCw,
  Check,
  Sparkles,
  ShieldCheck,
  LogOut,
  Cloud,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { AVATARS } from '../../utils/storage';
import { useAuth } from '../../auth/authContext';

interface ProfileViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
  onResetProgress: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  progress,
  onUpdateProgress,
  onResetProgress,
}) => {
  const { user, linkGuestToGoogle, logout, isSaving } = useAuth();
  const [nameInput, setNameInput] = useState(progress.userName);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [linkFeedback, setLinkFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateProgress({ userName: nameInput.trim() });
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2500);
    }
  };

  const handleLinkGoogle = async () => {
    setIsLinking(true);
    setLinkFeedback(null);
    try {
      const res = await linkGuestToGoogle();
      setLinkFeedback(res);
    } finally {
      setIsLinking(false);
    }
  };

  const isGuest = user?.provider === 'anonymous';

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <User className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-wider bg-rose-100/90 text-rose-700 px-2.5 py-0.5 rounded-md border border-rose-200">
              Akun & Pengaturan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            Profil Pembelajar
          </h1>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 text-neutral-700 px-3 py-1 rounded-full text-xs font-bold">
          {isSaving ? (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Menyimpan...</span>
            </>
          ) : user?.provider === 'google' ? (
            <>
              <Cloud className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-blue-700">☁️ Tersimpan</span>
            </>
          ) : (
            <>
              <span className="text-neutral-500">👤 Tamu</span>
            </>
          )}
        </div>
      </div>

      {/* Guest Account Upgrade Banner (Simpan Progress Anda) */}
      {isGuest && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-orange-500/15 backdrop-blur-md rounded-3xl p-6 border-2 border-amber-400/50 shadow-lg space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-black text-neutral-900 flex items-center gap-2">
                <span>🔐 Simpan Progress Anda</span>
              </h2>
              <p className="text-neutral-700 text-xs sm:text-sm mt-1 font-medium leading-relaxed">
                Hubungkan akun Google agar progress belajarmu tetap aman dan bisa dilanjutkan di mana saja tanpa khawatir hilang.
              </p>
            </div>
          </div>

          <button
            id="btn-link-guest-to-google"
            onClick={handleLinkGoogle}
            disabled={isLinking}
            className="w-full py-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {/* Google Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#ffffff"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#ffffff"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#ffffff"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#ffffff"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLinking ? 'Menghubungkan Akun...' : 'Hubungkan dengan Google'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {linkFeedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                linkFeedback.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {linkFeedback.success ? '🎉 ' : '⚠️ '}
              {linkFeedback.message}
            </div>
          )}
        </div>
      )}

      {/* Avatar & Name Section */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-neutral-200/60">
          <div className="w-20 h-20 rounded-3xl bg-rose-100/90 border-2 border-rose-300 flex items-center justify-center text-4xl shadow-inner shrink-0 relative overflow-hidden">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              progress.avatar
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                {user?.displayName || progress.userName}
              </h2>
              {user?.provider === 'google' ? (
                <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  Google
                </span>
              ) : (
                <span className="text-[10px] font-extrabold bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-md">
                  Mode Tamu
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
              <p className="text-xs font-bold text-rose-700 bg-rose-100/90 border border-rose-200 px-2.5 py-0.5 rounded-full inline-block">
                Level {progress.level} • {progress.totalXp} XP Terkumpul
              </p>
              {user?.provider === 'google' && (
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                  ☁️ Progress tersimpan
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Change Avatar Selector */}
        <div>
          <label className="block text-sm font-extrabold text-neutral-800 mb-2">
            Pilih Karakter Avatar Favorit:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {AVATARS.map((av) => {
              const isSelected = progress.avatar === av.emoji;
              return (
                <button
                  key={av.id}
                  type="button"
                  id={`avatar-${av.id}`}
                  onClick={() => onUpdateProgress({ avatar: av.emoji })}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/90 scale-105 shadow-sm'
                      : 'border-neutral-200/80 hover:border-rose-300 bg-white/70 backdrop-blur-xs'
                  }`}
                >
                  <span className="text-2xl">{av.emoji}</span>
                  <span className="text-[10px] font-bold text-neutral-700 line-clamp-1 text-center">
                    {av.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Edit Name Form */}
        <form onSubmit={handleSaveName} className="space-y-2">
          <label className="block text-sm font-extrabold text-neutral-800">
            Nama Panggilan Anda:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="input-user-name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-neutral-300/90 bg-white/90 focus:border-rose-500 focus:outline-hidden text-base font-bold"
              placeholder="Masukkan nama Anda..."
              maxLength={25}
            />
            <button
              type="submit"
              id="btn-save-profile-name"
              className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-sm shadow-md cursor-pointer transition-colors"
            >
              Simpan
            </button>
          </div>
          {showSavedToast && (
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <Check className="w-4 h-4" />
              Nama berhasil disimpan!
            </p>
          )}
        </form>
      </div>

      {/* Accessibility & Experience Settings */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg space-y-4">
        <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-neutral-600" />
          <span>Pengaturan Kenyamanan & Aksesibilitas</span>
        </h3>

        {/* Large Font Mode */}
        <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-neutral-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg border border-indigo-200">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-neutral-900 text-sm block">Mode Teks Lebih Besar</span>
              <span className="text-xs text-neutral-600">Nyaman untuk membaca dan lansia / pemula</span>
            </div>
          </div>

          <button
            id="toggle-large-font"
            onClick={() => onUpdateProgress({ largeFontMode: !progress.largeFontMode })}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
              progress.largeFontMode ? 'bg-indigo-600' : 'bg-neutral-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform shadow-xs ${
                progress.largeFontMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Auto Voice On Flip */}
        <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-neutral-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-200">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-neutral-900 text-sm block">Pengucapan Suara Otomatis</span>
              <span className="text-xs text-neutral-600">Putar suara bahasa Jepang otomatis di kartu belajar</span>
            </div>
          </div>

          <button
            id="toggle-auto-voice"
            onClick={() => onUpdateProgress({ autoVoice: !progress.autoVoice })}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
              progress.autoVoice ? 'bg-rose-600' : 'bg-neutral-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform shadow-xs ${
                progress.autoVoice ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Account Logout / Session Control */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg space-y-4">
        <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
          <LogOut className="w-5 h-5 text-neutral-600" />
          <span>Keluar Akun / Sesi</span>
        </h3>

        {!showConfirmLogout ? (
          <button
            id="btn-trigger-logout"
            onClick={() => setShowConfirmLogout(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4 text-neutral-600" />
            <span>Keluar dari Akun</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <p className="text-xs font-bold text-neutral-800">
              {isGuest
                ? '⚠️ Anda berada di Mode Tamu. Jika keluar tanpa menghubungkan Google, progress tamu Anda mungkin tidak dapat dipulihkan.'
                : 'Keluar dari akun? Progress kamu tetap tersimpan dan bisa dilanjutkan saat login kembali.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                id="btn-confirm-logout"
                onClick={logout}
                className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl font-bold text-xs hover:bg-neutral-800 cursor-pointer"
              >
                Tetap Keluar
              </button>
              {isGuest && (
                <button
                  id="btn-logout-link-google-instead"
                  onClick={handleLinkGoogle}
                  className="px-4 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 cursor-pointer"
                >
                  Hubungkan Google Dulu
                </button>
              )}
              <button
                id="btn-cancel-logout"
                onClick={() => setShowConfirmLogout(false)}
                className="px-4 py-2.5 bg-neutral-200 text-neutral-700 rounded-xl font-bold text-xs hover:bg-neutral-300 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reset Progress Danger Zone */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-md text-center">
        {!showConfirmReset ? (
          <button
            type="button"
            id="btn-trigger-reset"
            onClick={() => setShowConfirmReset(true)}
            className="text-xs font-bold text-neutral-500 hover:text-rose-600 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Mulai Ulang Progress dari Awal (Reset)</span>
          </button>
        ) : (
          <div className="space-y-3 p-4 bg-rose-50/90 rounded-2xl border border-rose-200">
            <p className="text-xs font-bold text-rose-900">
              Apakah Anda yakin ingin menghapus semua progress dan mulai dari nol?
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                id="btn-confirm-reset"
                onClick={() => {
                  onResetProgress();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 cursor-pointer"
              >
                Ya, Reset Sekarang
              </button>
              <button
                type="button"
                id="btn-cancel-reset"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-xl font-bold text-xs hover:bg-neutral-300 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
