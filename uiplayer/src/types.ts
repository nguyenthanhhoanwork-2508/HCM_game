export interface Team {
  id: number;
  name: string;
  score: number;
  isCurrentTurn: boolean;
  isUserTeam: boolean;
}

export interface LetterTile {
  char: string;
  isRevealed: boolean;
  row: number;
  col: number;
}

export interface QuestionData {
  id: number;
  number: number;
  category: string;
  question: string;
  answer: string; // e.g. "ĐẢO PHÚ QUỐC"
  rows: (string | null)[][]; // 3 rows x 14 columns
  revealedLetters: string[]; // guessed letters
}

export type GameStatus = 'idle' | 'spinning' | 'guessing_letter' | 'solving' | 'solved' | 'wrong_guess';
