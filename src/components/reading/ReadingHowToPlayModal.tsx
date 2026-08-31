import React, { memo } from 'react';
import { X, CheckCircle2, Heart, BookOpen, Zap } from 'lucide-react';

interface ReadingHowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadingHowToPlayModal: React.FC<ReadingHowToPlayModalProps> = memo(({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    {
      step: '1',
      title: 'Lihat Kata Jepang',
      desc: 'Sebuah kata dalam huruf Hiragana atau Katakana akan muncul di tengah layar.',
      icon: <span className="text-xl font-black">ね</span>,
      color: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    },
    {
      step: '2',
      title: 'Pilih Cara Membaca yang Benar',
      desc: 'Pilih salah satu dari 4 pilihan Romaji yang paling tepat dan akurat.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    },
    {
      step: '3',
      title: 'Jawab Cepat untuk Combo & Speed Bonus',
      desc: 'Menjawab benar berturut-turut memberi combo. Menjawab dalam <3 detik memberi Speed Bonus XP!',
      icon: <Zap className="w-4 h-4 text-amber-300 fill-amber-400" />,
      color: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    },
    {
      step: '4',
      title: 'Jangan Sampai 3 Nyawamu Habis',
      desc: 'Setiap jawaban salah atau kehabisan waktu mengurangi 1 ❤️ nyawa. Pertahankan nyawamu!',
      icon: <Heart className="w-4 h-4 text-red-400 fill-red-500" />,
      color: 'bg-red-500/20 text-red-300 border-red-400/30',
    },
    {
      step: '5',
      title: 'Kata Salah Otomatis Masuk ke Review',
      desc: 'Kata yang belum kamu kuasai akan dikumpulkan di menu Review untuk dilatih kembali.',
      icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
      color: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-lg cinematic-focus-card rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="btn-close-how-to-play"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-transform active:scale-90 cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-black text-2xl border border-rose-400/30">
            📖
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-400/30">
              Panduan Bermain
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
              Cara Main 「よめる？」
            </h2>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-2.5">
          {rules.map((rule) => (
            <div
              key={rule.step}
              className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${rule.color}`}
              >
                {rule.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-rose-400">#{rule.step}</span>
                  <h3 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                    {rule.title}
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-white/75 mt-0.5 leading-relaxed font-medium">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action button */}
        <button
          id="btn-understand-how-to-play"
          onClick={onClose}
          className="w-full mt-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-600/30 transition-transform active:scale-98 cursor-pointer"
        >
          Saya Mengerti, Ayo Main! 🚀
        </button>
      </div>
    </div>
  );
});
