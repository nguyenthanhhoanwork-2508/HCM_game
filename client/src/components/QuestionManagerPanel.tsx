import { useState } from 'react';
import { Plus, Trash2, Sparkles, RefreshCw } from 'lucide-react';
import { Question, SOCKET_EVENTS } from '../types';
import { socket } from '../socket';

interface Props {
  questions: Question[];
  currentPhase: 1 | 2;
  currentQuestionIndex: number;
}

function QuestionGroup({
  title,
  list,
  isActivePhase,
  currentQuestionIndex,
}: {
  title: string;
  list: Question[];
  isActivePhase: boolean;
  currentQuestionIndex: number;
}) {
  return (
    <div className="space-y-2">
      <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h5>
      {list.length === 0 && <p className="text-xs text-slate-600 italic">Chưa có câu hỏi nào.</p>}
      {list.map((q, idx) => {
        const isCurrent = isActivePhase && idx === currentQuestionIndex;
        return (
          <div
            key={q.id}
            onClick={() => socket.emit(SOCKET_EVENTS.ADMIN_SELECT_QUESTION, { id: q.id })}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              isCurrent
                ? 'bg-amber-500/10 border-amber-500/40 shadow-sm ring-1 ring-amber-500/20'
                : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  isCurrent ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {idx + 1}
              </span>
              <div className="min-w-0">
                {isCurrent && <span className="text-xs font-bold text-amber-400">Đang chơi</span>}
                <p className="text-sm font-semibold text-slate-200 mt-0.5 truncate">{q.question}</p>
                <p className="text-xs text-amber-300/80 font-mono font-medium">Đáp án: {q.answer}</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                socket.emit(SOCKET_EVENTS.ADMIN_DELETE_QUESTION, { id: q.id });
              }}
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
              title="Xóa câu hỏi này"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Inline expandable panel (lives inside the Control column, no popup/backdrop).
export function QuestionManagerPanel({ questions, currentPhase, currentQuestionIndex }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [displayAnswer, setDisplayAnswer] = useState('');
  const [phase, setPhase] = useState<1 | 2>(1);

  const phase1List = questions.filter((q) => q.phase === 1);
  const phase2List = questions.filter((q) => q.phase === 2);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !answer.trim()) return;
    socket.emit(SOCKET_EVENTS.ADMIN_ADD_QUESTION, {
      question: questionText.trim(),
      answer: answer.trim(),
      displayAnswer: displayAnswer.trim() || answer.trim(),
      phase,
    });
    setQuestionText('');
    setAnswer('');
    setDisplayAnswer('');
    setShowAddForm(false);
  };

  return (
    <div className="p-3 space-y-3">
      <QuestionGroup title="Chặng 1" list={phase1List} isActivePhase={currentPhase === 1} currentQuestionIndex={currentQuestionIndex} />
      <QuestionGroup title="Chặng 2" list={phase2List} isActivePhase={currentPhase === 2} currentQuestionIndex={currentQuestionIndex} />

      {showAddForm ? (
        <form onSubmit={handleAddSubmit} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Thêm câu hỏi mới
          </h4>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Thuộc chặng:</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhase(1)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-bold border ${
                  phase === 1 ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                Chặng 1
              </button>
              <button
                type="button"
                onClick={() => setPhase(2)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-bold border ${
                  phase === 2 ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                Chặng 2
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Câu hỏi / Gợi ý:</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Thủ đô ngàn năm văn hiến của nước ta?"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Đáp án ô chữ (không dấu, hiện trên bảng):</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: HA NOI"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toUpperCase())}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white uppercase outline-none focus:border-amber-400 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Đáp án có dấu (hiện khi đã giải xong):</label>
            <input
              type="text"
              placeholder="Ví dụ: HÀ NỘI"
              value={displayAnswer}
              onChange={(e) => setDisplayAnswer(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-400 font-mono"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3.5 py-2 text-sm font-semibold text-slate-400 hover:text-white">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm">
              Lưu câu hỏi
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm câu hỏi mới</span>
          </button>
          <button
            onClick={() => socket.emit(SOCKET_EVENTS.ADMIN_RESET_QUESTIONS)}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"
            title="Khôi phục câu hỏi mặc định"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Mặc định</span>
          </button>
        </div>
      )}
    </div>
  );
}
