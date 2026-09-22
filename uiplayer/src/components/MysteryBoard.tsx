import React from 'react';
import { motion } from 'motion/react';
import { QuestionData } from '../types';
import { isLetterMatch } from '../data/questions';

interface MysteryBoardProps {
  questionData: QuestionData;
  onTileClick?: (char: string) => void;
  revealedAll?: boolean;
}

export const MysteryBoard: React.FC<MysteryBoardProps> = ({
  questionData,
  onTileClick,
  revealedAll = false,
}) => {
  const { question, number, rows, revealedLetters } = questionData;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-3 z-10 flex flex-col items-center">
      {/* Question Card Container matching Image 2 */}
      <div className="w-full bg-[#081533]/80 backdrop-blur-xl border border-blue-900/60 rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center">
        {/* Category / Question Header */}
        <div className="text-center mb-1">
          <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-sky-300/80">
            CÂU HỎI SỐ {number}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white max-w-3xl mb-6 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {question}
        </h2>

        {/* THE MYSTERY LETTER BOARD — EXACT STYLING FROM IMAGE 1 */}
        <div className="w-full overflow-x-auto py-2 flex justify-center scrollbar-none">
          <div className="bg-[#02130f] border-2 border-[#064235] shadow-[0_0_35px_rgba(4,47,38,0.7),inset_0_0_40px_rgba(1,24,19,0.9)] rounded-2xl sm:rounded-3xl p-3 sm:p-5 inline-block min-w-max select-none">
            <div className="flex flex-col gap-2 sm:gap-3">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1.5 sm:gap-2 justify-center">
                  {row.map((tileChar, colIndex) => {
                    const isLetter = tileChar !== null && tileChar.trim() !== '';
                    const isRevealed =
                      isLetter &&
                      (revealedAll ||
                        revealedLetters.some(l => isLetterMatch(tileChar, l)));

                    return (
                      <div
                        key={colIndex}
                        className="w-7 sm:w-11 md:w-12 h-12 sm:h-18 md:h-20 perspective-1000 flex items-center justify-center"
                      >
                        {!isLetter ? (
                          /* Empty Slot from Image 1: Dark rounded squircle with subtle border */
                          <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[#031915] border border-[#063328] transition-colors" />
                        ) : (
                          /* Active Letter Tile from Image 1: Flippable card */
                          <div
                            onClick={() => tileChar && onTileClick?.(tileChar)}
                            className="w-full h-full relative transform-style-3d cursor-pointer transition-transform duration-700 ease-out"
                            style={{
                              transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            }}
                          >
                            {/* FRONT FACE: Hidden Mystery Tile from Image 1 */}
                            {/* Pure white squircle tile with neon emerald glow and centered teal/mint dot */}
                            <div className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl bg-white border border-[#34d399] shadow-[0_0_14px_#10b981,0_0_24px_rgba(52,211,153,0.45)] flex items-center justify-center backface-hidden group">
                              {/* Centered emerald dot matching Image 1 */}
                              <div className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 rounded-full bg-[#40bca1] shadow-[0_0_6px_#34d399] transition-transform duration-300 group-hover:scale-125" />
                            </div>

                            {/* BACK FACE: Revealed Tile with Vietnamese Letter */}
                            <div
                              className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl bg-white border-2 border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.5)] flex items-center justify-center backface-hidden rotate-y-180"
                            >
                              <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 font-display select-none tracking-tight">
                                {tileChar}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Board Letter Progress indicator */}
        <div className="mt-4 flex items-center gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span>Ô chữ bí ẩn ({countTotalLetters(rows)} chữ cái)</span>
          </div>
          <span className="text-slate-500">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-300 font-semibold">
              Đã mở: {countRevealedLetters(rows, revealedLetters, revealedAll)} / {countTotalLetters(rows)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function countTotalLetters(rows: (string | null)[][]): number {
  let count = 0;
  for (const row of rows) {
    for (const cell of row) {
      if (cell && cell.trim() !== '') count++;
    }
  }
  return count;
}

function countRevealedLetters(
  rows: (string | null)[][],
  revealedLetters: string[],
  revealedAll: boolean
): number {
  if (revealedAll) return countTotalLetters(rows);
  let count = 0;
  for (const row of rows) {
    for (const cell of row) {
      if (cell && cell.trim() !== '') {
        if (revealedLetters.some(l => isLetterMatch(cell, l))) {
          count++;
        }
      }
    }
  }
  return count;
}
