import { WheelSegment } from '../types';

// Interleaved so add/subtract/action/lucky segments never cluster together.
// Rebalanced: fewer/lighter subtract segments (-800/-500 removed) so the
// wheel doesn't feel punishing — 8 add / 3 subtract / 3 action / 1 lucky.
export const wheelSegments: WheelSegment[] = [
  { id: 'w1', kind: 'add', label: '+500', value: 500 },
  { id: 'w2', kind: 'subtract', label: '-50', value: -50 },
  { id: 'w3', kind: 'add', label: '+700', value: 700 },
  { id: 'w4', kind: 'action', label: 'Hát 1 đoạn tự chọn' },
  { id: 'w5', kind: 'add', label: '+900', value: 900 },
  { id: 'w6', kind: 'lucky', label: 'Bốc thăm may mắn' },
  { id: 'w7', kind: 'add', label: '+1200', value: 1200 },
  { id: 'w8', kind: 'subtract', label: '-150', value: -150 },
  { id: 'w9', kind: 'add', label: '+200', value: 200 },
  { id: 'w10', kind: 'action', label: 'Mất lượt' },
  { id: 'w11', kind: 'add', label: '+400', value: 400 },
  { id: 'w12', kind: 'subtract', label: '-300', value: -300 },
  { id: 'w13', kind: 'add', label: '+600', value: 600 },
  { id: 'w14', kind: 'action', label: 'Chống đẩy 5 cái' },
  { id: 'w15', kind: 'add', label: '+150', value: 150 },
];
