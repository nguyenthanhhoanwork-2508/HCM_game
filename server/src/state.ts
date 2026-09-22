import { questions as DEFAULT_QUESTIONS } from './data/questions';
import { wheelSegments as DEFAULT_WHEEL_SEGMENTS } from './data/wheelSegments';
import { buildAnswerLayout } from './utils/answerLayout';
import { GameState, PopupState, Question, Team, WheelSegment } from './types';

const initialTeams: Team[] = [
  { id: 1, name: 'Team 1', score: 0 },
  { id: 2, name: 'Team 2', score: 0 },
  { id: 3, name: 'Team 3', score: 0 },
  { id: 4, name: 'Team 4', score: 0 },
  { id: 5, name: 'Team 5', score: 0 },
];

let popupCounter = 0;
let questionIdCounter = Math.max(...DEFAULT_QUESTIONS.map((q) => q.id)) + 1;

function buildQuestionState(questionList: Question[], index: number) {
  const currentQuestion = questionList[index];
  return {
    currentQuestionIndex: index,
    currentQuestion,
    answerLayout: buildAnswerLayout(currentQuestion.answer),
    structureRevealed: false,
    revealedChars: [],
    enterUsedByTeam: {},
    solvingTeamId: null,
    spinRequestedTeamId: null,
    wheelSpinning: false,
    wheelResultSegmentId: null,
    pointsAtStake: null,
  };
}

// Questions belonging to the round currently being played.
function questionsForCurrentPhase(): Question[] {
  return state.questions.filter((q) => q.phase === state.currentPhase);
}

export function createInitialState(): GameState {
  const questions = [...DEFAULT_QUESTIONS];
  return {
    teams: initialTeams,
    activeTeamId: null,
    questions,
    currentPhase: 1,
    phase: 'idle',
    popup: null,
    wheelSegments: [...DEFAULT_WHEEL_SEGMENTS],
    ...buildQuestionState(
      questions.filter((q) => q.phase === 1),
      0
    ),
  };
}

export const state: GameState = createInitialState();

export function makePopup(type: PopupState['type'], message: string, title?: string): PopupState {
  popupCounter += 1;
  return { id: popupCounter, type, title, message };
}

function startQuestion(index: number): void {
  Object.assign(state, buildQuestionState(questionsForCurrentPhase(), index));
  state.phase = 'showing-question';
  state.popup = null;
}

export function resetForNextQuestion(): void {
  const list = questionsForCurrentPhase();
  if (state.currentQuestionIndex + 1 < list.length) {
    startQuestion(state.currentQuestionIndex + 1);
    return;
  }
  // Out of questions for this round.
  state.phase = state.currentPhase === 1 ? 'phase-complete' : 'game-over';
  state.popup = null;
}

export function jumpToQuestion(id: number): boolean {
  const target = state.questions.find((q) => q.id === id);
  if (!target) return false;
  state.currentPhase = target.phase;
  const list = questionsForCurrentPhase();
  const idx = list.findIndex((q) => q.id === id);
  startQuestion(idx);
  return true;
}

export function addQuestion(question: string, answer: string, displayAnswer: string, phase: 1 | 2): void {
  questionIdCounter += 1;
  state.questions = [...state.questions, { id: questionIdCounter, question, answer, displayAnswer, type: 'normal', phase }];
}

export function deleteQuestion(id: number): void {
  const target = state.questions.find((q) => q.id === id);
  if (!target) return;

  const phaseList = state.questions.filter((q) => q.phase === target.phase);
  if (target.phase === state.currentPhase && phaseList.length <= 1) return; // keep the active round non-empty

  const deletedIndexInPhase = phaseList.findIndex((q) => q.id === id);
  state.questions = state.questions.filter((q) => q.id !== id);

  if (target.phase !== state.currentPhase) return; // doesn't affect the round in progress

  if (deletedIndexInPhase < state.currentQuestionIndex) {
    state.currentQuestionIndex -= 1;
  } else if (deletedIndexInPhase === state.currentQuestionIndex) {
    const newList = questionsForCurrentPhase();
    startQuestion(Math.min(deletedIndexInPhase, newList.length - 1));
  }
}

export function resetQuestions(): void {
  state.questions = [...DEFAULT_QUESTIONS];
  state.currentPhase = 1;
  startQuestion(0);
}

// Moves on from round 1 to round 2: resets every team's score and name (a
// fresh roster is expected to play round 2), then starts round 2's first
// question. Returns false (and does nothing) if round 2 has no questions
// yet — the admin needs to add some via the question manager first.
export function startNextPhase(): boolean {
  const phase2List = state.questions.filter((q) => q.phase === 2);
  if (phase2List.length === 0) return false;

  state.currentPhase = 2;
  for (const team of state.teams) {
    team.score = 0;
    team.name = `Team ${team.id}`;
  }
  startQuestion(0);
  return true;
}

// Full reset: back to round 1 question 1, every team's score and name
// cleared, and back to the "idle" lobby so the admin can brief players
// before pressing Start again. Used by the "Reset Game" button and by
// "Chơi lại" on the final leaderboard.
export function resetToLobby(): void {
  state.currentPhase = 1;
  for (const team of state.teams) {
    team.score = 0;
    team.name = `Team ${team.id}`;
  }
  state.activeTeamId = null;
  Object.assign(state, buildQuestionState(questionsForCurrentPhase(), 0));
  state.phase = 'idle';
  state.popup = null;
}

// Leaves the "idle" lobby and reveals question 1 for the first time.
export function startGame(): void {
  if (state.phase !== 'idle') return;
  state.phase = 'showing-question';
  state.popup = null;
}

export function updateWheelSegments(segments: WheelSegment[]): void {
  if (segments.length === 0) return;
  state.wheelSegments = segments;
}

export function resetWheelSegments(): void {
  state.wheelSegments = [...DEFAULT_WHEEL_SEGMENTS];
}

export function getTeam(teamId: number): Team | undefined {
  return state.teams.find((t) => t.id === teamId);
}

// Passes the spin turn to the next team in order, skipping teams already
// eliminated from this question (wrong full-solve). Used whenever a wheel
// result other than "add points" resolves, and when a called letter isn't
// in the answer.
export function advanceToNextTeam(): void {
  const n = state.teams.length;
  if (n === 0) return;
  const currentIndex = state.teams.findIndex((t) => t.id === state.activeTeamId);
  for (let step = 1; step <= n; step++) {
    const candidate = state.teams[(currentIndex + step + n) % n];
    if (!state.enterUsedByTeam[candidate.id]) {
      state.activeTeamId = candidate.id;
      return;
    }
  }
}
