import React from 'react';
import { X } from 'lucide-react';

interface LetterKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onGuessLetter: (letter: string) => void;
  guessedLetters: string[];
  pointsAtStake: number;
  currentTeamName: string;
}

const VIETNAMESE_ALPHABET = [
  'A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G',
  'H', 'I', 'K', 'L', 'M', 'N', 'O', 'Ô', 'Ơ', 'P',
  'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'
];

export const LetterKeyboard: React.FC<LetterKeyboardProps> = ({
  isOpen,
  onClose,
  onGuessLetter,
  guessedLetters,
  pointsAtStake,
  currentTeamName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b1633] border-2 border-emerald-400/80 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(16,185,129,0.3)] relative flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h3 className="text-xl sm:text-2xl font-black text-white font-display mb-1 text-center">
          CHỌN MỘT CHỮ CÁI
        </h3>

        {/* Status / Points Info */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs sm:text-sm text-slate-300">
            Lượt của: <span className="text-amber-300 font-bold">{currentTeamName}</span>
          </span>
          <span className="text-slate-500">•</span>
          <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-xs sm:text-sm font-semibold">
            Điểm ô chữ: +{pointsAtStake} điểm/chữ
          </div>
        </div>

        {/* Alphabet Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-2.5 w-full mb-6">
          {VIETNAMESE_ALPHABET.map((char) => {
            const isUsed = guessedLetters.includes(char);
            return (
              <button
                key={char}
                onClick={() => !isUsed && onGuessLetter(char)}
                disabled={isUsed}
                className={`h-11 sm:h-13 rounded-xl font-display font-black text-base sm:text-lg flex items-center justify-center transition-all ${
                  isUsed
                    ? 'bg-slate-900/60 border border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-[#122247] hover:bg-emerald-500 hover:text-slate-950 border border-slate-600 hover:border-emerald-300 text-white shadow-md active:scale-95'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 text-center">
          Mẹo: Bạn cũng có thể bấm phím chữ cái trực tiếp trên bàn phím máy tính.
        </p>
      </div>
    </div>
  );
};
