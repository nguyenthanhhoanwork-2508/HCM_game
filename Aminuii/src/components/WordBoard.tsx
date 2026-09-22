import React from 'react';
import { HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Question } from '../types';
import { formatAnswerTo44Grid, charMatchesGuess } from '../utils/vietnamese';

interface WordBoardProps {
  question: Question;
  guessedLetters: Set<string>;
  revealedAll: boolean;
  onTileClick?: (char: string) => void;
  exactVowels?: boolean;
}

export const WordBoard: React.FC<WordBoardProps> = ({
  question,
  guessedLetters,
  revealedAll,
  onTileClick,
  exactVowels = true,
}) => {
  // Authentic Chiếc Nón Kỳ Diệu board: 3 rows, 44 boxes total (14 - 16 - 14)
  const grid = React.useMemo(() => {
    return formatAnswerTo44Grid(question.answer);
  }, [question.answer]);

  // Total non-space letters
  const totalLetters = React.useMemo(() => {
    return question.answer.replace(/\s+/g, '').length;
  }, [question.answer]);

  // Count uncovered letters
  const revealedCount = React.useMemo(() => {
    if (revealedAll) return totalLetters;
    let count = 0;
    const cleanAnswer = question.answer.replace(/\s+/g, '');
    for (const char of cleanAnswer) {
      const isGuessed = Array.from(guessedLetters).some((g) =>
        charMatchesGuess(char, g, exactVowels)
      );
      if (isGuessed) count++;
    }
    return count;
  }, [question.answer, guessedLetters, revealedAll, exactVowels, totalLetters]);

  const isCompleted = revealedCount === totalLetters;

  // Well-proportioned, expansive tile sizing for full-screen display
  const tileSizeClass =
    'w-6 h-8 sm:w-8 sm:h-11 md:w-10 md:h-13 lg:w-11 lg:h-15 xl:w-13 xl:h-18 2xl:w-15 2xl:h-20';
  const letterTextClass =
    'text-base sm:text-xl md:text-2xl xl:text-3xl font-black font-sans';

  return (
    <div className="w-full flex flex-col items-center">
      {/* Category and Question Header Card */}
      <div className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl px-3 py-2 sm:px-4 sm:py-2.5 xl:py-3 mb-2 rounded-xl xl:rounded-2xl">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 xl:px-3 xl:py-1 rounded-full text-[10px] xl:text-xs font-black tracking-widest uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300">
              {question.category || 'CHỦ ĐỀ Ô CHỮ'}
            </span>
            <span className="text-xs xl:text-sm text-slate-400 font-medium hidden sm:inline">
              Gồm <strong className="text-white font-bold">{totalLetters}</strong> chữ cái
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 xl:px-3 xl:py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs xl:text-sm">
              <span className="text-slate-400">Tiến độ:</span>
              <span className="font-bold font-mono text-amber-300">
                {revealedCount}/{totalLetters}
              </span>
              {isCompleted && (
                <CheckCircle2 className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-emerald-400 ml-0.5" />
              )}
            </div>
          </div>
        </div>

        {/* Question prompt / clue */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <HelpCircle className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
          </div>
          <p className="text-xs sm:text-sm md:text-base xl:text-lg 2xl:text-xl font-bold text-slate-100 tracking-wide leading-snug line-clamp-2">
            {question.hint}
          </p>
        </div>
      </div>

      {/* Crossword Studio Grid Board: 3 rows, 44 boxes */}
      <div className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] bg-gradient-to-b from-[#0a1f1b] via-[#061915] to-[#041210] border-2 border-emerald-900/90 shadow-2xl shadow-emerald-950/60 rounded-2xl xl:rounded-3xl p-2.5 sm:p-3 xl:p-4 relative overflow-hidden">
        {/* Ambient subtle back glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Grid matrix container: 3 rows (Row 0: 14, Row 1: 16, Row 2: 14) */}
        <div className="flex flex-col gap-1.5 sm:gap-2 xl:gap-2.5">
          {grid.map((row, rIdx) => (
            <div key={`row-${rIdx}`} className="flex justify-center gap-1 sm:gap-1.5 xl:gap-2">
              {row.map((char, cIdx) => {
                const isLetter = char !== '' && char !== ' ';
                const isRevealed =
                  revealedAll ||
                  (isLetter &&
                    Array.from(guessedLetters).some((g) =>
                      charMatchesGuess(char, g, exactVowels)
                    ));

                if (!isLetter) {
                  return (
                    <div
                      key={`cell-${rIdx}-${cIdx}`}
                      className={`${tileSizeClass} rounded-lg xl:rounded-xl bg-[#06241e]/80 border border-emerald-900/60 shadow-inner flex items-center justify-center opacity-85`}
                    />
                  );
                }

                return (
                  <div
                    key={`cell-${rIdx}-${cIdx}`}
                    onClick={() => onTileClick && onTileClick(char)}
                    className={`${tileSizeClass} perspective-1000 cursor-pointer select-none group`}
                    title={isRevealed ? `Chữ cái: ${char}` : 'Ô chữ bí mật (Bấm để lật)'}
                  >
                    <div
                      className={`relative w-full h-full duration-500 transform-style-3d rounded-lg xl:rounded-xl transition-transform ${
                        isRevealed ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* Front face: Hidden active tile */}
                      <div className="absolute inset-0 backface-hidden rounded-lg xl:rounded-xl bg-gradient-to-b from-white to-slate-100 border-2 border-emerald-400 shadow-md shadow-emerald-500/20 flex items-center justify-center group-hover:border-amber-400 transition-colors">
                        <div className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-emerald-600/50 group-hover:bg-amber-500" />
                      </div>

                      {/* Back face: Revealed letter tile */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg xl:rounded-xl bg-white border-2 border-amber-400 shadow-lg shadow-amber-500/30 flex items-center justify-center">
                        <span className={`text-slate-900 ${letterTextClass}`}>
                          {char}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Board completion banner */}
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
};
