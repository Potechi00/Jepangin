import React, { useState } from 'react';
import { PenTool, Volume2, CheckCircle2, XCircle, Sparkles, RefreshCw, Trophy, ArrowRight, Brain, Zap } from 'lucide-react';
import { UserProgress } from '../../types';
import { speakJapanese, playSound } from '../../utils/audio';
import { MemoryBattleView } from '../game/MemoryBattleView';

interface PracticeViewProps {
  progress: UserProgress;
  onAddXp: (amount: number) => void;
}

interface PracticeQuestion {
  id: string;
  type: 'kana' | 'vocab' | 'audio';
  question: string;
  display: string;
  audio?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const PRACTICE_POOL: PracticeQuestion[] = [
  {
    id: 'p-1',
    type: 'kana',
    question: 'Huruf Hiragana manakah yang dibaca "A"?',
    display: 'A',
    options: ['あ', 'い', 'う', 'え'],
    correctAnswer: 'あ',
    explanation: 'Huruf "あ" dibaca "A".',
  },
  {
    id: 'p-2',
    type: 'vocab',
    question: 'Apa arti dari kata "Arigatou gozaimasu"?',
    display: 'ありがとうございます',
    options: ['Terima kasih banyak', 'Selamat pagi', 'Sampai jumpa', 'Permisi'],
    correctAnswer: 'Terima kasih banyak',
    explanation: 'Arigatou gozaimasu berarti terima kasih banyak secara sopan.',
  },
  {
    id: 'p-3',
    type: 'audio',
    question: 'Dengarkan suara ini, kata apakah yang diucapkan?',
    display: '🔊 Audio Jepang',
    audio: 'こんにちは',
    options: ['Konnichiwa (Halo)', 'Ohayou (Pagi)', 'Sayounara (Dah)', 'Sumimasen (Maaf)'],
    correctAnswer: 'Konnichiwa (Halo)',
    explanation: 'Suara tersebut mengucapkan "Konnichiwa" yang artinya Halo / Selamat Siang.',
  },
  {
    id: 'p-4',
    type: 'kana',
    question: 'Huruf "か" dibaca sebagai apa?',
    display: 'か',
    options: ['Ka', 'Ki', 'Ku', 'Ko'],
    correctAnswer: 'Ka',
    explanation: 'Huruf "か" dibaca "Ka".',
  },
  {
    id: 'p-5',
    type: 'vocab',
    question: 'Bagaimana cara mengucapkan "Permisi / Maaf" saat memanggil pelayan?',
    display: 'Permisi / Maaf',
    options: ['Sumimasen', 'Douzo', 'Oyasumi', 'Hai'],
    correctAnswer: 'Sumimasen',
    explanation: 'Sumimasen (すみません) adalah kata ajaib untuk permisi atau meminta maaf ringan.',
  },
  {
    id: 'p-6',
    type: 'kana',
    question: 'Huruf manakah yang berbentuk seperti kail pancing dan dibaca "Shi"?',
    display: 'Shi',
    options: ['し', 'す', 'さ', 'せ'],
    correctAnswer: 'し',
    explanation: 'Huruf "し" dibaca "Shi".',
  },
  {
    id: 'p-7',
    type: 'vocab',
    question: 'Berapakah nilai dari kata "Juu" (じゅう)?',
    display: 'じゅう (Juu)',
    options: ['10', '5', '1', '7'],
    correctAnswer: '10',
    explanation: 'Juu adalah angka 10 dalam bahasa Jepang.',
  },
];

export const PracticeView: React.FC<PracticeViewProps> = ({ progress, onAddXp }) => {
  const [practiceMode, setPracticeMode] = useState<'battle' | 'quiz'>('battle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Take 5 random questions for this session
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() => {
    return [...PRACTICE_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
  });

  const startNewSession = () => {
    const newQs = [...PRACTICE_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(newQs);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
    setIsPlaying(true);
  };

  const currentQ = questions[currentIdx];

  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted) return;
    playSound('click');
    setSelectedAnswer(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;

    const correct = selectedAnswer === currentQ.correctAnswer;
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      playSound('correct');
      setScore(prev => prev + 1);
    } else {
      playSound('wrong');
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished practice
      setIsFinished(true);
      playSound('complete');
      onAddXp(30);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Segment Switcher: Memory Battle vs Kuis Kilat */}
      <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/70 shadow-md flex items-center gap-2 max-w-lg mx-auto">
        <button
          id="btn-switch-to-memory-battle"
          onClick={() => {
            playSound('click');
            setPracticeMode('battle');
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            practiceMode === 'battle'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>⚔️ Memory Battle (Game)</span>
        </button>

        <button
          id="btn-switch-to-quick-quiz"
          onClick={() => {
            playSound('click');
            setPracticeMode('quiz');
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            practiceMode === 'quiz'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>📝 Kuis Kilat (5 Soal)</span>
        </button>
      </div>

      {/* RENDER ACTIVE MODE */}
      {practiceMode === 'battle' ? (
        <MemoryBattleView progress={progress} onAddXp={onAddXp} />
      ) : (
        <>
          {/* Practice Header for Quiz */}
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg">
            <div className="flex items-center gap-3 text-amber-600 mb-2">
              <PenTool className="w-6 h-6" />
              <span className="text-xs font-black uppercase tracking-wider bg-amber-100/90 text-amber-800 px-2.5 py-1 rounded-md border border-amber-200">
                Latihan Mandiri
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
              Kuis Kilat Santai
            </h1>
            <p className="text-neutral-700 text-sm sm:text-base mt-1 font-medium">
              5 soal pilihan ganda santai tanpa batas waktu untuk memperkuat daya ingat kosakata.
            </p>
          </div>

          {!isPlaying && !isFinished && (
            <div className="bg-gradient-to-br from-amber-500/90 to-orange-600/90 backdrop-blur-md rounded-3xl p-8 text-white shadow-xl shadow-amber-950/20 text-center space-y-6 border border-white/30">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto border border-white/30">
                <Sparkles className="w-10 h-10 text-white fill-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  Siap Uji Hafalan Hari Ini?
                </h2>
                <p className="text-amber-100 text-sm sm:text-base mt-2 max-w-md mx-auto font-medium">
                  5 soal pilihan ganda cepat. Dapatkan bonus +30 XP setelah menyelesaikan sesi latihan.
                </p>
              </div>

              <button
                id="btn-start-quick-quiz"
                onClick={startNewSession}
                className="w-full sm:w-auto px-8 py-4 sm:py-5 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 font-black text-lg sm:text-xl shadow-lg transition-transform active:scale-95 cursor-pointer inline-flex items-center justify-center gap-3"
              >
                <span>MULAI KUIS KILAT</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}

      {/* Active Practice Quiz Session */}
      {isPlaying && !isFinished && currentQ && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-md flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-neutral-600">
              Soal {currentIdx + 1} dari {questions.length}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
              Skor: {score} Benar
            </span>
          </div>

          {/* Question Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-3xl border border-white/60 p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* Visual Display or Audio Trigger */}
            <div className="my-6 py-6 bg-white/70 backdrop-blur-xs rounded-2xl text-center border border-neutral-200/80">
              {currentQ.audio ? (
                <button
                  id="btn-practice-audio"
                  onClick={() => speakJapanese(currentQ.audio || '')}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base inline-flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Dengarkan Suara 🔊</span>
                </button>
              ) : (
                <span className="text-4xl sm:text-5xl font-black text-neutral-900">
                  {currentQ.display}
                </span>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                let optionStyle = 'bg-white/70 hover:bg-amber-50/90 border-neutral-200/80 text-neutral-800';

                if (isAnswerSubmitted) {
                  if (opt === currentQ.correctAnswer) {
                    optionStyle = 'bg-emerald-50/90 border-emerald-500 text-emerald-950 font-black shadow-xs';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-50/90 border-rose-500 text-rose-950 line-through';
                  } else {
                    optionStyle = 'bg-white/50 border-neutral-200 text-neutral-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-amber-100/90 border-amber-500 text-amber-900 font-extrabold shadow-sm';
                }

                return (
                  <button
                    key={idx}
                    id={`practice-option-${idx}`}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswerSubmitted}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-base transition-all flex items-center justify-between cursor-pointer min-h-[58px] ${optionStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && opt === currentQ.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {isAnswerSubmitted && (
              <div
                className={`mt-6 p-4 rounded-2xl border ${
                  isCorrect
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50/90 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                  <span>{isCorrect ? 'Benar Sekali! 🎉' : `Kurang tepat. Jawaban: ${currentQ.correctAnswer}`}</span>
                </div>
                <p className="text-xs mt-1 opacity-90">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          {!isAnswerSubmitted ? (
            <button
              id="btn-check-practice"
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                selectedAnswer
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/30 cursor-pointer'
                  : 'bg-neutral-200/80 text-neutral-400 cursor-not-allowed'
              }`}
            >
              PERIKSA JAWABAN
            </button>
          ) : (
            <button
              id="btn-next-practice"
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-lg shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{currentIdx === questions.length - 1 ? 'LIHAT HASIL AKHIR' : 'SOAL BERIKUTNYA'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Finished Summary */}
      {isFinished && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-amber-300/80 p-8 sm:p-12 text-center shadow-xl shadow-amber-950/10 space-y-6 max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Trophy className="w-12 h-12" />
          </div>

          <div>
            <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-md border border-amber-200">
              KUIS SELESAI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-2">
              Hasil Latihan Kamu: {score} dari {questions.length} Benar!
            </h2>
            <p className="text-neutral-600 text-sm mt-1">
              Bonus +30 XP telah ditambahkan ke akun belajarmu.
            </p>
          </div>

          <button
            id="btn-practice-again"
            onClick={startNewSession}
            className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Coba Latihan Lagi</span>
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
};
