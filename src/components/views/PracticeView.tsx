import React, { useState, useCallback, memo } from 'react';
import { PenTool, Volume2, CheckCircle2, XCircle, Sparkles, RefreshCw, Trophy, ArrowRight, Brain, BookOpen, Flame, Zap, ArrowLeft, AlertTriangle } from 'lucide-react';
import { UserProgress } from '../../types';
import { speakJapanese, playSound } from '../../utils/audio';
import { MemoryBattleView } from '../game/MemoryBattleView';
import { YomeruReadingView } from '../reading/YomeruReadingView';

interface PracticeViewProps {
  progress: UserProgress;
  onAddXp: (amount: number) => void;
  onFocusModeChange?: (isFocused: boolean) => void;
}

interface QuizQuestion {
  id: string;
  type: 'kana' | 'vocab' | 'audio';
  question: string;
  display: string;
  audio?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const QUIZ_POOL: QuizQuestion[] = [
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

type ActiveGameMode = 'lobby' | 'yomeru' | 'battle' | 'quiz';

export const PracticeView: React.FC<PracticeViewProps> = memo(({ progress, onAddXp, onFocusModeChange }) => {
  const [activeGame, setActiveGame] = useState<ActiveGameMode>('lobby');

  // Kuis Kilat states
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [isQuizCorrect, setIsQuizCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Switch to Game Focus Mode
  const handleLaunchGame = useCallback((game: ActiveGameMode) => {
    playSound('click');
    setActiveGame(game);
    onFocusModeChange?.(game !== 'lobby');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (game === 'quiz') {
      const shuffled = [...QUIZ_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuizQuestions(shuffled);
      setQuizIdx(0);
      setSelectedQuizOption(null);
      setIsQuizSubmitted(false);
      setQuizScore(0);
      setIsQuizFinished(false);
    }
  }, [onFocusModeChange]);

  // Return cleanly to Training Lobby
  const handleReturnToLobby = useCallback(() => {
    playSound('click');
    setActiveGame('lobby');
    setShowExitModal(false);
    onFocusModeChange?.(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onFocusModeChange]);

  // Quiz gameplay handlers
  const handleSelectQuizOption = (opt: string) => {
    if (isQuizSubmitted) return;
    playSound('click');
    setSelectedQuizOption(opt);
  };

  const handleCheckQuizAnswer = () => {
    if (!selectedQuizOption || isQuizSubmitted) return;
    const currentQ = quizQuestions[quizIdx];
    const correct = selectedQuizOption === currentQ.correctAnswer;
    setIsQuizCorrect(correct);
    setIsQuizSubmitted(true);

    if (correct) {
      playSound('correct');
      setQuizScore((prev) => prev + 1);
    } else {
      playSound('wrong');
    }
  };

  const handleNextQuizQuestion = () => {
    playSound('click');
    if (quizIdx < quizQuestions.length - 1) {
      setQuizIdx((prev) => prev + 1);
      setSelectedQuizOption(null);
      setIsQuizSubmitted(false);
    } else {
      setIsQuizFinished(true);
      playSound('complete');
      onAddXp(30);
    }
  };

  // ==========================================
  // VIEW A: TRAINING LOBBY
  // ==========================================
  if (activeGame === 'lobby') {
    return (
      <div className="space-y-6 pb-12 animate-fade-in select-none">
        {/* Lobby Header Card */}
        <div className="cinematic-content-card rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-rose-300 mb-2">
            <PenTool className="w-5 h-5 text-rose-400" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-md border border-rose-400/30">
              Training Center
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white">
            Lobi Latihan & Game Interaktif
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1 font-medium">
            Pilih mode game untuk mengasah kemampuan membaca, daya ingat karakter, atau kuis kosakata santai.
          </p>
        </div>

        {/* GAME SELECTOR CARDS (3 CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* 1. GAME 2: YOMERU! Japanese Reading Challenge */}
          <div
            id="card-game-yomeru"
            onClick={() => handleLaunchGame('yomeru')}
            className="cinematic-content-card rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-4 transition-all hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(20, 50, 100, 0.40), rgba(15, 25, 45, 0.30))',
            }}
          >
            <div className="space-y-2.5">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-md shadow-rose-600/30 text-xl font-black">
                  読
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  GAME UTAMA
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  「よめる？」YOMERU!
                </h2>
                <p className="text-xs font-black text-rose-300 uppercase tracking-wider mt-0.5">
                  "Lihat. Baca. Kuasai."
                </p>
              </div>

              <p className="text-xs text-white/75 font-medium leading-relaxed">
                Tantangan membaca kosakata Jepang interaktif. 10 Stage progresif (250 kosakata nyata), audio pelafalan, combo beruntun & bonus XP kecepatan!
              </p>
            </div>

            <button
              id="btn-lobby-start-yomeru"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 group-hover:bg-rose-700 transition-all cursor-pointer"
            >
              <span>MAIN SEKARANG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. GAME 1: MEMORY BATTLE */}
          <div
            id="card-game-battle"
            onClick={() => handleLaunchGame('battle')}
            className="cinematic-content-card rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-4 transition-all hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 40, 95, 0.40), rgba(20, 25, 55, 0.30))',
            }}
          >
            <div className="space-y-2.5">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  SPACED REPETITION
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Memory Battle
                </h2>
                <p className="text-xs font-black text-indigo-300 uppercase tracking-wider mt-0.5">
                  "Hafalkan. Ingat. Kuasai."
                </p>
              </div>

              <p className="text-xs text-white/75 font-medium leading-relaxed">
                Pertarungan memori pintar untuk menguasai Hiragana & Katakana secara mendalam. Dilengkapi Boss Battle & fitur latih huruf lemah.
              </p>
            </div>

            <button
              id="btn-lobby-start-battle"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 group-hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <span>MAIN BATTLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. GAME 3: KUIS KILAT */}
          <div
            id="card-game-quiz"
            onClick={() => handleLaunchGame('quiz')}
            className="cinematic-content-card rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-4 transition-all hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(80, 50, 10, 0.40), rgba(40, 25, 10, 0.30))',
            }}
          >
            <div className="space-y-2.5">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                  <PenTool className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  SANTAI
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Kuis Kilat Santai
                </h2>
                <p className="text-xs font-black text-amber-300 uppercase tracking-wider mt-0.5">
                  "Uji Hafalan Santai"
                </p>
              </div>

