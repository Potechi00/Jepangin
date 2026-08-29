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
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-amber-400 shadow-2xl space-y-6 text-neutral-900">
        {!isFinished ? (
          <>
            {/* Header Alert */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  FOCUS BATTLE ⚠️
                </span>
                <h3 className="text-lg font-black text-neutral-900 mt-0.5">
                  Latihan Pembeda Karakter
                </h3>
              </div>
            </div>

            {/* Character Comparison Box */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-around text-center">
              <div
                onClick={() => speakJapanese(config.primaryKana.kana)}
                className="cursor-pointer group"
              >
                <span className="text-4xl sm:text-5xl font-black block font-japanese text-rose-600 group-hover:scale-105 transition-transform">
                  {config.primaryKana.kana}
                </span>
                <span className="text-xs font-bold uppercase text-neutral-700">
                  {config.primaryKana.romaji} 🔊
                </span>
              </div>

              <span className="text-xl font-black text-amber-700">vs</span>

              <div
                onClick={() => speakJapanese(config.confusedWithKana.kana)}
                className="cursor-pointer group"
              >
                <span className="text-4xl sm:text-5xl font-black block font-japanese text-indigo-600 group-hover:scale-105 transition-transform">
                  {config.confusedWithKana.kana}
                </span>
                <span className="text-xs font-bold uppercase text-neutral-700">
                  {config.confusedWithKana.romaji} 🔊
                </span>
              </div>
            </div>

            {/* Mini question */}
            {currentQ && (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-neutral-500">
                    Latihan {currentIdx + 1} dari {config.questions.length}
                  </span>
                  <h4 className="text-base font-extrabold text-neutral-900 mt-1">
                    {currentQ.promptText}:{' '}
                    <span className="text-2xl font-black text-rose-600 ml-1">
                      {currentQ.promptDisplay}
                    </span>
                  </h4>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption?.text === opt.text;
                    let style = 'bg-white hover:bg-amber-50 border-neutral-200 text-neutral-800';

                    if (isSubmitted) {
                      if (opt.isCorrect) {
                        style = 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
                      } else if (isSelected && !opt.isCorrect) {
                        style = 'bg-rose-500 text-white border-rose-600 line-through';
                      } else {
                        style = 'bg-neutral-100 text-neutral-400 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        id={`btn-focus-opt-${idx}`}
                        onClick={() => handleSelect(opt)}
                        disabled={isSubmitted}
                        className={`p-4 rounded-xl border-2 font-black text-xl text-center transition-all cursor-pointer ${style}`}
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
                    className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-base flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          /* Focus Battle Complete */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                FOCUS COMPLETE
              </span>
              <h3 className="text-2xl font-black text-neutral-900 mt-2">
                🧠 Hafalanmu Semakin Kuat!
              </h3>
              <p className="text-neutral-600 text-sm mt-1">
                Kamu telah melatih perbedaan antara kedua huruf. Sekarang kembali ke pertempuran utama!
              </p>
            </div>

            <button
              id="btn-return-main-battle"
              onClick={onCompleteFocus}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <span>KEMBALI KE BATTLE</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
