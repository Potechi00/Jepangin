import React, { useState, memo } from 'react';
import { User, Volume2, LogIn, LogOut, Check, Cloud, ShieldCheck, RotateCcw } from 'lucide-react';
import { UserProgress } from '../../types';
import { useAuth } from '../../auth/authContext';
import { AVATARS } from '../../utils/storage';

interface ProfileViewProps {
  progress: UserProgress;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (avatar: string) => void;
  onToggleSound: () => void;
  onResetProgress: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = memo(({
  progress,
  onUpdateName,
  onUpdateAvatar,
  onToggleSound,
  onResetProgress,
}) => {
  const { user, loginWithGoogle, logout } = useAuth();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.userName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="space-y-5 pb-12 animate-fade-in select-none">
      {/* Header HUD Card */}
      <div className="cinematic-content-card rounded-3xl p-5 sm:p-7 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-rose-400" />
          <span className="cinematic-tag text-rose-300 border-rose-400/30">
            Pengaturan Akun
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-sm">
          Profil & Personalisasi
        </h1>
        <p className="text-white/80 text-xs sm:text-sm mt-1 font-medium">
          Kelola avatar, nama panggilan, audio pengucapan, dan pencadangan akun Google.
        </p>
      </div>

      {/* CLOUD ACCOUNT & GOOGLE LOGIN CARD */}
      <div className="cinematic-content-card rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-400" />
            <h3 className="font-black text-white text-sm sm:text-base">
              Sinkronisasi Cloud
            </h3>
          </div>
          {user?.provider === 'google' ? (
            <span className="text-[11px] font-black bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Tersambung Google
            </span>
          ) : (
            <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-300/30">
              Mode Tamu (Guest)
            </span>
          )}
        </div>

        {user?.provider === 'google' ? (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-11 h-11 rounded-full border-2 border-emerald-400 shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-lg border border-emerald-400/30">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <div>
                <h4 className="font-black text-white text-sm sm:text-base">{user.displayName}</h4>
                <p className="text-xs text-white/70 font-medium">{user.email}</p>
                <p className="text-[11px] text-emerald-300 font-bold mt-0.5">
                  ✅ Progress XP dan Streak tersinkronisasi otomatis
                </p>
              </div>
            </div>

            <button
              id="btn-logout-google"
              onClick={logout}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/80 hover:text-rose-300 border border-white/15 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div>
              <h4 className="font-black text-white text-sm sm:text-base">
                Simpan Progress Anda Secara Permanen
              </h4>
              <p className="text-xs text-white/75 mt-1 font-medium leading-relaxed">
                Saat ini Anda belajar sebagai Tamu. Hubungkan Akun Google untuk menjaga streak, XP, dan riwayat belajar agar tidak hilang saat ganti perangkat.
              </p>
            </div>

            <button
              id="btn-login-google"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/25 transition-all active:scale-98 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>{isLoggingIn ? 'Menghubungkan...' : 'Masuk dengan Google (Google Sign-In)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Avatar & Name Customization */}
      <div className="cinematic-content-card rounded-3xl p-5 sm:p-6 shadow-lg space-y-5">
        {/* Name input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <span className="text-4xl select-none p-2.5 rounded-2xl bg-white/10 border border-white/15">
              {progress.avatar}
            </span>
            <div>
              <span className="text-[10px] font-black uppercase text-white/60 tracking-wider">Nama Panggilan</span>
              {isEditingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-white/25 font-bold text-sm bg-neutral-900/80 text-white focus:outline-rose-500"
                    maxLength={20}
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                  {progress.userName}
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer underline decoration-dotted"
                  >
                    (Ubah)
                  </button>
                </h2>
              )}
            </div>
          </div>
        </div>

        {/* Avatar Picker */}
        <div>
          <h3 className="font-black text-white text-xs sm:text-sm mb-2.5">
            Pilih Karakter Avatar Favorit:
          </h3>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {AVATARS.map((av) => {
              const isSelected = progress.avatar === av.emoji;
              return (
                <button
                  key={av.id}
                  id={`btn-avatar-${av.id}`}
                  title={av.name}
                  onClick={() => onUpdateAvatar(av.emoji)}
                  className={`text-2xl sm:text-3xl p-2.5 rounded-2xl border transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500/30 border-rose-400 scale-105 shadow-sm'
                      : 'bg-white/5 hover:bg-white/15 border-white/10'
                  }`}
                >
                  {av.emoji}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audio SFX Settings Card */}
      <div className="cinematic-content-card rounded-3xl p-5 sm:p-6 shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-rose-400" />
          <h3 className="font-black text-white text-sm sm:text-base">
            Pengaturan Audio & Suara
          </h3>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <div>
            <h4 className="font-black text-white text-xs sm:text-sm">Efek Suara & Pengucapan</h4>
            <p className="text-[11px] text-white/70 font-medium">
              Suara ketukan jawaban dan audio pelafalan bahasa Jepang
            </p>
          </div>
          <button
            onClick={onToggleSound}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              progress.soundEffects
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                : 'bg-white/15 text-white/60 border border-white/15'
            }`}
          >
            {progress.soundEffects ? 'AKTIF' : 'NONAKTIF'}
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset */}
      <div className="cinematic-floating-card rounded-3xl p-4 sm:p-5 border-red-500/20 hover:border-red-500/35 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-black text-white text-xs sm:text-sm">Atur Ulang (Reset) Progress</h4>
            <p className="text-[11px] text-white/60 font-medium mt-0.5">
              Hapus semua XP, riwayat pelajaran, dan mulai dari nol kembali.
            </p>
          </div>

          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onResetProgress}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs cursor-pointer shadow-xs"
              >
                Ya, Hapus Semua
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-2 rounded-xl bg-white/15 text-white/80 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-400/25 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Belajar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
