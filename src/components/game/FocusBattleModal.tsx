import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { FocusBattleConfig, BattleOption } from '../../game/types';
import { speakJapanese, playSound } from '../../utils/audio';

interface FocusBattleModalProps {
  config: FocusBattleConfig;
  onCompleteFocus: () => void;
}

export const FocusBattleModal: React.FC<FocusBattleModalProps> = ({
  config,
  onCompleteFocus,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<BattleOption | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = config.questions[currentIdx];

  const handleSelect = (opt: BattleOption) => {
    if (isSubmitted) return;
    playSound('click');
    setSelectedOption(opt);
    setIsSubmitted(true);

    if (opt.isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const handleNext = () => {
    if (currentIdx < config.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
      playSound('complete');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div
        className="rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 text-white"
        style={{
          background: 'rgba(20, 20, 30, 0.94)',
          border: '1px solid rgba(251, 191, 36, 0.4)',
        }}
      >
        {!isFinished ? (
          <>
            {/* Header Alert */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs font-black uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                  FOCUS BATTLE ⚠️
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  Latihan Pembeda Karakter
                </h3>
              </div>
            </div>

            {/* Character Comparison Box */}
            <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-3.5 flex items-center justify-around text-center">
              <div
                onClick={() => speakJapanese(config.primaryKana.kana)}
                className="cursor-pointer group"
              >
                <span className="text-3xl sm:text-4xl font-black block font-japanese text-rose-300 group-hover:scale-105 transition-transform">
                  {config.primaryKana.kana}
                </span>
                <span className="text-xs font-bold uppercase text-white/80">
                  {config.primaryKana.romaji} 🔊
                </span>
              </div>

              <span className="text-lg font-black text-amber-300">vs</span>

              <div
                onClick={() => speakJapanese(config.confusedWithKana.kana)}
                className="cursor-pointer group"
              >
                <span className="text-3xl sm:text-4xl font-black block font-japanese text-indigo-300 group-hover:scale-105 transition-transform">
                  {config.confusedWithKana.kana}
                </span>
                <span className="text-xs font-bold uppercase text-white/80">
                  {config.confusedWithKana.romaji} 🔊
                </span>
              </div>
            </div>

            {/* Mini question */}
            {currentQ && (
              <div className="space-y-3.5">
                <div className="text-center">
                  <span className="text-xs font-bold text-white/60">
                    Latihan {currentIdx + 1} dari {config.questions.length}
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-white mt-1">
                    {currentQ.promptText}:{' '}
                    <span className="text-xl sm:text-2xl font-black text-rose-300 ml-1 font-japanese">
                      {currentQ.promptDisplay}
                    </span>
                  </h4>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption?.text === opt.text;
                    let style = 'bg-white/10 hover:bg-white/20 border-white/15 text-white';

                    if (isSubmitted) {
                      if (opt.isCorrect) {
                        style = 'bg-emerald-600 text-white border-emerald-400 shadow-sm';
                      } else if (isSelected && !opt.isCorrect) {
                        style = 'bg-rose-600 text-white border-rose-400 line-through';
                      } else {
                        style = 'bg-white/5 text-white/30 opacity-40 border-white/5';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        id={`btn-focus-opt-${idx}`}
                        onClick={() => handleSelect(opt)}
                        disabled={isSubmitted}
                        className={`p-3.5 rounded-xl border font-black text-lg text-center transition-all cursor-pointer ${style}`}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <button
                    id="btn-focus-next"
                    onClick={handleNext}
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          /* Focus Battle Complete */
          <div className="text-center space-y-4 py-3">
            <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-400/30">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                FOCUS COMPLETE
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                🧠 Hafalanmu Semakin Kuat!
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mt-1">
                Kamu telah melatih perbedaan antara kedua huruf. Sekarang kembali ke pertempuran utama!
              </p>
            </div>

            <button
              id="btn-return-main-battle"
              onClick={onCompleteFocus}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <span>KEMBALI KE BATTLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
