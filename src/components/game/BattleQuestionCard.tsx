import React from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import { BattleQuestion, BattleOption } from '../../game/types';
import { speakJapanese } from '../../utils/audio';

interface BattleQuestionCardProps {
  question: BattleQuestion;
  selectedOption: BattleOption | null;
  isSubmitted: boolean;
  onSelectOption: (option: BattleOption) => void;
  onContinue: () => void;
  earnedXpThisTurn?: number;
  comboCount: number;
}

export const BattleQuestionCard: React.FC<BattleQuestionCardProps> = ({
  question,
  selectedOption,
  isSubmitted,
  onSelectOption,
  onContinue,
  earnedXpThisTurn = 10,
  comboCount,
}) => {
  const isCorrect = selectedOption?.isCorrect ?? false;

  return (
    <div className="space-y-3.5 max-w-xl mx-auto animate-fade-in">
      {/* 1. Main Question Box */}
      <div className="cinematic-content-card rounded-3xl p-5 sm:p-7 shadow-xl text-center relative overflow-hidden">
        {/* Recovery queue indicator */}
        {question.isRecoveryQuestion && (
          <div className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 text-xs font-black px-3 py-1 rounded-full mb-3 border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Review Ingatan (Uji Ulang)</span>
          </div>
        )}

        {/* Question Prompt Title */}
        <h3 className="text-sm sm:text-base font-bold text-white/80">
          {question.promptText}
        </h3>

        {/* BIG CHARACTER / ROMAJI DISPLAY */}
        <div className="my-3 sm:my-5 py-4 sm:py-6 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15 relative shadow-inner flex flex-col items-center justify-center">
          <span className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-wider select-none font-japanese">
            {question.promptDisplay}
          </span>

          {/* Audio Pronunciation Button */}
          <button
            id="btn-speak-question"
            onClick={() => speakJapanese(question.targetKana.kana)}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-extrabold text-xs sm:text-sm border border-rose-400/30 transition-transform active:scale-95 cursor-pointer"
            title="Dengarkan pengucapan audio asli"
          >
            <Volume2 className="w-4 h-4 text-rose-300" />
            <span>Dengar Suara 🔊</span>
          </button>
        </div>

        <p className="text-xs text-white/60 font-medium">
          {question.subPrompt || 'Pilih jawaban yang paling tepat di bawah'}
        </p>
      </div>

      {/* 2. 4 Large Mobile-First Answer Buttons */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {question.options.map((option, idx) => {
          const isThisSelected = selectedOption?.text === option.text;
          let btnStyle = 'cinematic-floating-card hover:bg-white/25 text-white';

          if (isSubmitted) {
            if (option.isCorrect) {
              btnStyle = 'bg-emerald-600/90 text-white border-emerald-400 shadow-md scale-[1.02]';
            } else if (isThisSelected && !isCorrect) {
              btnStyle = 'bg-rose-600/90 text-white border-rose-400 line-through';
            } else {
              btnStyle = 'bg-white/5 border-white/10 text-white/40 opacity-40';
            }
          } else if (isThisSelected) {
            btnStyle = 'bg-rose-500/30 border-rose-400 text-rose-200 font-black shadow-sm';
          }

          return (
            <button
              key={idx}
              id={`btn-battle-option-${idx}`}
              onClick={() => onSelectOption(option)}
              disabled={isSubmitted}
              className={`p-3.5 sm:p-4 rounded-2xl border text-center font-black text-xl sm:text-2xl transition-all cursor-pointer flex items-center justify-center min-h-[58px] sm:min-h-[66px] active:scale-95 select-none shadow-sm ${btnStyle}`}
            >
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Feedback Card (Instant explanation after submit) */}
      {isSubmitted && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border animate-fade-in shadow-md ${
            isCorrect
              ? 'bg-emerald-950/60 border-emerald-400/80 text-emerald-100'
              : 'bg-rose-950/60 border-rose-400/80 text-rose-100'
          }`}
          style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>BENAR! {question.targetKana.kana} = {question.targetKana.romaji.toUpperCase()}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>BELUM TEPAT</span>
                  </>
                )}
              </div>

              {isCorrect ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300">
                  <span>+{earnedXpThisTurn} XP</span>
                  {comboCount >= 2 && <span>• 🔥 Combo x{comboCount}</span>}
                </div>
              ) : (
                <div className="space-y-1 mt-1 text-xs sm:text-sm text-rose-200">
                  <p className="font-bold">
                    Jawaban tepat: <span className="font-black underline text-white">{question.targetKana.kana} = {question.targetKana.romaji.toUpperCase()}</span>
                  </p>
                  <p className="text-rose-300 text-xs italic">
                    🧠 Huruf ini dijadwalkan muncul lagi beberapa soal lagi untuk memperkuat ingatanmu.
                  </p>
                  {question.targetKana.mnemonic && (
                    <div className="pt-1.5 flex items-start gap-1.5 text-xs text-rose-100 font-medium">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Tips Ingat: {question.targetKana.mnemonic}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Next Button */}
            <button
              id="btn-continue-battle-turn"
              onClick={onContinue}
              className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 shadow-md cursor-pointer ${
                isCorrect
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              <span>Lanjut</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
