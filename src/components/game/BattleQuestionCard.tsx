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
    <div className="space-y-4 max-w-xl mx-auto animate-fade-in">
      {/* 1. Main Question Box */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/70 p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
        {/* Recovery queue indicator */}
        {question.isRecoveryQuestion && (
          <div className="inline-flex items-center gap-1.5 bg-sky-100/90 text-sky-800 text-xs font-black px-3 py-1 rounded-full mb-3 border border-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Review Ingatan (Uji Ulang)</span>
          </div>
        )}

        {/* Question Prompt Title */}
        <h3 className="text-base sm:text-lg font-bold text-neutral-600">
          {question.promptText}
        </h3>

        {/* BIG CHARACTER / ROMAJI DISPLAY */}
        <div className="my-4 sm:my-6 py-5 sm:py-8 bg-white/70 backdrop-blur-xs rounded-2xl border border-neutral-200/80 relative shadow-inner flex flex-col items-center justify-center">
          <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-neutral-900 tracking-wider select-none font-japanese">
            {question.promptDisplay}
          </span>

          {/* Audio Pronunciation Button */}
          <button
            id="btn-speak-question"
            onClick={() => speakJapanese(question.targetKana.kana)}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs sm:text-sm border border-rose-200 transition-transform active:scale-95 cursor-pointer"
            title="Dengarkan pengucapan audio asli"
          >
            <Volume2 className="w-4 h-4 text-rose-600" />
            <span>Dengar Suara 🔊</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-neutral-500 font-medium">
          {question.subPrompt || 'Pilih jawaban yang paling tepat di bawah'}
        </p>
      </div>

      {/* 2. 4 Large Mobile-First Answer Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {question.options.map((option, idx) => {
          const isThisSelected = selectedOption?.text === option.text;
          let btnStyle = 'bg-white/85 hover:bg-rose-50/90 border-neutral-200/90 text-neutral-900 hover:border-rose-300';

          if (isSubmitted) {
            if (option.isCorrect) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02]';
            } else if (isThisSelected && !isCorrect) {
              btnStyle = 'bg-rose-500 text-white border-rose-600 line-through';
            } else {
              btnStyle = 'bg-white/40 border-neutral-200 text-neutral-400 opacity-50';
            }
          } else if (isThisSelected) {
            btnStyle = 'bg-rose-100/90 border-rose-500 text-rose-900 font-black shadow-sm';
          }

          return (
            <button
              key={idx}
              id={`btn-battle-option-${idx}`}
              onClick={() => onSelectOption(option)}
              disabled={isSubmitted}
              className={`p-4 sm:p-5 rounded-2xl border-2 text-center font-black text-xl sm:text-2xl transition-all cursor-pointer flex items-center justify-center min-h-[64px] sm:min-h-[72px] active:scale-95 select-none shadow-sm ${btnStyle}`}
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
              ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/95 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-black text-base sm:text-lg">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span>BENAR! {question.targetKana.kana} = {question.targetKana.romaji.toUpperCase()}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    <span>BELUM TEPAT</span>
                  </>
                )}
              </div>

              {isCorrect ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800">
                  <span>+{earnedXpThisTurn} XP</span>
                  {comboCount >= 2 && <span>• 🔥 Combo x{comboCount}</span>}
                </div>
              ) : (
                <div className="space-y-1 mt-1 text-xs sm:text-sm text-rose-900">
                  <p className="font-bold">
                    Jawaban tepat: <span className="font-black underline">{question.targetKana.kana} = {question.targetKana.romaji.toUpperCase()}</span>
                  </p>
                  <p className="text-rose-800 text-xs italic">
                    🧠 Huruf ini dijadwalkan muncul lagi beberapa soal lagi untuk memperkuat ingatanmu.
                  </p>
                  {question.targetKana.mnemonic && (
                    <div className="pt-1.5 flex items-start gap-1.5 text-xs text-rose-950 font-medium">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
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
              className={`px-5 py-3 rounded-xl font-black text-sm sm:text-base flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 shadow-md cursor-pointer ${
                isCorrect
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
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
