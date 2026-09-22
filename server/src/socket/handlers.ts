import { Server, Socket } from 'socket.io';
import {
  state,
  makePopup,
  resetForNextQuestion,
  jumpToQuestion,
  addQuestion,
  deleteQuestion,
  resetQuestions,
  updateWheelSegments,
  resetWheelSegments,
  getTeam,
  advanceToNextTeam,
  startNextPhase,
  resetToLobby,
  startGame,
} from '../state';
import {
  SOCKET_EVENTS,
  SelectTeamPayload,
  InputLetterPayload,
  AdminActionPayload,
  ResolveSolvePayload,
  RequestSpinPayload,
  RequestSolvePayload,
  RenameTeamPayload,
  AddQuestionPayload,
  DeleteQuestionPayload,
  SelectQuestionPayload,
  UpdateWheelSegmentsPayload,
} from '../types';

const STRUCTURE_REVEAL_DELAY_MS = 2000;
const WHEEL_SPIN_DURATION_MS = 3500;

let broadcast: (() => void) | null = null;

function popupExpire(popupId: number) {
  // Clear popup after a while, but only if a newer popup hasn't replaced it
  // (otherwise this stale timer would wipe out that later popup instead).
  setTimeout(() => {
    if (state.popup?.id === popupId) {
      state.popup = null;
      broadcast?.();
    }
  }, 4000);
}

function showPopup(type: Parameters<typeof makePopup>[0], message: string, title?: string) {
  const popup = makePopup(type, message, title);
  state.popup = popup;
  popupExpire(popup.id);
}

// Like showPopup, but doesn't auto-clear after 4s. Used for the full-solve
// win announcement, which should stay on screen until the admin moves on to
// the next question (startQuestion() clears state.popup itself).
function showPersistentPopup(type: Parameters<typeof makePopup>[0], message: string, title?: string) {
  state.popup = makePopup(type, message, title);
}

// Starts the countdown that flips letter cells from green to white.
// Used both when the admin advances to a new question and once at server
// boot, so question 1 reveals on its own without needing an extra click.
export function startStructureRevealTimer(): void {
  setTimeout(() => {
    if (state.phase === 'showing-question') {
      state.structureRevealed = true;
      state.phase = 'ready';
      broadcast?.();
    }
  }, STRUCTURE_REVEAL_DELAY_MS);
}

function applyWheelSegment(segmentId: string, teamId: number) {
  const segment = state.wheelSegments.find((s) => s.id === segmentId);
  const team = getTeam(teamId);
  if (!segment || !team) return;

  switch (segment.kind) {
    case 'add':
      // Points aren't awarded yet: the team calls a letter, admin checks it
      // via "Nhập chữ", and the payout is (points here) x (times it appears).
      state.pointsAtStake = segment.value ?? 0;
      state.phase = 'guessing';
      showPopup('wheel', `${team.name} quay được ${segment.label} điểm/chữ — đọc 1 chữ cái để kiểm tra!`, 'Kết quả vòng quay');
      break;
    case 'subtract':
      team.score += segment.value ?? 0;
      state.phase = 'ready';
      showPopup('wheel', `${team.name}: ${segment.label} điểm`, 'Kết quả vòng quay');
      advanceToNextTeam();
      break;
    case 'action':
      state.phase = 'ready';
      showPopup('wheel', `${team.name}: ${segment.label}`, 'Kết quả vòng quay');
      advanceToNextTeam();
      break;
    case 'lucky':
      state.phase = 'ready';
      showPopup('wheel', `${team.name}: ${segment.label}!`, 'Kết quả vòng quay');
      advanceToNextTeam();
      break;
  }
}

// Set up once at server boot so state changes (including the very first
// question's reveal timer) can broadcast even before any client connects.
export function initBroadcast(io: Server): void {
  broadcast = () => io.emit(SOCKET_EVENTS.STATE_SYNC, state);
}

