export type SegmentType = 'points_pos' | 'points_neg' | 'penalty' | 'bonus' | 'challenge' | 'special';

export interface WheelSegment {
  id: string;
  label: string;
  value: number; // numeric point diff (can be 0 or negative)
  specialAction?: 'LOSE_TURN' | 'SING_SONG' | 'PUSH_UPS' | 'LUCKY_DRAW' | 'DOUBLE' | 'EXTRA_TURN';
  type: SegmentType;
  color: string;
  textColor?: string;
  sublabel?: string;
}

export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
  avatarBg: string;
}

export interface Question {
  id: string;
  category: string;
  hint: string;
  answer: string; // Vietnamese uppercase string
}

export interface GuessResult {
  letter: string;
  count: number;
  isCorrect: boolean;
}
