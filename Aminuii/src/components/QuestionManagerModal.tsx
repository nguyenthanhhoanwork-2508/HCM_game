import React, { useState } from 'react';
import { X, Plus, Trash2, Check, BookOpen, Sparkles, RefreshCw } from 'lucide-react';
import { Question } from '../types';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';

interface QuestionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: (newQ: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onResetQuestions: () => void;
}

export const QuestionManagerModal: React.FC<QuestionManagerModalProps> = ({
  isOpen,
  onClose,
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onResetQuestions,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState('');
  const [hint, setHint] = useState('');
  const [answer, setAnswer] = useState('');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !hint.trim() || !answer.trim()) return;

    const newQ: Question = {
      id: `q-${Date.now()}`,
      category: category.trim().toUpperCase(),
      hint: hint.trim(),
      answer: answer.trim().toUpperCase(),
    };

    onAddQuestion(newQ);
    setCategory('');
    setHint('');
    setAnswer('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Quản Lý Bộ Câu Hỏi</h3>
              <p className="text-xs text-slate-400">
                Xem, chọn hoặc thêm câu hỏi và ô chữ mới vào chương trình
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-4">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentQuestionIndex;
            return (
              <div
                key={q.id}
                onClick={() => onSelectQuestion(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-sm ring-1 ring-amber-500/20'
                    : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {q.category}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-amber-400">
                          Đang chơi
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-200 mt-1 truncate">
                      {q.hint}
                    </p>
                    <p className="text-[11px] text-amber-300/80 font-mono font-medium">
                      Đáp án: {q.answer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {questions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteQuestion(q.id);
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Question Expandable Section */}
        {showAddForm ? (
          <form
            onSubmit={handleAddSubmit}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 mb-3 animate-in fade-in"
          >
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Thêm câu hỏi mới
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Chủ đề (Category):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: ĐỊA DANH / LỄ HỘI"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white uppercase outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Đáp án ô chữ (Answer):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: HÀ NỘI BA MƯƠI SÁU PHỐ PHƯỜNG"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white uppercase outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Gợi ý / Câu hỏi (Hint/Clue):
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Thủ đô ngàn năm văn hiến của nước ta?"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Lưu câu hỏi
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm câu hỏi mới</span>
            </button>

            <button
              onClick={onResetQuestions}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
              title="Khôi phục câu hỏi mặc định"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
