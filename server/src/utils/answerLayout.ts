import { AnswerCell } from '../types';

// 4-row board: 10 + 12 + 12 + 10 = 44 cells, narrower on top/bottom, wider in the middle.
const ROW_WIDTHS = [10, 12, 12, 10];
const ROW_SETS = [[1], [1, 2], [0, 1, 2], [1, 2, 3], [0, 1, 2, 3]];

function centerRow(text: string, rowIndex: number): AnswerCell[] {
  // Invalid legacy data can contain a single word wider than every board row.
  // Expand that exceptional row instead of silently cutting letters off.
  const width = Math.max(ROW_WIDTHS[rowIndex], text.length);
  const chars = text.split('');
  const padLeft = Math.floor((width - chars.length) / 2);
  const offset = ROW_WIDTHS.slice(0, rowIndex).reduce((a, b) => a + b, 0);
  const cells: AnswerCell[] = [];
  for (let i = 0; i < width; i++) {
    const charIdx = i - padLeft;
    const raw = charIdx >= 0 && charIdx < chars.length ? chars[charIdx] : null;
    const char = raw && raw !== ' ' ? raw.toUpperCase() : null; // a space still consumes one cell
    cells.push({ index: offset + i, row: rowIndex, char });
  }
  return cells;
}

interface RowPlan {
  rowIndexes: number[];
  texts: string[];
  score: number;
}

function findBestPlanForRows(words: string[], rowIndexes: number[]): RowPlan | null {
  if (words.length < rowIndexes.length) return null;

  let best: RowPlan | null = null;
  const texts: string[] = [];

  const visit = (rowPosition: number, wordStart: number) => {
    const remainingRows = rowIndexes.length - rowPosition;
    const maxEnd = words.length - (remainingRows - 1);

    for (let end = wordStart + 1; end <= maxEnd; end++) {
      const text = words.slice(wordStart, end).join(' ');
      if (text.length > ROW_WIDTHS[rowIndexes[rowPosition]]) break;

      texts[rowPosition] = text;
      if (rowPosition === rowIndexes.length - 1) {
        if (end !== words.length) continue;
        const averageLength = texts.reduce((sum, line) => sum + line.length, 0) / texts.length;
        const score = texts.reduce((sum, line) => sum + Math.pow(line.length - averageLength, 2), 0);
        if (!best || score < best.score) {
          best = { rowIndexes: [...rowIndexes], texts: [...texts], score };
        }
      } else {
        visit(rowPosition + 1, end);
      }
    }
  };

  visit(0, 0);
  return best;
}

function findWordBoundaryPlan(words: string[]): RowPlan | null {
  for (let rowCount = 1; rowCount <= ROW_WIDTHS.length; rowCount++) {
    const candidates = ROW_SETS
      .filter((rowIndexes) => rowIndexes.length === rowCount)
      .map((rowIndexes) => findBestPlanForRows(words, rowIndexes))
      .filter((plan): plan is RowPlan => plan !== null);
    if (candidates.length > 0) {
      return candidates.reduce((best, plan) => (plan.score < best.score ? plan : best));
    }
  }
  return null;
}

function fallbackWholeWordRows(words: string[]): string[] {
  const rows = ROW_WIDTHS.map(() => '');
  let row = 0;
  for (const word of words) {
    const candidate = rows[row] ? `${rows[row]} ${word}` : word;
    if (row < ROW_WIDTHS.length - 1 && candidate.length > ROW_WIDTHS[row]) row += 1;
    rows[row] = rows[row] ? `${rows[row]} ${word}` : word;
  }
  return rows;
}

/**
 * Build the fixed 44-cell board while using only as many content rows as the
 * answer requires. Whitespace is normalized to a single spacer cell. Lines
 * are balanced, but may break only at those spaces, never inside a word.
 */
export function buildAnswerLayout(answer: string): AnswerCell[] {
  const normalizedAnswer = answer.trim().replace(/\s+/g, ' ');
  const words = normalizedAnswer ? normalizedAnswer.split(' ') : [];
  const plan = findWordBoundaryPlan(words);
  const rowTexts = plan ? ROW_WIDTHS.map(() => '') : fallbackWholeWordRows(words);

  plan?.rowIndexes.forEach((row, index) => {
    rowTexts[row] = plan.texts[index];
  });

  return rowTexts.flatMap((text, row) => centerRow(text, row));
}
