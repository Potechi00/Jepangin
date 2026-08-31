import React, { useState, useEffect, memo } from 'react';
import {
  Brain,
  Flame,
  Sparkles,
  Trophy,
  Play,
  ArrowRight,
  RotateCcw,
  Target,
  BarChart3,
  Lock,
  CheckCircle2,
  Shield,
  Volume2,
  VolumeX,
  FastForward,
  Award,
  Zap,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { KANA_GROUPS, KanaGroup, KanaItem, ALL_KANA_ITEMS } from '../../game/kanaData';
import {
  GameMode,
  BattleQuestion,
  BattleOption,
  KanaMemoryRecord,
  BattleSessionSummary,
  FocusBattleConfig,
  getMemoryTier,
} from '../../game/types';
import {
  GameProgressState,
} from '../../game/gameStorage';
import {
  updateKanaMemoryStrength,
  generateBattleSession,
  generateBossBattleSession,
  generateFocusBattle,
  buildQuestion,
} from '../../game/memoryEngine';
import { playSound, speakJapanese } from '../../utils/audio';
import { BattleHeader } from './BattleHeader';
import { BossBattleHeader } from './BossBattleHeader';
import { BattleQuestionCard } from './BattleQuestionCard';
import { MemoryPreviewModal } from './MemoryPreviewModal';
import { FocusBattleModal } from './FocusBattleModal';
import { BattleResultCard } from './BattleResultCard';
import { KanaStatusModal } from './KanaStatusModal';
import { useAuth } from '../../auth/authContext';

interface MemoryBattleViewProps {
  progress: UserProgress;
  onAddXp: (amount: number) => void;
  onBackToApp?: () => void;
  onFocusModeChange?: (isFocused: boolean) => void;
}

type BattleScreen = 'landing' | 'select_material' | 'preview' | 'playing' | 'result';

export const MemoryBattleView: React.FC<MemoryBattleViewProps> = memo(({
  progress,
  onAddXp,
  onBackToApp,
  onFocusModeChange,
}) => {
  const { kanaRecords, setKanaRecords, gameProgress, setGameProgress } = useAuth();

  // Navigation & Screen State
  const [screen, setScreen] = useState<BattleScreen>('landing');

  // Trigger fullscreen game mode during active battle sessions
  useEffect(() => {
    if (screen === 'preview' || screen === 'playing') {
      onFocusModeChange?.(true);
    } else {
      onFocusModeChange?.(false);
    }
    return () => {
      onFocusModeChange?.(false);
    };
  }, [screen, onFocusModeChange]);
  const [selectedGroup, setSelectedGroup] = useState<KanaGroup>(KANA_GROUPS[0]);
  const [selectedMode, setSelectedMode] = useState<GameMode>('battle');
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Session State
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<BattleOption | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionWrongCount, setSessionWrongCount] = useState(0);
  const [sessionEarnedXp, setSessionEarnedXp] = useState(0);
  const [testedKanaIds, setTestedKanaIds] = useState<Set<string>>(new Set());

  // Memory Recovery & Focus Battle States
  const [recoveryQueue, setRecoveryQueue] = useState<{ kana: KanaItem; triggerAtQuestion: number }[]>(
    []
  );
  const [wrongStreakPerKana, setWrongStreakPerKana] = useState<Record<string, number>>({});
  const [focusBattleConfig, setFocusBattleConfig] = useState<FocusBattleConfig | null>(null);

  // Boss Battle State
  const [bossHp, setBossHp] = useState(10);
  const [maxBossHp, setMaxBossHp] = useState(10);

  // Results State
  const [resultSummary, setResultSummary] = useState<BattleSessionSummary | null>(null);

  // Total Mastered Kana Count
  const allRecords = Object.values(kanaRecords) as KanaMemoryRecord[];
  const totalMastered = allRecords.filter((r) => r.strength >= 90).length;

  // Weak Kana across system
  const weakKanaList = allRecords.filter((r) => r.needsReview || (r.wrongCount > 0 && r.strength < 60));

  // --- ACTIONS ---

  const handleStartMaterialSelection = () => {
    if (soundEnabled) playSound('click');
    setScreen('select_material');
  };

  const handleSelectGroupForBattle = (group: KanaGroup, mode: GameMode = selectedMode) => {
    if (soundEnabled) playSound('click');
    setSelectedGroup(group);
    setSelectedMode(mode);

    // If mode is Boss, check HP
    if (mode === 'boss') {
      setBossHp(group.boss.hp);
      setMaxBossHp(group.boss.hp);
      startBattleSession(group, mode);
    } else {
      // Go to preview first
      setScreen('preview');
    }
  };

  const startBattleSession = (group: KanaGroup, mode: GameMode) => {
    let generated: BattleQuestion[] = [];

    if (mode === 'boss') {
      generated = generateBossBattleSession(group.items, kanaRecords);
    } else {
      generated = generateBattleSession(group.items, 10, kanaRecords);
    }

    setQuestions(generated);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCombo(0);
    setBestCombo(0);
    setHearts(mode === 'learn' ? 999 : 3);
    setSessionCorrectCount(0);
    setSessionWrongCount(0);
    setSessionEarnedXp(0);
    setTestedKanaIds(new Set());
    setRecoveryQueue([]);
    setWrongStreakPerKana({});
    setFocusBattleConfig(null);

    setScreen('playing');
  };

  const handleStartWeakKanaPractice = () => {
    if (soundEnabled) playSound('click');
    if (weakKanaList.length === 0) return;

    const weakItems = weakKanaList
      .map((w) => ALL_KANA_ITEMS.find((k) => k.id === w.kanaId))
      .filter((k): k is KanaItem => k !== undefined);

    const generated = generateBattleSession(weakItems, 10, kanaRecords);
    setQuestions(generated);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCombo(0);
    setBestCombo(0);
    setSelectedMode('learn');
    setHearts(999);
    setSessionCorrectCount(0);
    setSessionWrongCount(0);
    setSessionEarnedXp(0);
    setTestedKanaIds(new Set());
    setRecoveryQueue([]);
    setWrongStreakPerKana({});

    setScreen('playing');
  };

  // --- PLAYING INTERACTIONS ---

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (option: BattleOption) => {
    if (isAnswerSubmitted || !currentQ) return;

    if (soundEnabled) playSound('click');
    setSelectedOption(option);
    setIsAnswerSubmitted(true);

    const isCorrect = option.isCorrect;
    const target = currentQ.targetKana;

    // Track tested kana
    setTestedKanaIds((prev) => new Set(prev).add(target.id));

    // Update memory strength record
    const existingRec = kanaRecords[target.id] || {
      kanaId: target.id,
      kana: target.kana,
      romaji: target.romaji,
      type: target.type,
      strength: 0,
      correctCount: 0,
      wrongCount: 0,
      consecutiveCorrect: 0,
      lastReviewedAt: null,
      needsReview: false,
    };

    const updatedRec = updateKanaMemoryStrength(existingRec, isCorrect, currentQ.isRecoveryQuestion);
    setKanaRecords((prev) => ({ ...prev, [target.id]: updatedRec }));

    if (isCorrect) {
      if (soundEnabled) playSound('correct');

      // Calculate XP with Combo multiplier
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > bestCombo) setBestCombo(newCombo);

      let xpGain = 10;
      if (newCombo >= 10) xpGain = 30;
      else if (newCombo >= 5) xpGain = 20;
      else if (newCombo >= 3) xpGain = 15;

      setSessionCorrectCount((prev) => prev + 1);
      setSessionEarnedXp((prev) => prev + xpGain);

      // If Boss mode, reduce boss HP
      if (selectedMode === 'boss') {
        setBossHp((prev) => Math.max(0, prev - 1));
      }

      // Reset wrong streak for this Kana
      setWrongStreakPerKana((prev) => ({ ...prev, [target.id]: 0 }));
    } else {
      if (soundEnabled) playSound('wrong');

      // Reset combo
      setCombo(0);
      setSessionWrongCount((prev) => prev + 1);

      // Reduce hearts in Battle or Boss mode
      if (selectedMode !== 'learn') {
        setHearts((prev) => Math.max(0, prev - 1));
      }

      // Track wrong streak for this Kana
      const currentWrong = (wrongStreakPerKana[target.id] || 0) + 1;
      setWrongStreakPerKana((prev) => ({ ...prev, [target.id]: currentWrong }));

      // 1. Check if Focus Battle should be triggered (after 2 consecutive mistakes on this Kana)
      if (currentWrong >= 2 && selectedMode === 'battle') {
        const focusConf = generateFocusBattle(target, selectedGroup.items);
        if (focusConf) {
          setFocusBattleConfig(focusConf);
        }
      }

      // 2. Schedule for Delayed Memory Recovery Queue (appears 2-3 questions later)
      const scheduledIdx = currentQIndex + 3;
      setRecoveryQueue((prev) => [...prev, { kana: target, triggerAtQuestion: scheduledIdx }]);
    }
  };

  const handleContinueAfterAnswer = () => {
    if (soundEnabled) playSound('click');

    // Check if player died in challenge mode
    if (selectedMode !== 'learn' && hearts <= 0 && selectedMode !== 'boss') {
      finishBattle(false);
      return;
    }

    // Check if boss was defeated
    if (selectedMode === 'boss' && bossHp <= 1 && selectedOption?.isCorrect) {
      finishBattle(true);
      return;
    }

    // Check if we need to insert a recovery question into the session
    const pendingRecovery = recoveryQueue.find((r) => r.triggerAtQuestion <= currentQIndex + 1);
    let nextQuestions = [...questions];

    if (pendingRecovery) {
      // Remove from queue
      setRecoveryQueue((prev) => prev.filter((r) => r.kana.id !== pendingRecovery.kana.id));

      // Generate a reverse or recognition recovery question
      const recoveryQ = buildQuestion(pendingRecovery.kana, selectedGroup.items, 'reverse', true);

      // Insert into next spot
      nextQuestions.splice(currentQIndex + 1, 0, recoveryQ);
      setQuestions(nextQuestions);
    }

    // Advance question or finish
    if (currentQIndex < nextQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      finishBattle(selectedMode === 'boss' ? bossHp <= 0 : true);
    }
  };

  const finishBattle = (isVictorious: boolean) => {
    if (soundEnabled) playSound('complete');

    // Add XP to global progress
    onAddXp(sessionEarnedXp);

    // Calculate accuracy
    const total = sessionCorrectCount + sessionWrongCount;
    const accuracy = total > 0 ? Math.round((sessionCorrectCount / total) * 100) : 0;

    // Get tested records
    const testedRecords = Array.from(testedKanaIds)
      .map((id: string) => (kanaRecords as Record<string, KanaMemoryRecord>)[id])
      .filter((r): r is KanaMemoryRecord => r !== undefined);

    const weakIds = testedRecords.filter((r) => r.strength < 60 || r.needsReview).map((r) => r.kanaId);

    // Check if group is completed & if boss defeated
    let newCompleted = [...gameProgress.completedGroupIds];
    let newDefeated = [...gameProgress.defeatedBossIds];

    if (accuracy >= 70 && !newCompleted.includes(selectedGroup.id)) {
      newCompleted.push(selectedGroup.id);
    }

    if (selectedMode === 'boss' && isVictorious && !newDefeated.includes(selectedGroup.id)) {
      newDefeated.push(selectedGroup.id);
    }

    const updatedGameProg: GameProgressState = {
      ...gameProgress,
      completedGroupIds: newCompleted,
      defeatedBossIds: newDefeated,
      totalBattlesCount: gameProgress.totalBattlesCount + 1,
      bestEverCombo: Math.max(gameProgress.bestEverCombo, bestCombo),
      totalMasteredKana: totalMastered,
      lastBattleDate: new Date().toISOString(),
    };
    setGameProgress(updatedGameProg);

    // Prepare Result summary
    setResultSummary({
      groupId: selectedGroup.id,
      groupTitle: selectedGroup.name,
      mode: selectedMode,
      totalQuestions: total,
      correctAnswers: sessionCorrectCount,
      wrongAnswers: sessionWrongCount,
      accuracy,
      bestCombo,
      xpEarned: sessionEarnedXp,
      testedKanaRecords: testedRecords,
      weakKanaIds: weakIds,
      bossDefeated: selectedMode === 'boss' && isVictorious,
    });

    setScreen('result');
  };

  // --- RENDER SCREENS ---

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* SCREEN 1: LANDING PAGE */}
      {screen === 'landing' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Hero Banner */}
          <div className="cinematic-content-card rounded-3xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
            {/* Japanese Aesthetic Watermark */}
            <div className="absolute -top-6 -right-6 text-7xl font-black text-white/5 pointer-events-none select-none font-japanese">
              記憶
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30 mb-4 animate-pulse-glow">
              <Brain className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 font-extrabold text-xs px-3.5 py-1 rounded-full mb-2 border border-rose-400/30">
              <span>🧠 JEPANGIN — MEMORY BATTLE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Hafalkan. Ingat. Kuasai.
            </h1>

            <p className="text-white/80 text-xs sm:text-sm mt-2 max-w-md mx-auto font-medium">
              Latih ingatanmu dan kuasai Hiragana serta Katakana melalui pertarungan memori pintar tanpa perlu berulang kali mencatat di buku.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 my-5">
              <div className="bg-amber-500/15 border border-amber-400/25 rounded-2xl p-2.5 sm:p-3 text-center">
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 block uppercase">Streak</span>
                <span className="text-base sm:text-lg font-black text-amber-100 flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{progress.currentStreak} Hari</span>
                </span>
              </div>

              <div className="bg-rose-500/15 border border-rose-400/25 rounded-2xl p-2.5 sm:p-3 text-center">
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-300 block uppercase">Total XP</span>
                <span className="text-base sm:text-lg font-black text-rose-100 flex items-center justify-center gap-1 mt-0.5">
                  <Sparkles className="w-4 h-4 fill-rose-400 text-rose-400" />
                  <span>{progress.totalXp} XP</span>
                </span>
              </div>

              <div className="bg-indigo-500/15 border border-indigo-400/25 rounded-2xl p-2.5 sm:p-3 text-center">
                <span className="text-[10px] sm:text-[11px] font-bold text-indigo-300 block uppercase">Dikuasai</span>
                <span className="text-base sm:text-lg font-black text-indigo-100 flex items-center justify-center gap-1 mt-0.5">
                  <Trophy className="w-4 h-4 text-indigo-400" />
                  <span>{totalMastered} Huruf</span>
                </span>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="text-left space-y-2 mb-5">
              <span className="text-xs font-black uppercase tracking-wider text-white/70 block">
                Pilih Mode Bermain:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="btn-mode-learn"
                  onClick={() => setSelectedMode('learn')}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedMode === 'learn'
                      ? 'bg-emerald-950/50 border-emerald-400 text-emerald-200 font-black shadow-xs'
                      : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span className="text-lg block">🌱</span>
                  <span className="text-xs font-black block mt-0.5">Mode Santai</span>
                  <span className="text-[10px] text-white/60 block">Tanpa kalah</span>
                </button>

                <button
                  id="btn-mode-battle"
                  onClick={() => setSelectedMode('battle')}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedMode === 'battle'
                      ? 'bg-rose-950/50 border-rose-400 text-rose-200 font-black shadow-xs'
                      : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span className="text-lg block">⚔️</span>
                  <span className="text-xs font-black block mt-0.5">Memory Battle</span>
                  <span className="text-[10px] text-white/60 block">Combo & 3 HP</span>
                </button>

                <button
                  id="btn-mode-boss"
                  onClick={() => setSelectedMode('boss')}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedMode === 'boss'
                      ? 'bg-purple-950/50 border-purple-400 text-purple-200 font-black shadow-xs'
                      : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span className="text-lg block">👹</span>
                  <span className="text-xs font-black block mt-0.5">Boss Battle</span>
                  <span className="text-[10px] text-white/60 block">Uji kelulusan</span>
                </button>
              </div>
            </div>

            {/* BIG PRIMARY BUTTON */}
            <button
              id="btn-start-memory-battle-main"
              onClick={handleStartMaterialSelection}
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>MULAI BATTLE</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              id="btn-open-kana-status-map"
              onClick={() => setShowStatusModal(true)}
              className="cinematic-floating-card hover:bg-white/25 p-4 rounded-2xl flex items-center gap-3 text-left transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-400/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-white text-sm">
                  Statistik & Peta Kekuatan Kana
                </h4>
                <p className="text-xs text-white/70">Lihat skor daya ingat per huruf</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/60" />
            </button>

            {weakKanaList.length > 0 && (
              <button
                id="btn-practice-weak-landing"
                onClick={handleStartWeakKanaPractice}
                className="cinematic-floating-card hover:bg-amber-950/30 p-4 rounded-2xl flex items-center gap-3 text-left transition-all cursor-pointer border-amber-400/30"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-amber-200 text-sm">
                    Latih Huruf Lemah ({weakKanaList.length})
                  </h4>
                  <p className="text-xs text-amber-300/80">Uji ulang huruf yang sering lupa</p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 2: SELECT BATTLE MATERIAL */}
      {screen === 'select_material' && (
        <div className="space-y-5 max-w-2xl mx-auto">
          {/* Header */}
          <div className="cinematic-content-card rounded-3xl p-5 sm:p-7 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <button
                id="btn-back-to-landing"
                onClick={() => setScreen('landing')}
                className="text-white/80 hover:text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-1 cursor-pointer"
              >
                ← Kembali ke Beranda Game
              </button>

              <span className="text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-400/30">
                Mode: {selectedMode.toUpperCase()}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white">
              Pilih Kelompok Huruf
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1">
              Mulai dari huruf Vokal A-I-U-E-O hingga menguasai seluruh baris konsonan.
            </p>

            {/* Tab switch: Hiragana vs Katakana */}
            <div className="flex bg-white/10 p-1 rounded-2xl mt-4 border border-white/15">
              <button
                id="btn-tab-hira"
                onClick={() => setActiveTab('hiragana')}
                className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'hiragana'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                🌸 Hiragana
              </button>
              <button
                id="btn-tab-kata"
                onClick={() => setActiveTab('katakana')}
                className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'katakana'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                ⚡ Katakana
              </button>
            </div>
          </div>

          {/* Group List Cards */}
          <div className="space-y-3.5">
            {KANA_GROUPS.filter((g) => g.type === activeTab).map((group, idx) => {
              // Group 1 is unlocked by default; others unlocked when previous group is completed
              const prevGroup = KANA_GROUPS.find((g) => g.type === activeTab && g.order === group.order - 1);
              const isUnlocked =
                group.order === 1 ||
                (group.type === 'katakana' && group.order === 6) ||
                (prevGroup && gameProgress.completedGroupIds.includes(prevGroup.id));

              const isCompleted = gameProgress.completedGroupIds.includes(group.id);
              const isBossDefeated = gameProgress.defeatedBossIds.includes(group.id);

              // Calculate group mastery percentage
              const groupStrengths = group.items.map((i) => kanaRecords[i.id]?.strength || 0);
              const avgStrength = Math.round(
                groupStrengths.reduce((a, b) => a + b, 0) / groupStrengths.length
              );

              return (
                <div
                  key={group.id}
                  className={`cinematic-content-card rounded-3xl p-5 sm:p-6 transition-all ${
                    isUnlocked
                      ? 'shadow-lg hover:border-white/30'
                      : 'opacity-50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-400/30">
                          {group.name}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] sm:text-xs font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-400/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Selesai</span>
                          </span>
                        )}
                        {isBossDefeated && (
                          <span className="text-[10px] sm:text-xs font-extrabold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-400/30">
                            👑 Bos Kalah
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl font-black font-japanese text-white tracking-wide">
                          {group.title}
                        </span>
                      </div>

                      <p className="text-xs text-white/75 font-medium">
                        {group.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="w-32 sm:w-36 bg-white/10 rounded-full h-1.5 overflow-hidden border border-white/15">
                          <div
                            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all"
                            style={{ width: `${avgStrength}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-white/70">
                          {avgStrength}% Hafal
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      {isUnlocked ? (
                        <>
                          <button
                            id={`btn-play-group-${group.id}`}
                            onClick={() => handleSelectGroupForBattle(group, selectedMode)}
                            className="flex-1 sm:flex-initial px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>MULAI BATTLE</span>
                          </button>

                          {/* Boss Challenge Shortcut */}
                          <button
                            id={`btn-boss-group-${group.id}`}
                            onClick={() => handleSelectGroupForBattle(group, 'boss')}
                            className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors border border-purple-400/30"
                            title="Tantang Bos Ujian Hafalan"
                          >
                            <span>👹 Bos Memori</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/10 px-3 py-2 rounded-xl border border-white/15">
                          <Lock className="w-4 h-4" />
                          <span>Selesaikan kelompok sebelumnya</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SCREEN 3: MEMORY PREVIEW */}
      {screen === 'preview' && (
        <MemoryPreviewModal
          group={selectedGroup}
          onStartBattle={() => startBattleSession(selectedGroup, selectedMode)}
        />
      )}

      {/* SCREEN 4: ACTIVE PLAYING / BATTLE */}
      {screen === 'playing' && currentQ && (
        <div className="space-y-4">
          {/* Header */}
          <BattleHeader
            mode={selectedMode}
            currentIdx={currentQIndex}
            totalQuestions={questions.length}
            combo={combo}
            hearts={hearts}
            maxHearts={3}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            onExit={() => setScreen('landing')}
          />

          {/* Boss Header if in Boss mode */}
          {selectedMode === 'boss' && (
            <BossBattleHeader
              group={selectedGroup}
              bossHp={bossHp}
              maxHp={maxBossHp}
            />
          )}

          {/* Active Question Card */}
          <BattleQuestionCard
            question={currentQ}
            selectedOption={selectedOption}
            isSubmitted={isAnswerSubmitted}
            onSelectOption={handleSelectOption}
            onContinue={handleContinueAfterAnswer}
            comboCount={combo}
          />

          {/* Focus Battle Modal popup when triggered */}
          {focusBattleConfig && (
            <FocusBattleModal
              config={focusBattleConfig}
              onCompleteFocus={() => setFocusBattleConfig(null)}
            />
          )}
        </div>
      )}

      {/* SCREEN 5: BATTLE RESULTS */}
      {screen === 'result' && resultSummary && (
        <BattleResultCard
          summary={resultSummary}
          group={selectedGroup}
          onContinue={() => setScreen('select_material')}
          onPracticeWeak={handleStartWeakKanaPractice}
          onReplay={() => startBattleSession(selectedGroup, selectedMode)}
        />
      )}

      {/* MODAL: KANA STRENGTH MAP MODAL */}
      {showStatusModal && (
        <KanaStatusModal
          records={kanaRecords}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
});