export function registerSocketHandlers(io: Server, socket: Socket): void {
  if (!broadcast) {
    broadcast = () => io.emit(SOCKET_EVENTS.STATE_SYNC, state);
  }

  // Send current state immediately on connect.
  socket.emit(SOCKET_EVENTS.STATE_SYNC, state);

  socket.on(SOCKET_EVENTS.ADMIN_SELECT_TEAM, ({ teamId }: SelectTeamPayload) => {
    if (!getTeam(teamId)) return;
    state.activeTeamId = teamId;
    broadcast?.();
  });

  socket.on(SOCKET_EVENTS.ADMIN_NEXT_QUESTION, () => {
    resetForNextQuestion();
    broadcast?.();
    startStructureRevealTimer();
  });

  socket.on(SOCKET_EVENTS.ADMIN_SELECT_QUESTION, ({ id }: SelectQuestionPayload) => {
    if (!jumpToQuestion(id)) return;
    broadcast?.();
    startStructureRevealTimer();
  });

  socket.on(SOCKET_EVENTS.ADMIN_ADD_QUESTION, ({ question, answer, displayAnswer, phase }: AddQuestionPayload) => {
    const q = question.trim();
    const a = answer.trim();
    const da = displayAnswer.trim() || a;
    if (!q || !a) return;
    addQuestion(q, a, da, phase === 2 ? 2 : 1);
    broadcast?.();
  });

  socket.on(SOCKET_EVENTS.ADMIN_START_NEXT_PHASE, () => {
    if (!startNextPhase()) {
      showPopup('error', 'Chưa có câu hỏi nào cho Chặng 2 — hãy thêm câu hỏi trước!');
      broadcast?.();
      return;
    }
    broadcast?.();
    startStructureRevealTimer();
  });

  socket.on(SOCKET_EVENTS.ADMIN_RESTART_GAME, () => {
    resetToLobby();
    broadcast?.();
  });

  socket.on(SOCKET_EVENTS.ADMIN_START_GAME, () => {
    startGame();
    broadcast?.();
    startStructureRevealTimer();
  });

  socket.on(SOCKET_EVENTS.ADMIN_DELETE_QUESTION, ({ id }: DeleteQuestionPayload) => {
    deleteQuestion(id);
    broadcast?.();
    startStructureRevealTimer();
  });

  socket.on(SOCKET_EVENTS.ADMIN_RESET_QUESTIONS, () => {
    resetQuestions();
    broadcast?.();
    startStructureRevealTimer();
  });

  socket.on(SOCKET_EVENTS.ADMIN_UPDATE_WHEEL_SEGMENTS, ({ segments }: UpdateWheelSegmentsPayload) => {
    updateWheelSegments(segments);
    broadcast?.();
  });

  socket.on(SOCKET_EVENTS.ADMIN_RESET_WHEEL, () => {
    resetWheelSegments();
    broadcast?.();
  });

  socket.on(SOCKET_EVENTS.ADMIN_SHOW_ANSWER, () => {
    const answerChars = new Set(state.currentQuestion.answer.toUpperCase().split(''));
    answerChars.delete(' ');
    state.revealedChars = Array.from(answerChars);
    broadcast?.();
  });

  socket.on(SOCKET_EVENTS.ADMIN_INPUT_LETTER, ({ letter }: InputLetterPayload) => {
    const upper = letter.trim().toUpperCase();
    if (!upper) return;

    // Resolve a pending "+points" wheel result: this letter is the one the
    // team called out loud, and the admin is confirming whether it's in the
    // answer.
    if (state.pointsAtStake !== null && state.activeTeamId) {
      if (state.revealedChars.includes(upper)) return; // already checked, ignore
      const team = getTeam(state.activeTeamId);
      if (!team) return;

      const matchCount = state.answerLayout.filter((c) => c.char === upper).length;
      const stake = state.pointsAtStake;
      state.pointsAtStake = null;
      state.phase = 'ready';

      if (matchCount > 0) {
        state.revealedChars = [...state.revealedChars, upper];
        const awarded = matchCount * stake;
        team.score += awarded;
        showPopup('success', `${team.name}: đúng "${upper}" x${matchCount} = +${awarded} điểm! Được quay tiếp.`, 'Chính xác');
      } else {
        showPopup('error', `${team.name}: "${upper}" không có trong ô chữ — mất lượt!`);
        advanceToNextTeam();
      }
      broadcast?.();
      return;
    }

    // No points pending: plain admin reveal (manual hint), no scoring.
    if (!state.revealedChars.includes(upper)) {
      state.revealedChars = [...state.revealedChars, upper];
    }
    broadcast?.();
  });

  socket.on(SOCKET_EVENTS.ADMIN_ACTION, ({ actionType, value }: AdminActionPayload) => {
    const team = state.activeTeamId ? getTeam(state.activeTeamId) : undefined;
    if (!team) return;

    switch (actionType) {
      case 'add':
        team.score += Math.abs(value ?? 0);
        showPopup('success', `${team.name} +${Math.abs(value ?? 0)} điểm`);
        break;
      case 'subtract':
        team.score -= Math.abs(value ?? 0);
        showPopup('error', `${team.name} -${Math.abs(value ?? 0)} điểm`);
        break;
      case 'penalty':
        team.score -= 100;
        showPopup('error', `${team.name} bị phạt -100 điểm`);
        break;
      case 'skipTurn':
        showPopup('info', `${team.name} mất lượt`);
        break;
      case 'luckyDraw':
        showPopup('wheel', `${team.name} bốc thăm may mắn!`);
        break;
    }
    broadcast?.();
  });

  socket.on(SOCKET_EVENTS.ADMIN_SPIN, () => {
    doSpin();
  });

  socket.on(SOCKET_EVENTS.ADMIN_RESOLVE_SOLVE, ({ correct }: ResolveSolvePayload) => {
    const teamId = state.solvingTeamId;
    if (!teamId) return;
    const team = getTeam(teamId);
    if (!team) return;

    if (correct) {
      const answerChars = new Set(state.currentQuestion.answer.toUpperCase().split(''));
      answerChars.delete(' ');
      state.revealedChars = Array.from(answerChars);
      team.score += 5000;
      state.phase = 'finished';
      showPersistentPopup(
        'success',
        `${team.name} trả lời đúng! +5000 điểm — Đáp án: ${state.currentQuestion.displayAnswer}`,
        'Chính xác'
      );
    } else {
      // Wrong full-solve eliminates the team for the rest of this question:
      // no more spinning, no more solve attempts, until the next question.
      state.enterUsedByTeam[teamId] = true;
      state.phase = 'ready';
      showPopup('error', `${team.name} trả lời sai — không thể chơi tiếp câu này!`);
    }
    state.solvingTeamId = null;
    broadcast?.();
  });

  socket.on(SOCKET_EVENTS.PLAYER_REQUEST_SPIN, ({ teamId }: RequestSpinPayload) => {
    if (teamId !== state.activeTeamId) return;
    if (state.enterUsedByTeam[teamId]) return; // eliminated this question
    if (state.phase !== 'ready') return;
    doSpin();
  });

  socket.on(SOCKET_EVENTS.PLAYER_REQUEST_SOLVE, ({ teamId }: RequestSolvePayload) => {
    const team = getTeam(teamId);
    if (!team) return;
    if (state.enterUsedByTeam[teamId]) return;
    if (state.phase !== 'ready' && state.phase !== 'showing-question') return;
    if (state.solvingTeamId) return; // someone already solving

    state.solvingTeamId = teamId;
    state.activeTeamId = teamId;
    state.phase = 'solving';
    showPopup('info', `${team.name} xin trả lời toàn bộ đáp án!`, 'Xin trả lời');
    broadcast?.();
  });

  socket.on(SOCKET_EVENTS.PLAYER_RENAME_TEAM, ({ teamId, name }: RenameTeamPayload) => {
    const team = getTeam(teamId);
    const trimmed = name.trim().slice(0, 24);
    if (!team || !trimmed) return;
    team.name = trimmed;
    broadcast?.();
  });

  function doSpin() {
    if (!state.activeTeamId) return;
    if (state.enterUsedByTeam[state.activeTeamId]) return; // eliminated this question
    if (state.phase !== 'ready' || state.wheelSpinning) return;

    const teamId = state.activeTeamId;
    const segment = state.wheelSegments[Math.floor(Math.random() * state.wheelSegments.length)];
    state.wheelSpinning = true;
    state.spinRequestedTeamId = null;
    state.wheelResultSegmentId = segment.id;
    state.phase = 'spinning';
    broadcast?.();

    setTimeout(() => {
      state.wheelSpinning = false;
      applyWheelSegment(segment.id, teamId); // sets the next phase itself
      broadcast?.();
    }, WHEEL_SPIN_DURATION_MS);
  }
}
