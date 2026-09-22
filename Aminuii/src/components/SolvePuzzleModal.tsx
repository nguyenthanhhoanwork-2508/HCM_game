import React, { useState } from 'react';
import { X, Sparkles, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { stripAllAccents } from '../utils/vietnamese';

interface SolvePuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctAnswer: string;
  activeTeamName: string;
  onSuccess: (bonusPoints: number) => void;
  onFailure: () => void;
}

export const SolvePuzzleModal: React.FC<SolvePuzzleModalProps> = ({
  isOpen,
  onClose,
  correctAnswer,
  activeTeamName,
  onSuccess,
  onFailure,
}) => {
  const [guessInput, setGuessInput] = useState('');
  const [resultStatus, setResultStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim()) return;

    // Compare with both raw normalization and accent-stripped normalization
    const cleanGuess = guessInput.trim().toUpperCase().replace(/\s+/g, ' ');
    const cleanAnswer = correctAnswer.trim().toUpperCase().replace(/\s+/g, ' ');

    const matchExact = cleanGuess === cleanAnswer;
    const matchStripped = stripAllAccents(cleanGuess) === stripAllAccents(cleanAnswer);

    if (matchExact || matchStripped) {
      setResultStatus('correct');
      sound.playVictory();

      // Launch victory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
      });

      setTimeout(() => {
        onSuccess(1000);
        onClose();
        setResultStatus('idle');
        setGuessInput('');
      }, 1800);
    } else {
      setResultStatus('wrong');
      sound.playWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Đoán Cả Ô Chữ
            </h3>
            <p className="text-xs text-slate-400">
              Cơ hội về đích giành trọn vẹn điểm số cho <strong className="text-amber-300">{activeTeamName}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nhập đáp án toàn bộ ô chữ:
            </label>
            <input
              type="text"
              autoFocus
              value={guessInput}
              onChange={(e) => {
                setGuessInput(e.target.value);
                if (resultStatus !== 'idle') setResultStatus('idle');
              }}
              placeholder="Ví dụ: HỘI ĐỀN HÙNG..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-bold text-white uppercase outline-none transition-colors placeholder:text-slate-600"
            />
          </div>

          {resultStatus === 'correct' && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>CHÍNH XÁC! Chúc mừng đội đã giải thành công ô chữ (+1000 điểm)!</span>
            </div>
          )}

          {resultStatus === 'wrong' && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Rất tiếc, chưa chính xác!</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onFailure();
                  onClose();
                  setResultStatus('idle');
                  setGuessInput('');
                }}
                className="px-2 py-1 rounded bg-rose-800/80 hover:bg-rose-700 text-white text-[11px] font-bold"
              >
                Chuyển lượt
              </button>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!guessInput.trim() || resultStatus === 'correct'}
              className="px-5 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 transition-all shadow-lg shadow-amber-400/20"
            >
              Kiểm tra đáp án
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
