import { useEffect, useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { ScoreBoard } from '../components/ScoreBoard';
import { AnswerBoard } from '../components/AnswerBoard';
import { Popup } from '../components/Popup';
import { Wheel } from '../components/Wheel';
import { ControlPanel } from '../components/ControlPanel';
import { StudioBackground } from '../components/StudioBackground';
import { GameOverBoard } from '../components/GameOverBoard';
import { PhaseCompleteBanner } from '../components/PhaseCompleteBanner';
import { socket } from '../socket';
import { SOCKET_EVENTS } from '../types';

export function AdminPage() {
  const state = useGameState();
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const [wheelSize, setWheelSize] = useState(440);

  // Wheel auto-sizes to fill whatever space is left below the word board.
  useEffect(() => {
    if (!wheelContainerRef.current) return;
    const el = wheelContainerRef.current;
    const updateSize = () => {
      const { clientWidth, clientHeight } = el;
      const availableH = Math.max(260, clientHeight - 110);
      const availableW = Math.max(260, clientWidth - 30);
      const optimal = Math.min(availableH, availableW);
      setWheelSize(Math.round(Math.min(Math.max(optimal, 320), 560)));
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl bg-[#030712] text-slate-100">
        Đang kết nối server...
      </div>
    );
  }

  const activeTeam = state.teams.find((t) => t.id === state.activeTeamId);
  const eliminatedTeamIds = Object.entries(state.enterUsedByTeam)
    .filter(([, used]) => used)
    .map(([id]) => Number(id));
  const activeTeamEliminated = state.activeTeamId != null && eliminatedTeamIds.includes(state.activeTeamId);
  const spinDisabled = state.phase !== 'ready' || state.wheelSpinning || !state.activeTeamId || activeTeamEliminated;

  return (
    <div className="relative h-screen max-h-screen overflow-hidden bg-[#030712] text-slate-100 flex flex-col font-sans">
      <StudioBackground />
      <Popup popup={state.popup} />
      {state.phase === 'game-over' && (
        <GameOverBoard teams={state.teams} onRestart={() => socket.emit(SOCKET_EVENTS.ADMIN_RESTART_GAME)} />
      )}

      {state.phase === 'phase-complete' && (
        <PhaseCompleteBanner
          onContinue={() => socket.emit(SOCKET_EVENTS.ADMIN_START_NEXT_PHASE)}
          hasPhase2Questions={state.questions.some((q) => q.phase === 2)}
        />
      )}

      <main className="relative z-10 flex-1 min-h-0 w-full p-2 sm:p-2.5 xl:p-3.5 2xl:p-4 flex flex-row gap-2.5 sm:gap-3 xl:gap-4 items-stretch overflow-hidden">
        {/* Left: score board */}
        <section className="w-44 md:w-52 lg:w-56 xl:w-64 2xl:w-72 shrink-0 h-full overflow-hidden flex flex-col">
          <ScoreBoard
            teams={state.teams}
            activeTeamId={state.activeTeamId}
            onSelectTeam={(teamId) => socket.emit(SOCKET_EVENTS.ADMIN_SELECT_TEAM, { teamId })}
            eliminatedTeamIds={eliminatedTeamIds}
          />
        </section>

        {/* Center: word board + wheel */}
        <section className="flex-1 min-w-0 h-full flex flex-col items-center justify-between overflow-hidden gap-2 xl:gap-3 py-0.5">
          <div className="w-full shrink-0 flex justify-center">
            <AnswerBoard
              layout={state.answerLayout}
              structureRevealed={state.structureRevealed}
              revealedChars={state.revealedChars}
              question={state.currentQuestion.question}
              displayAnswer={state.currentQuestion.displayAnswer}
            />
          </div>

          <div ref={wheelContainerRef} className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
            <Wheel
              segments={state.wheelSegments}
              spinning={state.wheelSpinning}
              resultSegmentId={state.wheelResultSegmentId}
              onSpin={() => socket.emit(SOCKET_EVENTS.ADMIN_SPIN)}
              spinDisabled={spinDisabled}
              activeTeamName={activeTeam?.name ?? '—'}
              wheelSize={wheelSize}
            />
          </div>
        </section>

        {/* Right: control panel */}
        <section className="w-72 lg:w-80 xl:w-88 2xl:w-96 shrink-0 h-full overflow-y-auto pr-0.5">
          <ControlPanel state={state} />
        </section>
      </main>
    </div>
  );
}
