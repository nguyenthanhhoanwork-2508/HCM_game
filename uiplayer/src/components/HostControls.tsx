import React, { useState } from 'react';
import { X, RotateCcw, Eye, Play, Plus, Award } from 'lucide-react';
import { QuestionData, Team } from '../types';

interface HostControlsProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionData[];
  currentQuestionId: number;
  onSelectQuestion: (questionId: number) => void;
  teams: Team[];
  onSelectTeamTurn: (teamId: number) => void;
  onUpdateTeamScore: (teamId: number, delta: number) => void;
  onRevealAllTiles: () => void;
  onResetQuestion: () => void;
  onAddCustomQuestion: (question: QuestionData) => void;
}

export const HostControls: React.FC<HostControlsProps> = ({
  isOpen,
  onClose,
  questions,
  currentQuestionId,
  onSelectQuestion,
  teams,
  onSelectTeamTurn,
  onUpdateTeamScore,
  onRevealAllTiles,
  onResetQuestion,
  onAddCustomQuestion,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  if (!isOpen) return null;

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || !customAnswer.trim()) return;

    const words = customAnswer.trim().toUpperCase().split(/\s+/);
    // Simple 3-row mapper
    const row0 = Array(14).fill(null);
    const row1 = Array(14).fill(null);
    const row2 = Array(14).fill(null);

    // Place words in row1 if length <= 14
    let col = 1;
    for (const w of words) {
      if (col + w.length > 13) break;
      for (let i = 0; i < w.length; i++) {
        row1[col + i] = w[i];
      }
      col += w.length + 1;
    }

    const newQ: QuestionData = {
      id: Date.now(),
      number: questions.length + 1,
      category: customCategory || 'CÂU ĐỐ TÙY CHỌN',
      question: customQuestion,
      answer: customAnswer.toUpperCase(),
      rows: [row0, row1, row2],
      revealedLetters: [],
    };

    onAddCustomQuestion(newQ);
    setShowAddForm(false);
    setCustomQuestion('');
    setCustomAnswer('');
    setCustomCategory('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c1838] border border-blue-800 rounded-3xl p-6 sm:p-7 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">BẢNG ĐIỀU KHIỂN GAMESHOW / MC</h3>
              <p className="text-xs text-slate-400">Tùy biến câu hỏi, lượt chơi và điểm số</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Select Question */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
            1. Chọn câu hỏi hiển thị
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {questions.map((q) => {
              const isSelected = q.id === currentQuestionId;
              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQuestion(q.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    isSelected
                      ? 'bg-amber-400/15 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-[#081228] border-slate-700 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">CÂU HỎI SỐ {q.number}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {q.answer}
                    </span>
                  </div>
                  <span className="text-xs line-clamp-1 text-slate-200 font-medium">
                    {q.question}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Team Turn & Scores */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
            2. Quản lý lượt chơi & điểm các đội
          </label>
          <div className="flex flex-col gap-2">
            {teams.map((t) => (
              <div
                key={t.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                  t.isCurrentTurn
                    ? 'bg-amber-400/10 border-amber-400 text-white'
                    : 'bg-[#081228] border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectTeamTurn(t.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      t.isCurrentTurn
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {t.isCurrentTurn ? 'Đang sáng' : 'Bật đèn'}
                  </button>
                  <span className="text-sm font-bold text-white">{t.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-amber-300 min-w-[50px] text-right">
                    {t.score}
                  </span>
                  <button
                    onClick={() => onUpdateTeamScore(t.id, -100)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-400 font-bold text-sm"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onUpdateTeamScore(t.id, 100)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-400 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Board Quick Actions */}
        <div className="mb-6 flex flex-wrap gap-2.5">
          <button
            onClick={onRevealAllTiles}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4" /> Mở toàn bộ ô chữ
          </button>
          <button
            onClick={onResetQuestion}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" /> Đóng lại / Làm mới ô chữ
          </button>
        </div>

        {/* 4. Add Custom Question Toggle */}
        <div>
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-600 hover:border-amber-400 text-slate-400 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Thêm câu hỏi tùy chọn mới
            </button>
          ) : (
            <form onSubmit={handleCreateCustom} className="p-4 rounded-2xl bg-[#081228] border border-slate-700 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase">Tạo câu hỏi mới</h4>
              <input
                type="text"
                placeholder="Câu hỏi (ví dụ: Tên danh lam thắng cảnh...)"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#050b1a] border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="Đáp án (viết hoa không dấu hoặc có dấu, ví dụ: NÚI BÀ ĐEN)"
                value={customAnswer}
                onChange={(e) => setCustomAnswer(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#050b1a] border border-slate-700 text-white text-xs outline-none focus:border-amber-400 uppercase"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                >
                  Lưu câu hỏi
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-white"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
