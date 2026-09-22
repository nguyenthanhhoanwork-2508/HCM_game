/**
 * Utilities for Vietnamese alphabet handling, normalization and string manipulation
 */

// Vietnamese standard alphabet components
export const VN_CONSONANTS = [
  'B', 'C', 'D', 'Đ', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'X'
];

export const VN_VOWELS = [
  'A', 'Ă', 'Â', 'E', 'Ê', 'I', 'O', 'Ô', 'Ơ', 'U', 'Ư', 'Y'
];

export const ALL_VN_LETTERS = [
  'A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M',
  'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'
];

/**
 * Remove tone marks (sắc, huyền, hỏi, ngã, nặng) but preserve base letters (Ă, Â, Đ, Ê, Ô, Ơ, Ư)
 */
export function removeToneMarks(str: string): string {
  return str
    .replace(/[áàảãạ]/gi, 'a')
    .replace(/[ắằẳẵặ]/gi, 'ă')
    .replace(/[ấầẩẫậ]/gi, 'â')
    .replace(/[éèẻẽẹ]/gi, 'e')
    .replace(/[ếềểễệ]/gi, 'ê')
    .replace(/[íìỉĩị]/gi, 'i')
    .replace(/[óòỏõọ]/gi, 'o')
    .replace(/[ốồổỗộ]/gi, 'ô')
    .replace(/[ớờởỡợ]/gi, 'ơ')
    .replace(/[úùủũụ]/gi, 'u')
    .replace(/[ứừửữự]/gi, 'ư')
    .replace(/[ýỳỷỹỵ]/gi, 'y')
    .replace(/[ÁÀẢÃẠ]/g, 'A')
    .replace(/[ẮẰẲẴẶ]/g, 'Ă')
    .replace(/[ẤẦẨẪẬ]/g, 'Â')
    .replace(/[ÉÈẺẼẸ]/g, 'E')
    .replace(/[ẾỀỂỄỆ]/g, 'Ê')
    .replace(/[ÍÌỈĨỊ]/g, 'I')
    .replace(/[ÓÒỎÕỌ]/g, 'O')
    .replace(/[ỐỒỔỖỘ]/g, 'Ô')
    .replace(/[ỚỜỞỠỢ]/g, 'Ơ')
    .replace(/[ÚÙỦŨỤ]/g, 'U')
    .replace(/[ỨỪỬỮỰ]/g, 'Ư')
    .replace(/[ÝỲỶỸỴ]/g, 'Y');
}

/**
 * Strips all accents completely to basic Latin (A-Z)
 */
export function stripAllAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'));
}

/**
 * Check if a character in the puzzle matches a guessed letter.
 * In Vietnamese game shows, guessing "A" matches A, Á, À, Ả, Ã, Ạ.
 * If exactAccents is false (default), it matches the base vowel.
 */
export function charMatchesGuess(charInPuzzle: string, guessedLetter: string, exactVowels: boolean = true): boolean {
  const c = charInPuzzle.toUpperCase();
  const g = guessedLetter.toUpperCase();

  if (c === g) return true;

  if (exactVowels) {
    // Matches if same base letter with tone variations
    const cBase = removeToneMarks(c);
    const gBase = removeToneMarks(g);
    return cBase === gBase;
  } else {
    // Completely unaccented match
    const cLatin = stripAllAccents(c);
    const gLatin = stripAllAccents(g);
    return cLatin === gLatin;
  }
}

/**
 * Center text inside a row array with specified capacity
 */
function centerTextInRow(text: string, cap: number): string[] {
  const row = Array(cap).fill('');
  if (!text) return row;
  const start = Math.max(0, Math.floor((cap - text.length) / 2));
  for (let i = 0; i < text.length && start + i < cap; i++) {
    row[start + i] = text[i];
  }
  return row;
}

/**
 * Format Answer into authentic 3 rows with 44 boxes total:
 * Row 1: 14 boxes
 * Row 2: 16 boxes
 * Row 3: 14 boxes
 * Total: 44 boxes
 */
export function formatAnswerTo44Grid(answer: string): string[][] {
  const words = answer.trim().toUpperCase().split(/\s+/).filter(Boolean);
  const rowCaps = [14, 16, 14];

  // 1. Single row: if fits on middle row (16 chars), place it there for balance
  const fullText = words.join(' ');
  if (fullText.length <= rowCaps[1]) {
    return [
      Array(rowCaps[0]).fill(''),
      centerTextInRow(fullText, rowCaps[1]),
      Array(rowCaps[2]).fill(''),
    ];
  }

  // 2. Two rows: check if can split cleanly across (row 0 + row 1) or (row 1 + row 2)
  let best2Row: [string, string, number] | null = null;
  for (let i = 1; i < words.length; i++) {
    const line1 = words.slice(0, i).join(' ');
    const line2 = words.slice(i).join(' ');

    if (line1.length <= rowCaps[0] && line2.length <= rowCaps[1]) {
      best2Row = [line1, line2, 0];
      break;
    }
    if (line1.length <= rowCaps[1] && line2.length <= rowCaps[2]) {
      best2Row = [line1, line2, 1];
      break;
    }
  }

  if (best2Row) {
    const [lineA, lineB, startRow] = best2Row;
    const grid: string[][] = [
      Array(rowCaps[0]).fill(''),
      Array(rowCaps[1]).fill(''),
      Array(rowCaps[2]).fill(''),
    ];
    grid[startRow] = centerTextInRow(lineA, rowCaps[startRow]);
    grid[startRow + 1] = centerTextInRow(lineB, rowCaps[startRow + 1]);
    return grid;
  }

  // 3. Three rows: check split into 3 lines
  let best3Row: [string, string, string] | null = null;
  for (let i = 1; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const line1 = words.slice(0, i).join(' ');
      const line2 = words.slice(i, j).join(' ');
      const line3 = words.slice(j).join(' ');
      if (line1.length <= rowCaps[0] && line2.length <= rowCaps[1] && line3.length <= rowCaps[2]) {
        best3Row = [line1, line2, line3];
        break;
      }
    }
    if (best3Row) break;
  }

  if (best3Row) {
    return [
      centerTextInRow(best3Row[0], rowCaps[0]),
      centerTextInRow(best3Row[1], rowCaps[1]),
      centerTextInRow(best3Row[2], rowCaps[2]),
    ];
  }

  // Fallback greedy wrap across 3 rows
  const lines: string[] = ['', '', ''];
  let curRow = 0;
  for (const w of words) {
    if (curRow >= 3) break;
    const test = lines[curRow] ? lines[curRow] + ' ' + w : w;
    if (test.length <= rowCaps[curRow]) {
      lines[curRow] = test;
    } else {
      curRow++;
      if (curRow < 3) {
        lines[curRow] = w.slice(0, rowCaps[curRow]);
      }
    }
  }

  return [
    centerTextInRow(lines[0], rowCaps[0]),
    centerTextInRow(lines[1], rowCaps[1]),
    centerTextInRow(lines[2], rowCaps[2]),
  ];
}

/**
 * Format Answer into balanced grid lines (e.g. 4 rows of 12 or 14 cols)
 */
export function formatAnswerToGrid(answer: string, maxCols: number = 14, maxRows: number = 4): string[][] {
  return formatAnswerTo44Grid(answer);
}
