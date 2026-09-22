import { WheelSegment } from '../types';

export const DEFAULT_WHEEL_SEGMENTS: WheelSegment[] = [
  {
    id: 's1',
    label: '+500',
    value: 500,
    type: 'points_pos',
    color: '#059669', // Emerald
    textColor: '#ffffff',
  },
  {
    id: 's2',
    label: 'Hát 1 đoạn',
    sublabel: 'tự chọn',
    value: 0,
    specialAction: 'SING_SONG',
    type: 'challenge',
    color: '#f97316', // Warm amber orange
    textColor: '#ffffff',
  },
  {
    id: 's3',
    label: '-300',
    value: -300,
    type: 'points_neg',
    color: '#dc2626', // Crimson red
    textColor: '#ffffff',
  },
  {
    id: 's4',
    label: '+1200',
    sublabel: 'May Mắn ⭐',
    value: 1200,
    specialAction: 'LUCKY_DRAW',
    type: 'bonus',
    color: '#eab308', // Gold
    textColor: '#18181b',
  },
  {
    id: 's5',
    label: '-50',
    value: -50,
    type: 'points_neg',
    color: '#0891b2', // Cyan dark
    textColor: '#ffffff',
  },
  {
    id: 's6',
    label: '+700',
    value: 700,
    type: 'points_pos',
    color: '#16a34a', // Green
    textColor: '#ffffff',
  },
  {
    id: 's7',
    label: 'Mất lượt',
    value: 0,
    specialAction: 'LOSE_TURN',
    type: 'penalty',
    color: '#1e293b', // Deep slate
    textColor: '#f87171', // Red tint
  },
  {
    id: 's8',
    label: '+200',
    value: 200,
    type: 'points_pos',
    color: '#0284c7', // Sky blue
    textColor: '#ffffff',
  },
  {
    id: 's9',
    label: 'Chống đẩy',
    sublabel: '5 cái (-800)',
    value: -800,
    specialAction: 'PUSH_UPS',
    type: 'challenge',
    color: '#ea580c', // Orange
    textColor: '#ffffff',
  },
  {
    id: 's10',
    label: '+150',
    value: 150,
    type: 'points_pos',
    color: '#8b5cf6', // Violet
    textColor: '#ffffff',
  },
  {
    id: 's11',
    label: '-500',
    value: -500,
    type: 'points_neg',
    color: '#e11d48', // Rose
    textColor: '#ffffff',
  },
  {
    id: 's12',
    label: '+900',
    value: 900,
    type: 'points_pos',
    color: '#10b981', // Mint emerald
    textColor: '#ffffff',
  },
  {
    id: 's13',
    label: '-150',
    value: -150,
    type: 'points_neg',
    color: '#4f46e5', // Indigo
    textColor: '#ffffff',
  },
  {
    id: 's14',
    label: 'Nhân đôi',
    sublabel: 'x2 Điểm',
    value: 0,
    specialAction: 'DOUBLE',
    type: 'bonus',
    color: '#f59e0b', // Amber gold
    textColor: '#1e1b4b',
  },
];

export const INITIAL_TEAMS = [
  { id: 'team-1', name: 'Đội 1', score: 0, color: '#f43f5e', avatarBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { id: 'team-2', name: 'Đội 2', score: 0, color: '#3b82f6', avatarBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'team-3', name: 'Đội 3', score: 0, color: '#10b981', avatarBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 'team-4', name: 'Đội 4', score: 0, color: '#f97316', avatarBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { id: 'team-5', name: 'Đội 5', score: 200, color: '#a855f7', avatarBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
];
