import { AnswerCell } from '../types';

// 4-row board: 10 + 12 + 12 + 10 = 44 cells, narrower on top/bottom, wider in the middle.
const ROW_WIDTHS = [10, 12, 12, 10];
// When distributing words evenly, give the extra word(s) to these rows first
// (middle rows have more room), in this priority order.
const EXTRA_WORD_PRIORITY = [1, 2, 0, 3];

function centerRow(text: string, rowIndex: number): AnswerCell[] {
  const width = ROW_WIDTHS[rowIndex];
  const chars = text.split('');
  const padLeft = Math.floor((width - chars.length) / 2);
  const offset = ROW_WIDTHS.slice(0, rowIndex).reduce((a, b) => a + b, 0);
  const cells: AnswerCell[] = [];
  for (let i = 0; i < width; i++) {
    const charIdx = i - padLeft;
    const raw = charIdx >= 0 && charIdx < chars.length ? chars[charIdx] : null;
    const char = raw && raw !== ' ' ? raw.toUpperCase() : null; // space = spacer, no tile
    cells.push({ index: offset + i, row: rowIndex, char });
  }
  return cells;
}

/**
 * Build 44-cell / 4-row layout for an answer (rows of 10/12/12/10 cells).
 * Words are distributed evenly across the 4 rows (extra words go to the
 * wider middle rows first), each row centered independently. Falls back to
 * a sequential greedy wrap (respecting each row's width) if the balanced
 * split would overflow any row.
 */
export function buildAnswerLayout(answer: string): AnswerCell[] {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const rowCount = ROW_WIDTHS.length;

  const rowWordCounts = new Array(rowCount).fill(Math.floor(words.length / rowCount));
  let remainder = words.length % rowCount;
  for (const rowIdx of EXTRA_WORD_PRIORITY) {
    if (remainder <= 0) break;
    rowWordCounts[rowIdx] += 1;
    remainder -= 1;
  }

  let rowsWords: string[][] = [];
  let cursor = 0;
  for (let r = 0; r < rowCount; r++) {
    rowsWords.push(words.slice(cursor, cursor + rowWordCounts[r]));
    cursor += rowWordCounts[r];
  }

  const overflowed = rowsWords.some((rw, i) => rw.join(' ').length > ROW_WIDTHS[i]);
  if (overflowed) {
    // Fallback: sequential greedy wrap respecting each row's own width.
    rowsWords = ROW_WIDTHS.map(() => []);
    let row = 0;
    let acc = '';
    for (const w of words) {
      const candidate = acc ? `${acc} ${w}` : w;
      if (row < rowCount - 1 && candidate.length > ROW_WIDTHS[row]) {
        row += 1;
        acc = w;
        rowsWords[row].push(w);
      } else {
        acc = candidate;
        rowsWords[row].push(w);
      }
    }
  }

  return rowsWords.flatMap((rw, i) => centerRow(rw.join(' '), i));
}
