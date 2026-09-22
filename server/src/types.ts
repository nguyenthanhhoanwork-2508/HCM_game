// Shared game types. Mirrored in client/src/types.ts (no monorepo tooling for MVP).

export type GamePhase =
  | 'idle'
  | 'showing-question'
  | 'ready'
  | 'spinning'
  | 'guessing' // "+points" landed; waiting on admin to check a called letter
  | 'solving'
  | 'finished'
  | 'phase-complete' // out of questions for the current round (not the last one)
  | 'game-over'; // no more questions left in the final round; show the final leaderboard

export type QuestionType = 'first' | 'normal';

export interface Question {
  id: number;
  question: string;
  answer: string; // Vietnamese string, spaces allowed (used for the tile board)
  displayAnswer: string; // full answer with proper Vietnamese diacritics, shown once solved
  type: QuestionType;
  phase: 1 | 2; // which round this question belongs to
}

export interface Team {
  id: number;
  name: string;
  score: number;
}

// One cell in the 44-cell / 4-row answer board (rows of 10/12/12/10).
export interface AnswerCell {
  index: number; // 0-43
  row: number; // 0-3
  char: string | null; // null = spacer cell (no letter here, stays blank/background)
}

export type WheelSegmentKind = 'add' | 'subtract' | 'action' | 'lucky';

export interface WheelSegment {
  id: string;
  kind: WheelSegmentKind;
  label: string; // displayed text, e.g. "+500" or "Mất lượt"
  value?: number; // for add/subtract
}

export type PopupType = 'info' | 'success' | 'error' | 'wheel';

export interface PopupState {
  id: number;
  type: PopupType;
  title?: string;
  message: string;
}

export interface GameState {
  teams: Team[];
  activeTeamId: number | null;
  questions: Question[]; // runtime-mutable question bank, admin can add/delete/select
  currentPhase: 1 | 2; // which round is currently being played
  currentQuestionIndex: number; // index within the current phase's questions
  currentQuestion: Question;
  phase: GamePhase;
  answerLayout: AnswerCell[]; // 44 cells, structure only
  structureRevealed: boolean; // true after 3s delay -> cells with letters turn white
  revealedChars: string[]; // list of characters (uppercase) the admin has revealed
  enterUsedByTeam: Record<number, boolean>; // per current question
  solvingTeamId: number | null; // team currently attempting full solve (Enter)
  spinRequestedTeamId: number | null; // team that pressed Space, awaiting admin spin
  wheelSegments: WheelSegment[]; // runtime-mutable wheel, admin can edit/reset
  wheelSpinning: boolean;
  wheelResultSegmentId: string | null; // segment landed on, set right when spin resolves
  pointsAtStake: number | null; // set when an "add" segment lands; awarded per matching letter once admin confirms it
  popup: PopupState | null;
}

// ---- Socket event payloads ----

export interface SelectTeamPayload {
  teamId: number;
}

export interface InputLetterPayload {
  letter: string;
}

export type AdminActionType = 'add' | 'subtract' | 'penalty' | 'skipTurn' | 'luckyDraw';

export interface AdminActionPayload {
  actionType: AdminActionType;
  value?: number;
}

export interface ResolveSolvePayload {
  correct: boolean;
}

export interface RequestSpinPayload {
  teamId: number;
}

export interface RequestSolvePayload {
  teamId: number;
}

export interface RenameTeamPayload {
  teamId: number;
  name: string;
}

export interface AddQuestionPayload {
  question: string;
  answer: string;
  displayAnswer: string;
  phase: 1 | 2;
}

export interface DeleteQuestionPayload {
  id: number;
}

export interface SelectQuestionPayload {
  id: number;
}

export interface UpdateWheelSegmentsPayload {
  segments: WheelSegment[];
}

// Client -> Server event names
export const SOCKET_EVENTS = {
  // admin
  ADMIN_SELECT_TEAM: 'admin:selectTeam',
  ADMIN_NEXT_QUESTION: 'admin:nextQuestion',
  ADMIN_SHOW_ANSWER: 'admin:showAnswer',
  ADMIN_INPUT_LETTER: 'admin:inputLetter',
  ADMIN_ACTION: 'admin:action',
  ADMIN_SPIN: 'admin:spin',
  ADMIN_RESOLVE_SOLVE: 'admin:resolveSolve',
  ADMIN_ADD_QUESTION: 'admin:addQuestion',
  ADMIN_DELETE_QUESTION: 'admin:deleteQuestion',
  ADMIN_SELECT_QUESTION: 'admin:selectQuestion',
  ADMIN_RESET_QUESTIONS: 'admin:resetQuestions',
  ADMIN_UPDATE_WHEEL_SEGMENTS: 'admin:updateWheelSegments',
  ADMIN_RESET_WHEEL: 'admin:resetWheel',
  ADMIN_START_NEXT_PHASE: 'admin:startNextPhase',
  ADMIN_RESTART_GAME: 'admin:restartGame',
  ADMIN_START_GAME: 'admin:startGame',
  // player
  PLAYER_REQUEST_SPIN: 'player:requestSpin',
  PLAYER_REQUEST_SOLVE: 'player:requestSolve',
  PLAYER_RENAME_TEAM: 'player:renameTeam',
  // server -> all
  STATE_SYNC: 'state:sync',
} as const;
