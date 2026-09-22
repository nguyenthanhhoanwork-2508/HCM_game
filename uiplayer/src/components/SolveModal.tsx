import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface SolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSolve: (answer: string) => void;
  currentTeamName: string;
  questionText: string;
}

export const SolveModal: React.FC<SolveModalProps> = ({
  isOpen,
  onClose,
  onSubmitSolve,
  currentTeamName,
  questionText,
}) => {
  const [answerInput, setAnswerInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerInput.trim()) {
      onSubmitSolve(answerInput.trim());
      setAnswerInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c1838] border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(245,158,11,0.35)] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h3 className="text-xl sm:text-2xl font-black text-amber-300 font-display mb-1 text-center">
          TRẢ LỜI TOÀN BỘ ĐÁP ÁN
        </h3>

        <div className="flex items-center justify-center gap-1.5 mb-4 text-xs sm:text-sm text-slate-300">
          <span>Đội trả lời:</span>
          <span className="text-amber-300 font-bold">{currentTeamName}</span>
        </div>

        {/* Warning callout matching gameshow rules */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-400/40 mb-5 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Lưu ý quan trọng:</strong> Mỗi câu hỏi chỉ được trả lời toàn bộ đáp án 1 lần duy nhất. Nếu trả lời sai, đội của bạn sẽ bị mất lượt chơi ở câu hỏi này!
          </span>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Câu hỏi:
          </label>
          <p className="text-sm font-medium text-white italic bg-[#081126] p-3 rounded-xl border border-slate-700/60">
            "{questionText}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Nhập đáp án của bạn:
            </label>
            <input
              type="text"
              autoFocus
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Ví dụ: ĐẢO PHÚ QUỐC"
              className="w-full px-4 py-3 rounded-xl bg-[#070f24] border-2 border-slate-600 focus:border-amber-400 text-white font-bold text-lg uppercase outline-none shadow-inner placeholder:text-slate-600 tracking-wider"
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!answerInput.trim()}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-slate-950 transition-all ${
                answerInput.trim()
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Xác nhận đáp án
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
