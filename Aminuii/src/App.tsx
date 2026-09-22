import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Scoreboard } from './components/Scoreboard';
import { WordBoard } from './components/WordBoard';
import { Wheel } from './components/Wheel';
import { ControlPanel } from './components/ControlPanel';
import { SpinResultModal } from './components/SpinResultModal';
import { SolvePuzzleModal } from './components/SolvePuzzleModal';
import { QuestionManagerModal } from './components/QuestionManagerModal';
import { WheelCustomizerModal } from './components/WheelCustomizerModal';
import { RulesModal } from './components/RulesModal';
import { StudioBackground } from './components/StudioBackground';
import { Team, Question, WheelSegment } from './types';
import { DEFAULT_QUESTIONS } from './data/defaultQuestions';
import { DEFAULT_WHEEL_SEGMENTS, INITIAL_TEAMS } from './data/defaultWheel';
import { sound } from './utils/audio';
import { charMatchesGuess } from './utils/vietnamese';

export default function App() {
  // Game questions
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('cnkd_questions');
    return saved ? JSON.parse(saved) : DEFAULT_QUESTIONS;
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Teams
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('cnkd_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });
  const [activeTeamId, setActiveTeamId] = useState<string>(() => teams[0]?.id || 'team-1');

  // Wheel segments
  const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>(() => {
    const saved = localStorage.getItem('cnkd_wheel');
    return saved ? JSON.parse(saved) : DEFAULT_WHEEL_SEGMENTS;
  });

  // Game round state
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [revealedAll, setRevealedAll] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinResult, setCurrentSpinResult] = useState<WheelSegment | null>(null);
  const [isSpinResultModalOpen, setIsSpinResultModalOpen] = useState(false);
  const [exactVowels, setExactVowels] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState(false);

  // Dynamic responsive wheel sizing based on container height/width
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const [wheelSize, setWheelSize] = useState<number>(440);

  useEffect(() => {
    if (!wheelContainerRef.current) return;
    const updateSize = () => {
      if (!wheelContainerRef.current) return;
      const { clientWidth, clientHeight } = wheelContainerRef.current;
      // Reserve overhead for top badge + bottom spin button & controls (~120px)
      const availableH = Math.max(260, clientHeight - 110);
      const availableW = Math.max(260, clientWidth - 30);
      const optimal = Math.min(availableH, availableW);
      // Clamp between 320px and 560px for perfect proportions on HD, 2K, 4K
      const finalSize = Math.min(Math.max(optimal, 320), 560);
      setWheelSize(Math.round(finalSize));
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(wheelContainerRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Modals
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const [isQuestionManagerOpen, setIsQuestionManagerOpen] = useState(false);
  const [isWheelManagerOpen, setIsWheelManagerOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Active question and team
  const currentQuestion = questions[currentQuestionIndex] || DEFAULT_QUESTIONS[0];
  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('cnkd_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('cnkd_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('cnkd_wheel', JSON.stringify(wheelSegments));
  }, [wheelSegments]);

  // Turn switching
  const nextTurn = useCallback(() => {
    setTeams((prevTeams) => {
      const currentIndex = prevTeams.findIndex((t) => t.id === activeTeamId);
      const nextIndex = (currentIndex + 1) % prevTeams.length;
      setActiveTeamId(prevTeams[nextIndex].id);
      return prevTeams;
    });
    setCurrentSpinResult(null);
  }, [activeTeamId]);

  // Handle Wheel Spin
  const handleSpinStart = () => {
    setIsSpinning(true);
    setCurrentSpinResult(null);
  };

  const handleSpinEnd = (result: WheelSegment) => {
    setIsSpinning(false);
    setCurrentSpinResult(result);
    setIsSpinResultModalOpen(true);

    // If Direct point penalty: deduct immediately without needing to guess!
    if (result.value < 0) {
      sound.playWrong();
      setTeams((prev) =>
        prev.map((t) =>
          t.id === activeTeamId ? { ...t, score: t.score + result.value } : t
        )
      );
    } else if (result.specialAction === 'LOSE_TURN') {
      sound.playLoseTurn();
    } else {
      sound.playStopChime();
    }
  };

  const handleCloseSpinModal = () => {
    setIsSpinResultModalOpen(false);
    // If penalty point deduction or lost turn, immediately move to next team
    if (currentSpinResult && (currentSpinResult.value < 0 || currentSpinResult.specialAction === 'LOSE_TURN')) {
      nextTurn();
    }
  };

  // Guessing a letter
  const handleGuessLetter = (letter: string) => {
    const upperLetter = letter.toUpperCase();
    if (guessedLetters.has(upperLetter)) {
      alert(`Chữ cái '${upperLetter}' đã được kiểm tra trước đó!`);
      return;
    }

    if (!currentSpinResult || currentSpinResult.value <= 0) {
      alert('Vui lòng quay nón để lấy điểm số trước khi Check chữ cái!');
      return;
    }

    // Add letter to guessed set
    const updatedGuessed = new Set(guessedLetters);
    updatedGuessed.add(upperLetter);
    setGuessedLetters(updatedGuessed);

    // Count occurrences in puzzle answer
    const answerChars = currentQuestion.answer.replace(/\s+/g, '').split('');
    let matchCount = 0;
    for (const char of answerChars) {
      if (charMatchesGuess(char, upperLetter, exactVowels)) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      sound.playCorrectLetter();

      // Award points: wheel value * matchCount (1 letter x1, 2 letters x2, etc.)
      const awardedPoints = currentSpinResult.value * matchCount;

      setTeams((prev) =>
        prev.map((t) =>
          t.id === activeTeamId ? { ...t, score: t.score + awardedPoints } : t
        )
      );

      // Reset spin result so team can spin again for next letter
      setCurrentSpinResult(null);

      // Check if whole puzzle is now revealed
      const allFound = answerChars.every((char) =>
        Array.from(updatedGuessed).some((g) => charMatchesGuess(char, g, exactVowels))
      );

      if (allFound) {
        sound.playVictory();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    } else {
      // Wrong letter -> Lose turn immediately!
      sound.playWrong();
      alert(`Rất tiếc! Chữ '${upperLetter}' không có trong câu đố. ${activeTeam.name} bị mất lượt!`);
      setCurrentSpinResult(null);
      nextTurn();
    }
  };

  // Direct manual tile uncover from host
  const handleTileClick = (char: string) => {
    handleGuessLetter(char);
  };

  // Reveal all letters
  const handleRevealAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn mở toàn bộ đáp án của câu hỏi này?')) {
      setRevealedAll(true);
      sound.playVictory();
    }
  };

  // Next question
  const handleNextQuestion = () => {
    const nextIdx = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIdx);
    setGuessedLetters(new Set());
    setRevealedAll(false);
    setCurrentSpinResult(null);
  };

  // Reset entire game session
  const handleResetGame = () => {
    if (window.confirm('Đặt lại điểm số các đội và bắt đầu lại ván chơi mới?')) {
      setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
      setGuessedLetters(new Set());
      setRevealedAll(false);
      setCurrentSpinResult(null);
      setCurrentQuestionIndex(0);
      setActiveTeamId(teams[0]?.id || 'team-1');
    }
  };

  // Team score manual adjust
  const handleUpdateTeamScore = (teamId: string, delta: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: t.score + delta } : t))
    );
  };

  // Team rename
  const handleUpdateTeamName = (teamId: string, newName: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, name: newName } : t))
    );
  };

  // Add team
  const handleAddTeam = () => {
    if (teams.length >= 6) return;
    const colors = ['#06b6d4', '#ec4899', '#84cc16', '#6366f1'];
    const newIdx = teams.length + 1;
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: `Đội ${newIdx}`,
      score: 0,
      color: colors[(newIdx - 1) % colors.length],
      avatarBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    };
    setTeams([...teams, newTeam]);
  };

  // Remove team
  const handleRemoveTeam = (teamId: string) => {
    if (teams.length <= 2) return;
    const updated = teams.filter((t) => t.id !== teamId);
    setTeams(updated);
    if (activeTeamId === teamId) {
      setActiveTeamId(updated[0].id);
    }
  };

  // Challenge score apply
  const handleApplyChallengeScore = (points: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === activeTeamId ? { ...t, score: t.score + points } : t))
    );
    setCurrentSpinResult(null);
  };

  // Audio mute toggle
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.isMuted = next;
  };

  return (
    <div className="relative h-screen max-h-screen overflow-hidden bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Dynamic Television Game Show Studio Background */}
      <StudioBackground />

      {/* Main Game Stage Layout - 1 Screen No Window Scroll */}
      <main className="relative z-10 flex-1 min-h-0 w-full p-2 sm:p-2.5 xl:p-3.5 2xl:p-4 flex flex-row gap-2.5 sm:gap-3 xl:gap-4 items-stretch overflow-hidden">
        {/* Left Column: Scoreboard (Well-proportioned width, does not scroll with center) */}
        <section className="w-44 md:w-52 lg:w-56 xl:w-64 2xl:w-72 shrink-0 h-full overflow-hidden flex flex-col">
          <Scoreboard
            teams={teams}
            activeTeamId={activeTeamId}
            onSelectActiveTeam={(id) => setActiveTeamId(id)}
            onUpdateTeamScore={handleUpdateTeamScore}
            onUpdateTeamName={handleUpdateTeamName}
            onAddTeam={handleAddTeam}
            onRemoveTeam={handleRemoveTeam}
          />
        </section>

        {/* Center Column: Word Board & Wheel (Balanced & Sized to fill 1 screen without scrolling) */}
        <section className="flex-1 min-w-0 h-full flex flex-col items-center justify-between overflow-hidden gap-2 xl:gap-3 py-0.5">
          {/* Top Word Puzzle Board (3 rows, 44 boxes total) */}
          <div className="w-full shrink-0 flex justify-center">
            <WordBoard
              question={currentQuestion}
              guessedLetters={guessedLetters}
              revealedAll={revealedAll}
              onTileClick={handleTileClick}
              exactVowels={exactVowels}
            />
          </div>

          {/* Bottom Interactive Wheel (Dynamically sized to fill remaining height/width) */}
          <div
            ref={wheelContainerRef}
            className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden"
          >
            <Wheel
              segments={wheelSegments}
              isSpinning={isSpinning}
              onSpinStart={handleSpinStart}
              onSpinEnd={handleSpinEnd}
              activeTeamName={activeTeam.name}
              wheelSize={wheelSize}
            />
          </div>
        </section>

        {/* Right Column: Control Panel with Integrated Game Toolbar */}
        <section className="w-72 lg:w-80 xl:w-88 2xl:w-96 shrink-0 h-full overflow-y-auto pr-0.5">
          <ControlPanel
            activeTeam={activeTeam}
            currentSpinResult={currentSpinResult}
            guessedLetters={guessedLetters}
            puzzleAnswer={currentQuestion.answer}
            onGuessLetter={handleGuessLetter}
            onOpenSolveModal={() => setIsSolveModalOpen(true)}
            onRevealAll={handleRevealAll}
            onNextQuestion={handleNextQuestion}
            onNextTurn={nextTurn}
            onApplyChallengeScore={handleApplyChallengeScore}
            exactVowels={exactVowels}
            onToggleExactVowels={() => setExactVowels(!exactVowels)}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            isMuted={isMuted}
            onToggleSound={toggleSound}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
            onOpenWheelManager={() => setIsWheelManagerOpen(true)}
            onResetGame={handleResetGame}
          />
        </section>
      </main>

      {/* Modals */}
      <SpinResultModal
        isOpen={isSpinResultModalOpen}
        onClose={handleCloseSpinModal}
        result={currentSpinResult}
        activeTeamName={activeTeam.name}
      />
      <SolvePuzzleModal
        isOpen={isSolveModalOpen}
        onClose={() => setIsSolveModalOpen(false)}
        correctAnswer={currentQuestion.answer}
        activeTeamName={activeTeam.name}
        onSuccess={(bonus) => {
          setTeams((prev) =>
            prev.map((t) => (t.id === activeTeamId ? { ...t, score: t.score + bonus } : t))
          );
          setRevealedAll(true);
        }}
        onFailure={() => {
          nextTurn();
        }}
      />

      <QuestionManagerModal
        isOpen={isQuestionManagerOpen}
        onClose={() => setIsQuestionManagerOpen(false)}
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        onSelectQuestion={(idx) => {
          setCurrentQuestionIndex(idx);
          setGuessedLetters(new Set());
          setRevealedAll(false);
          setCurrentSpinResult(null);
          setIsQuestionManagerOpen(false);
        }}
        onAddQuestion={(newQ) => setQuestions((prev) => [...prev, newQ])}
        onDeleteQuestion={(id) => {
          setQuestions((prev) => prev.filter((q) => q.id !== id));
        }}
        onResetQuestions={() => {
          setQuestions(DEFAULT_QUESTIONS);
          setCurrentQuestionIndex(0);
          setGuessedLetters(new Set());
          setRevealedAll(false);
        }}
      />

      <WheelCustomizerModal
        isOpen={isWheelManagerOpen}
        onClose={() => setIsWheelManagerOpen(false)}
        segments={wheelSegments}
        onSaveSegments={(newSegs) => setWheelSegments(newSegs)}
        onResetSegments={() => setWheelSegments(DEFAULT_WHEEL_SEGMENTS)}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