              <p className="text-xs text-white/75 font-medium leading-relaxed">
                5 soal latihan pilihan ganda acak tanpa batas waktu untuk memperkuat pemahaman kosakata dan audio pendengaran (+30 XP).
              </p>
            </div>

            <button
              id="btn-lobby-start-quiz"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 group-hover:bg-amber-700 transition-all cursor-pointer"
            >
              <span>MULAI KUIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW B: GAME FOCUS MODE - YOMERU!
  // ==========================================
  if (activeGame === 'yomeru') {
    return (
      <div className="w-full select-none">
        <YomeruReadingView
          progress={progress}
          onAddXp={onAddXp}
          onBackToApp={handleReturnToLobby}
          onFocusModeChange={onFocusModeChange}
        />
      </div>
    );
  }

  // ==========================================
  // VIEW C: GAME FOCUS MODE - MEMORY BATTLE
  // ==========================================
  if (activeGame === 'battle') {
    return (
      <div className="w-full select-none">
        <MemoryBattleView
          progress={progress}
          onAddXp={onAddXp}
          onBackToApp={handleReturnToLobby}
          onFocusModeChange={onFocusModeChange}
        />
      </div>
    );
  }

  // ==========================================
  // VIEW D: GAME FOCUS MODE - KUIS KILAT
  // ==========================================
  const currentQ = quizQuestions[quizIdx];

