import { QuestionData } from '../types';

export const INITIAL_QUESTIONS: QuestionData[] = [
  {
    id: 1,
    number: 3,
    category: 'ĐỊA DANH VIỆT NAM',
    question: 'Đây là tên của một địa danh nổi tiếng ở Việt Nam?',
    answer: 'ĐẢO PHÚ QUỐC',
    rows: [
      Array(14).fill(null),
      [
        null,
        'Đ', 'Ả', 'O',
        null,
        'P', 'H', 'Ú',
        null,
        'Q', 'U', 'Ố', 'C',
        null,
      ],
      Array(14).fill(null),
    ],
    revealedLetters: [],
  },
  {
    id: 2,
    number: 1,
    category: 'KỲ QUAN THIÊN NHIÊN',
    question: 'Kỳ quan thiên nhiên thế giới nổi tiếng được UNESCO công nhận tại Quảng Ninh?',
    answer: 'VỊNH HẠ LONG',
    rows: [
      Array(14).fill(null),
      [
        null,
        'V', 'Ị', 'N', 'H',
        null,
        'H', 'Ạ',
        null,
        'L', 'O', 'N', 'G',
        null,
      ],
      Array(14).fill(null),
    ],
    revealedLetters: [],
  },
  {
    id: 3,
    number: 2,
    category: 'DI SẢN VĂN HÓA',
    question: 'Khu phố cổ nổi tiếng với những dãy nhà vàng và đèn lồng rực rỡ tại Quảng Nam?',
    answer: 'PHỐ CỔ HỘI AN',
    rows: [
      Array(14).fill(null),
      [
        null,
        'P', 'H', 'Ố',
        null,
        'C', 'Ổ',
        null,
        'H', 'Ộ', 'I',
        null,
        'A', 'N',
      ],
      Array(14).fill(null),
    ],
    revealedLetters: [],
  },
  {
    id: 4,
    number: 4,
    category: 'DANH THẮNG THỦ ĐÔ',
    question: 'Hồ nước gắn liền với truyền thuyết trả gươm báu của vua Lê Thái Tổ?',
    answer: 'HỒ HOÀN KIẾM',
    rows: [
      Array(14).fill(null),
      [
        null,
        'H', 'Ồ',
        null,
        'H', 'O', 'À', 'N',
        null,
        'K', 'I', 'Ế', 'M',
        null,
      ],
      Array(14).fill(null),
    ],
    revealedLetters: [],
  },
];

// Helper to normalize Vietnamese characters for guessing comparison
export function normalizeVietnamese(str: string): string {
  return str
    .trim()
    .toUpperCase()
    .normalize('NFC');
}

// Compare base letters (e.g. matching 'A' with 'À', 'Á', 'Ả', 'Ã', 'Ạ', 'Ă', 'Â' if requested or exact matching)
export function isLetterMatch(tileChar: string, guessedChar: string): boolean {
  if (!tileChar || !guessedChar) return false;
  
  // Exact match first
  if (normalizeVietnamese(tileChar) === normalizeVietnamese(guessedChar)) {
    return true;
  }

  // Also support base letter matching (standard Chiếc Nón Kỳ Diệu rule: guessing 'A' reveals all A, Á, À, Ả, Ã, Ạ, Ă, Â)
  const baseTile = removeAccents(tileChar);
  const baseGuess = removeAccents(guessedChar);
  return baseTile === baseGuess;
}

export function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toUpperCase();
}
