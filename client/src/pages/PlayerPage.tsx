import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { AnswerBoard } from '../components/AnswerBoard';
import { Popup } from '../components/Popup';
import { PlayerHeader } from '../components/PlayerHeader';
import { PlayerBottomBar } from '../components/PlayerBottomBar';
import { PlayerStageBackground } from '../components/PlayerStageBackground';
import { GameOverBoard } from '../components/GameOverBoard';
import { PhaseCompleteBoard } from '../components/PhaseCompleteBoard';
import { socket } from '../socket';
import { SOCKET_EVENTS } from '../types';

export function PlayerPage() {
  const { teamId: teamIdParam } = useParams();
  const teamId = Number(teamIdParam);
  const state = useGameState();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't hijack Space/Enter while typing (e.g. renaming the team).
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        socket.emit(SOCKET_EVENTS.PLAYER_REQUEST_SPIN, { teamId });
      } else if (e.code === 'Enter') {
        e.preventDefault();
        socket.emit(SOCKET_EVENTS.PLAYER_REQUEST_SOLVE, { teamId });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [teamId]);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl bg-[#050b1a] text-slate-100">
        Đang kết nối server...
      </div>
    );
  }

  const isActive = state.activeTeamId === teamId;
  const enterUsed = !!state.enterUsedByTeam[teamId];
  const team = state.teams.find((t) => t.id === teamId);
  const spaceEnabled = isActive && state.phase === 'ready' && !enterUsed;
  const enterEnabled = !enterUsed && (state.phase === 'ready' || state.phase === 'showing-question') && !state.solvingTeamId;
  const spinHint =
    state.phase === 'guessing'
      ? isActive
        ? 'Đọc 1 chữ cái để MC kiểm tra điểm!'
        : 'Đang chờ MC kiểm tra chữ...'
      : undefined;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden select-none">
      <PlayerStageBackground />
      <Popup popup={state.popup} />
      {state.phase === 'phase-complete' && (
        <PhaseCompleteBoard teams={state.teams} hasPhase2Questions={state.questions.some((q) => q.phase === 2)} />
      )}
      {state.phase === 'game-over' && <GameOverBoard teams={state.teams} />}

      <PlayerHeader
        teams={state.teams}
        activeTeamId={state.activeTeamId}
        myTeamId={teamId}
        myTeamName={team?.name ?? `Team ${teamId}`}
        onRenameTeam={(name) => socket.emit(SOCKET_EVENTS.PLAYER_RENAME_TEAM, { teamId, name })}
      />

      <main className="flex-1 flex items-center justify-center my-auto py-2 px-4 z-10">
        <div className="w-full max-w-6xl">
          <AnswerBoard
            layout={state.answerLayout}
            structureRevealed={state.structureRevealed}
            revealedChars={state.revealedChars}
            question={state.currentQuestion.question}
            displayAnswer={state.currentQuestion.displayAnswer}
          />
        </div>
      </main>

      <PlayerBottomBar
        onSpinClick={() => socket.emit(SOCKET_EVENTS.PLAYER_REQUEST_SPIN, { teamId })}
        onSolveClick={() => socket.emit(SOCKET_EVENTS.PLAYER_REQUEST_SOLVE, { teamId })}
        disabledSpin={!spaceEnabled}
        disabledSolve={!enterEnabled}
        solveUsedLabel={enterUsed}
        eliminated={enterUsed}
        spinHint={spinHint}
      />
    </div>
  );
}