  return (
    <div className="w-full space-y-4 max-w-xl mx-auto select-none animate-fade-in">
      {/* Top Game Focus Header for Quiz */}
      <div className="cinematic-floating-card rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
        <button
          id="btn-quiz-exit"
          onClick={() => setShowExitModal(true)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0 border border-white/20"
          title="Keluar dari kuis"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
            Kuis Kilat
          </span>
          <div className="text-xs font-black text-white mt-0.5">
            Soal {quizIdx + 1} <span className="text-white/60 font-semibold">/ {quizQuestions.length}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-white/70 block">Skor</span>
          <span className="text-xs sm:text-sm font-black text-white">{quizScore} Benar</span>
        </div>
      </div>

      {/* Quiz Active Gameplay or Result */}
      {!isQuizFinished && currentQ && (
        <div className="cinematic-content-card rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 text-center">
          <h3 className="text-base sm:text-lg font-black text-white leading-snug">
            {currentQ.question}
          </h3>

          {/* Visual Display or Audio Trigger */}
          <div className="my-3 py-5 rounded-2xl text-center bg-white/10 border border-white/15">
            {currentQ.audio ? (
              <button
                id="btn-quiz-audio-play"
                onClick={() => speakJapanese(currentQ.audio || '')}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Dengarkan Suara 🔊</span>
              </button>
            ) : (
              <span className="text-4xl sm:text-5xl font-black text-white font-japanese">
                {currentQ.display}
              </span>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedQuizOption === opt;
              let optStyle = 'bg-white/15 hover:bg-white/25 border-white/20 text-white';

              if (isQuizSubmitted) {
                if (opt === currentQ.correctAnswer) {
                  optStyle = 'bg-emerald-600/80 border-emerald-400 text-white font-black shadow-xs';
                } else if (isSelected && !isQuizCorrect) {
                  optStyle = 'bg-red-600/80 border-red-400 text-white font-black';
                } else {
                  optStyle = 'bg-white/5 border-white/5 text-white/40 opacity-50';
                }
              } else if (isSelected) {
                optStyle = 'bg-amber-500/40 border-amber-400 text-white font-black shadow-xs';
              }

              return (
                <button
                  key={idx}
                  id={`btn-quiz-opt-${idx}`}
                  onClick={() => handleSelectQuizOption(opt)}
                  disabled={isQuizSubmitted}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${optStyle}`}
                >
                  <span>{opt}</span>
                  {isQuizSubmitted && opt === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  )}
                  {isQuizSubmitted && isSelected && !isQuizCorrect && (
                    <XCircle className="w-4 h-4 text-red-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isQuizSubmitted && (
            <div
              className={`p-3 rounded-2xl border text-xs text-left ${
                isQuizCorrect
                  ? 'bg-emerald-950/40 border-emerald-400/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-400/40 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {isQuizCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                <span>{isQuizCorrect ? 'Benar Sekali! 🎉' : `Kurang tepat. Jawaban: ${currentQ.correctAnswer}`}</span>
              </div>
              <p className="mt-0.5 text-white/80">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action button */}
          {!isQuizSubmitted ? (
            <button
              id="btn-quiz-check"
              onClick={handleCheckQuizAnswer}
              disabled={!selectedQuizOption}
              className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all ${
                selectedQuizOption
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
              }`}
            >
              PERIKSA JAWABAN
            </button>
          ) : (
            <button
              id="btn-quiz-next"
              onClick={handleNextQuizQuestion}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
            >
              <span>{quizIdx === quizQuestions.length - 1 ? 'LIHAT HASIL AKHIR' : 'SOAL BERIKUTNYA →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Quiz Finished Screen */}
      {isQuizFinished && (
        <div className="cinematic-content-card rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/30">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-black bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
              Kuis Selesai
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              Skor Kamu: {quizScore} / {quizQuestions.length} Benar!
            </h2>
            <p className="text-xs text-white/70 font-medium mt-1">
              Bonus +30 XP telah ditambahkan ke akun belajarmu.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              id="btn-quiz-play-again"
              onClick={() => handleLaunchGame('quiz')}
              className="py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>

            <button
              id="btn-quiz-back-lobby"
              onClick={handleReturnToLobby}
              className="py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Lobi Latihan</span>
            </button>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl"
            style={{
              background: 'rgba(25, 25, 35, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Keluar dari kuis?
              </h3>
              <p className="text-xs text-white/70 mt-1 font-medium">
                Progress sesi ini tidak akan disimpan jika kamu keluar sekarang.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                id="btn-cancel-exit-quiz"
                onClick={() => setShowExitModal(false)}
                className="py-2.5 sm:py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs cursor-pointer border border-white/20"
              >
                Batalkan
              </button>
              <button
                id="btn-confirm-exit-quiz"
                onClick={handleReturnToLobby}
                className="py-2.5 sm:py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs cursor-pointer shadow-md shadow-red-600/30"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
