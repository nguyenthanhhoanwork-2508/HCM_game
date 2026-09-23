import { questions as DEFAULT_QUESTIONS } from './data/questions';
import { wheelSegments as DEFAULT_WHEEL_SEGMENTS } from './data/wheelSegments';
import { buildAnswerLayout } from './utils/answerLayout';
import { loadQuestions, saveQuestions } from './persistence/questionStore';
import { GameRound, GameState, PopupState, Question, Team, WheelSegment } from './types';

const DEFAULT_TEAM_NAMES: Record<number, string> = {
  1: 'Nhóm 1',
  2: 'Nhóm 2',
  3: 'Nhóm 3',
  4: 'Nhóm 5',
  5: 'Nhóm 6',
};

function createInitialTeams(): Team[] {
  return Object.entries(DEFAULT_TEAM_NAMES).map(([id, name]) => ({ id: Number(id), name, score: 0 }));
}

export function shuffleTeams(teams: Team[], random: () => number = Math.random): Team[] {
  const shuffled = [...teams];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

let popupCounter = 0;
const loadedQuestions = loadQuestions(DEFAULT_QUESTIONS);
const tutorialDefaults = DEFAULT_QUESTIONS.filter((question) => question.phase === 0);
if (!loadedQuestions.some((question) => question.phase === 0)) {
  loadedQuestions.unshift(...tutorialDefaults.map((question) => ({ ...question })));
}
saveQuestions(loadedQuestions);
let questionIdCounter = Math.max(...loadedQuestions.map((q) => q.id));

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

function resetTeamScores(): void {
  for (const team of state.teams) {
    team.score = 0;
  }
}

function randomizePlayOrder(): void {
  state.teams = shuffleTeams(state.teams);
  state.activeTeamId = state.teams[0]?.id ?? null;
}

export function createInitialState(): GameState {
  const questions = loadedQuestions.map((question) => ({ ...question }));
  return {
    teams: createInitialTeams(),
    activeTeamId: null,
    questions,
    currentPhase: 0,
    phase: 'idle',
    popup: null,
    wheelSegments: [...DEFAULT_WHEEL_SEGMENTS],
    ...buildQuestionState(
      questions.filter((q) => q.phase === 0),
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
  state.phase = state.currentPhase < 2 ? 'phase-complete' : 'game-over';
  state.popup = null;
}

export function jumpToQuestion(id: number): boolean {
  const target = state.questions.find((q) => q.id === id);
  if (!target) return false;
  const changesPhase = target.phase !== state.currentPhase;
  if (state.currentPhase === 0 && target.phase > 0) resetTeamScores();
  state.currentPhase = target.phase;
  if (changesPhase) randomizePlayOrder();
  const list = questionsForCurrentPhase();
  const idx = list.findIndex((q) => q.id === id);
  startQuestion(idx);
  return true;
}

export function addQuestion(question: string, answer: string, displayAnswer: string, phase: GameRound): void {
  questionIdCounter += 1;
  state.questions = [...state.questions, { id: questionIdCounter, question, answer, displayAnswer, type: 'normal', phase }];
  saveQuestions(state.questions);
}

export function deleteQuestion(id: number): void {
  const target = state.questions.find((q) => q.id === id);
  if (!target) return;

  const phaseList = state.questions.filter((q) => q.phase === target.phase);
  if (target.phase === state.currentPhase && phaseList.length <= 1) return; // keep the active round non-empty

  const deletedIndexInPhase = phaseList.findIndex((q) => q.id === id);
  state.questions = state.questions.filter((q) => q.id !== id);

  if (target.phase !== state.currentPhase) {
    saveQuestions(state.questions);
    return; // doesn't affect the round in progress
  }

  if (deletedIndexInPhase < state.currentQuestionIndex) {
    state.currentQuestionIndex -= 1;
  } else if (deletedIndexInPhase === state.currentQuestionIndex) {
    const newList = questionsForCurrentPhase();
    startQuestion(Math.min(deletedIndexInPhase, newList.length - 1));
  }
  saveQuestions(state.questions);
}

export function resetQuestions(): void {
  state.questions = DEFAULT_QUESTIONS.map((question) => ({ ...question }));
  questionIdCounter = Math.max(...state.questions.map((question) => question.id));
  state.currentPhase = 0;
  startQuestion(0);
  saveQuestions(state.questions);
}

// Move to the next round. Leaving tutorial round 0 clears only its temporary
// scores and keeps team names. The existing round 1 -> 2 behavior starts a
// fresh roster, so both scores and names are reset at that boundary.
export function startNextPhase(): boolean {
  if (state.currentPhase >= 2) return false;
  const nextPhase = (state.currentPhase + 1) as GameRound;
  const nextPhaseList = state.questions.filter((q) => q.phase === nextPhase);
  if (nextPhaseList.length === 0) return false;

  if (state.currentPhase === 0) {
    resetTeamScores();
  } else if (state.currentPhase === 1) {
    for (const team of state.teams) {
      team.score = 0;
      team.name = DEFAULT_TEAM_NAMES[team.id];
    }
  }
  state.currentPhase = nextPhase;
  randomizePlayOrder();
  startQuestion(0);
  return true;
}

// Full reset: back to tutorial round 0, every team's score and name
// cleared, and back to the "idle" lobby so the admin can brief players
// before pressing Start again. Used by the "Reset Game" button and by
// "Chơi lại" on the final leaderboard.
export function resetToLobby(): void {
  state.currentPhase = state.questions.some((question) => question.phase === 0) ? 0 : 1;
  state.teams.sort((a, b) => a.id - b.id);
  for (const team of state.teams) {
    team.score = 0;
    team.name = DEFAULT_TEAM_NAMES[team.id];
  }
  state.activeTeamId = null;
  Object.assign(state, buildQuestionState(questionsForCurrentPhase(), 0));
  state.phase = 'idle';
  state.popup = null;
}

// Leaves the "idle" lobby and reveals question 1 for the first time.
export function startGame(): void {
  if (state.phase !== 'idle') return;
  randomizePlayOrder();
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
