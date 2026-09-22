import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { MysteryBoard } from './components/MysteryBoard';
import { BottomBar } from './components/BottomBar';
import { StageBackground } from './components/StageBackground';
import { WheelModal, WheelResult } from './components/WheelModal';
import { LetterKeyboard } from './components/LetterKeyboard';
import { SolveModal } from './components/SolveModal';
import { HostControls } from './components/HostControls';
import { INITIAL_QUESTIONS, isLetterMatch, normalizeVietnamese } from './data/questions';
import { soundManager } from './utils/audio';
import { Team, QuestionData } from './types';

const INITIAL_TEAMS: Team[] = [
  { id: 1, name: 'Đội 1', score: 1000, isCurrentTurn: false, isUserTeam: false },
  { id: 2, name: 'Đội 2', score: 500, isCurrentTurn: true, isUserTeam: true },
  { id: 3, name: 'Đội 3', score: 800, isCurrentTurn: false, isUserTeam: false },
  { id: 4, name: 'Đội 4', score: 1200, isCurrentTurn: false, isUserTeam: false },
  { id: 5, name: 'Đội 5', score: 300, isCurrentTurn: false, isUserTeam: false },
];

export default function App() {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [questions, setQuestions] = useState<QuestionData[]>(INITIAL_QUESTIONS);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(INITIAL_QUESTIONS[0].id);

  // Modals state
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isSolveOpen, setIsSolveOpen] = useState(false);
  const [isHostOpen, setIsHostOpen] = useState(false);

  // Game state
  const [pointsAtStake, setPointsAtStake] = useState<number>(500);
  const [revealedAll, setRevealedAll] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentQuestion = questions.find(q => q.id === currentQuestionId) || questions[0];
  const currentTeam = teams.find(t => t.isCurrentTurn) || teams[1];

  // Helper to switch to next team (turns on the light for the next team)
  const nextTeamTurn = useCallback(() => {
    setTeams(prev => {
      const activeIdx = prev.findIndex(t => t.isCurrentTurn);
      const nextIdx = (activeIdx + 1) % prev.length;
      return prev.map((t, idx) => ({
        ...t,
        isCurrentTurn: idx === nextIdx,
        isUserTeam: idx === nextIdx,
      }));
    });
  }, []);

  const handleSelectTeamTurn = (teamId: number) => {
    soundManager.playButtonPress();
    setTeams(prev =>
      prev.map(t => ({
        ...t,
        isCurrentTurn: t.id === teamId,
        isUserTeam: t.id === teamId,
      }))
    );
  };

  // 1. Wheel Spin Finished
  const handleSpinComplete = (result: WheelResult) => {
    setIsWheelOpen(false);

    if (result.type === 'lose_turn') {
      soundManager.playBuzzer();
      nextTeamTurn();
    } else if (result.type === 'double') {
      setTeams(prev =>
        prev.map(t =>
          t.id === currentTeam.id ? { ...t, score: t.score * 2 } : t
        )
      );
      soundManager.playCorrectAnswer();
      setPointsAtStake(500);
      setIsKeyboardOpen(true);
    } else if (result.type === 'half') {
      setTeams(prev =>
        prev.map(t =>
          t.id === currentTeam.id ? { ...t, score: Math.floor(t.score / 2) } : t
        )
      );
      setPointsAtStake(300);
      setIsKeyboardOpen(true);
    } else {
      // Points
      setPointsAtStake(result.value);
      setIsKeyboardOpen(true);
    }
  };

  // 2. Guessing a Letter
  const handleGuessLetter = (letter: string) => {
    soundManager.playButtonPress();

    // Check if letter was already guessed
    if (currentQuestion.revealedLetters.includes(letter)) {
      return;
    }

    // Count occurrences in the puzzle
    let matchCount = 0;
    for (const row of currentQuestion.rows) {
      for (const cell of row) {
        if (cell && isLetterMatch(cell, letter)) {
          matchCount++;
        }
      }
    }

    // Add letter to revealed list
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === currentQuestion.id) {
          return {
            ...q,
            revealedLetters: [...q.revealedLetters, letter],
          };
        }
        return q;
      })
    );

    setIsKeyboardOpen(false);

    if (matchCount > 0) {
      const addedPoints = matchCount * pointsAtStake;
      soundManager.playCorrectAnswer();

      // Trigger wave of tile chime sounds
      for (let i = 0; i < matchCount; i++) {
        setTimeout(() => {
          soundManager.playTileReveal(1 + i * 0.15);
        }, i * 250);
      }

      setTeams(prev =>
        prev.map(t =>
          t.id === currentTeam.id
            ? { ...t, score: t.score + addedPoints }
            : t
        )
      );
    } else {
      soundManager.playBuzzer();
      nextTeamTurn();
    }
  };

  // 3. Solving Full Answer
  const handleSolveSubmit = (submittedAnswer: string) => {
    setIsSolveOpen(false);
    const target = normalizeVietnamese(currentQuestion.answer);
    const userGuess = normalizeVietnamese(submittedAnswer);

    if (userGuess === target) {
      // VICTORY!
      soundManager.playCorrectAnswer();
      setRevealedAll(true);

      // Award 2000 points
      setTeams(prev =>
        prev.map(t =>
          t.id === currentTeam.id ? { ...t, score: t.score + 2000 } : t
        )
      );

      // Fire confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#38bdf8', '#ffffff', '#ec4899'],
        });
      } catch {
        // Confetti fallback
      }
    } else {
      soundManager.playBuzzer();
      nextTeamTurn();
    }
  };

  // 4. Keyboard Shortcuts: Space for spin, Enter for solve
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isWheelOpen && !isKeyboardOpen && !isSolveOpen && !isHostOpen) {
          soundManager.playButtonPress();
          setIsWheelOpen(true);
        }
      } else if (e.code === 'Enter') {
        e.preventDefault();
        if (!isWheelOpen && !isKeyboardOpen && !isSolveOpen && !isHostOpen) {
          soundManager.playButtonPress();
          setIsSolveOpen(true);
        }
      } else if (/^[a-zA-Z]$/.test(e.key) && isKeyboardOpen) {
        handleGuessLetter(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWheelOpen, isKeyboardOpen, isSolveOpen, isHostOpen, currentTeam, pointsAtStake]);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.enabled = nextVal;
  };

  const handleTileClick = (char: string) => {
    if (!currentQuestion.revealedLetters.includes(char)) {
      handleGuessLetter(char);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden select-none">
      {/* Dynamic Stage Lighting Background */}
      <StageBackground />

      {/* Top Header matching Image 2 */}
      <Header
        teams={teams}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHostControls={() => setIsHostOpen(true)}
        onSelectTeamTurn={handleSelectTeamTurn}
      />

      {/* Central Mystery Board (Question card matching Image 2, Mystery grid matching Image 1!) */}
      <main className="flex-1 flex items-center justify-center my-auto py-2">
        <MysteryBoard
          questionData={currentQuestion}
          revealedAll={revealedAll}
          onTileClick={handleTileClick}
        />
      </main>

      {/* Bottom Control Bar matching Image 2 */}
      <BottomBar
        isUserTurn={currentTeam.isUserTeam}
        onSpinClick={() => {
          soundManager.playButtonPress();
          setIsWheelOpen(true);
        }}
        onSolveClick={() => {
          soundManager.playButtonPress();
          setIsSolveOpen(true);
        }}
      />

      {/* Modals */}
      <WheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        onSpinComplete={handleSpinComplete}
        currentTeamName={currentTeam.name}
      />

      <LetterKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onGuessLetter={handleGuessLetter}
        guessedLetters={currentQuestion.revealedLetters}
        pointsAtStake={pointsAtStake}
        currentTeamName={currentTeam.name}
      />

      <SolveModal
        isOpen={isSolveOpen}
        onClose={() => setIsSolveOpen(false)}
        onSubmitSolve={handleSolveSubmit}
        currentTeamName={currentTeam.name}
        questionText={currentQuestion.question}
      />

      <HostControls
        isOpen={isHostOpen}
        onClose={() => setIsHostOpen(false)}
        questions={questions}
        currentQuestionId={currentQuestion.id}
        onSelectQuestion={(qId) => {
          setCurrentQuestionId(qId);
          setRevealedAll(false);
        }}
        teams={teams}
        onSelectTeamTurn={handleSelectTeamTurn}
        onUpdateTeamScore={(teamId, delta) => {
          setTeams(prev =>
            prev.map(t =>
              t.id === teamId ? { ...t, score: Math.max(0, t.score + delta) } : t
            )
          );
        }}
        onRevealAllTiles={() => {
          setRevealedAll(true);
          soundManager.playCorrectAnswer();
        }}
        onResetQuestion={() => {
          setRevealedAll(false);
          setQuestions(prev =>
            prev.map(q =>
              q.id === currentQuestion.id ? { ...q, revealedLetters: [] } : q
            )
          );
        }}
        onAddCustomQuestion={(newQ) => {
          setQuestions(prev => [...prev, newQ]);
          setCurrentQuestionId(newQ.id);
          setRevealedAll(false);
        }}
      />
    </div>
  );
}
