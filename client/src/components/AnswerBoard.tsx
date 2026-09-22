import { HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { AnswerCell } from '../types';

interface Props {
  layout: AnswerCell[];
  structureRevealed: boolean;
  revealedChars: string[];
  question: string;
  displayAnswer: string;
}

const TILE_SIZE = 'w-6 h-8 sm:w-8 sm:h-11 md:w-9 md:h-12 xl:w-11 xl:h-15 2xl:w-12 2xl:h-16';
const LETTER_TEXT = 'text-base sm:text-lg md:text-xl xl:text-2xl font-black';

export function AnswerBoard({ layout, structureRevealed, revealedChars, question, displayAnswer }: Props) {
  const rowCount = layout.reduce((max, c) => Math.max(max, c.row), 0) + 1;
  const rows = Array.from({ length: rowCount }, (_, r) => layout.filter((c) => c.row === r));

  const letterCells = layout.filter((c) => c.char !== null);
  const totalLetters = letterCells.length;
  const revealedCount = letterCells.filter((c) => revealedChars.includes(c.char as string)).length;
  const isCompleted = totalLetters > 0 && revealedCount === totalLetters;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Question header card */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl px-3 py-2 sm:px-4 sm:py-2.5 xl:py-3 mb-2 rounded-xl xl:rounded-2xl">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5 mb-1.5">
          <span className="px-2.5 py-0.5 xl:px-3 xl:py-1 rounded-full text-[10px] xl:text-xs font-black tracking-widest uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300">
            CHỦ ĐỀ Ô CHỮ
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 xl:px-3 xl:py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs xl:text-sm">
            <span className="text-slate-400">Tiến độ:</span>
            <span className="font-bold font-mono text-amber-300">
              {revealedCount}/{totalLetters}
            </span>
            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-emerald-400 ml-0.5" />}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <HelpCircle className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
          </div>
          <p className="text-xs sm:text-sm md:text-base xl:text-lg font-bold text-slate-100 tracking-wide leading-snug">
            {question}
          </p>
        </div>

        {isCompleted && (
          <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center gap-2">
            <span className="text-[10px] xl:text-xs font-black uppercase tracking-widest text-amber-400">Đáp án:</span>
            <span className="text-sm sm:text-base xl:text-lg font-black text-amber-300">{displayAnswer}</span>
          </div>
        )}
      </div>

      {/* Tile grid */}
      <div className="w-full bg-[#02130f] border-2 border-[#064235] shadow-[0_0_35px_rgba(4,47,38,0.7),inset_0_0_40px_rgba(1,24,19,0.9)] rounded-2xl xl:rounded-3xl p-2.5 sm:p-3 xl:p-4 relative overflow-hidden">
        <div className="flex flex-col gap-1.5 sm:gap-2 xl:gap-2.5">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 xl:gap-2">
              {row.map((cell) => {
                if (cell.char === null) {
                  return (
                    <div
                      key={cell.index}
                      className={`${TILE_SIZE} rounded-lg xl:rounded-xl bg-[#031915] border border-[#063328]`}
                    />
                  );
                }

                const showWhite = structureRevealed;
                const isLetterRevealed = revealedChars.includes(cell.char);

                return (
                  <div key={cell.index} className={`${TILE_SIZE} perspective-1000 select-none group`}>
                    <div
                      className={`relative w-full h-full duration-500 transform-style-3d rounded-lg xl:rounded-xl transition-transform ${
                        showWhite ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* Front: hidden emerald tile, glowing edge */}
                      <div className="absolute inset-0 backface-hidden rounded-lg xl:rounded-xl bg-emerald-700 border border-[#34d399] shadow-[0_0_10px_#10b981,0_0_18px_rgba(52,211,153,0.35)]" />

                      {/* Back: revealed white tile, letter fades in once confirmed */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg xl:rounded-xl bg-white border-2 border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.5)] flex items-center justify-center">
                        <span className={`text-slate-900 ${LETTER_TEXT} transition-opacity duration-300 ${isLetterRevealed ? 'opacity-100' : 'opacity-0'}`}>
                          {cell.char}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {isCompleted && (
          <div className="mt-2.5 pt-2 border-t border-emerald-900/60 flex items-center justify-center gap-2 text-emerald-300 text-xs xl:text-sm font-extrabold tracking-wider animate-pulse">
            <Sparkles className="w-4 h-4 xl:w-5 xl:h-5 text-amber-400" />
            <span>XUẤT SẮC! TOÀN BỘ Ô CHỮ ĐÃ ĐƯỢC GIẢI MÃ!</span>
            <Sparkles className="w-4 h-4 xl:w-5 xl:h-5 text-amber-400" />
          </div>
        )}
      </div>
    </div>
  );
}
