import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Eye,
  SkipForward,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { GameState, SOCKET_EVENTS } from '../types';
import { socket } from '../socket';
import { QuestionManagerPanel } from './QuestionManagerPanel';
import { WheelCustomizerPanel } from './WheelCustomizerPanel';

interface Props {
  state: GameState;
}

type Section = 'action' | 'questions' | 'wheel' | null;

function SectionHeader({
  icon,
  label,
  open,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full text-left p-3 flex items-center justify-between font-bold text-sm text-slate-300">
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
    </button>
  );
}

export function ControlPanel({ state }: Props) {
  const [letter, setLetter] = useState('');
  const [openSection, setOpenSection] = useState<Section>(null);
  const [pointValue, setPointValue] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const toggleSection = (section: Section) => setOpenSection((prev) => (prev === section ? null : section));

  const activeTeam = state.teams.find((t) => t.id === state.activeTeamId);
  const activeTeamEliminated = !!(state.activeTeamId && state.enterUsedByTeam[state.activeTeamId]);

  const submitLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letter.trim()) return;
    socket.emit(SOCKET_EVENTS.ADMIN_INPUT_LETTER, { letter });
    setLetter('');
    inputRef.current?.focus();
  };

  const sendAction = (actionType: string, value?: number) => {
    socket.emit(SOCKET_EVENTS.ADMIN_ACTION, { actionType, value });
  };

  return (
    <div className="w-full bg-slate-900/80 rounded-xl xl:rounded-2xl border border-slate-800/80 p-3 xl:p-4 backdrop-blur-sm shadow-xl flex flex-col gap-3 text-sm">
      {activeTeamEliminated && activeTeam && (
        <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-700/60 text-rose-300 text-sm font-bold text-center">
          ⚠ {activeTeam.name} đã trả lời sai — không thể chơi tiếp câu này
        </div>
      )}

      {state.pointsAtStake !== null && activeTeam && (
        <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 text-sm font-bold text-center">
          🎯 {activeTeam.name} đọc 1 chữ cái — quay được <strong>{state.pointsAtStake}</strong> điểm/chữ. Gõ vào ô "Nhập chữ" để kiểm tra!
        </div>
      )}

      {/* Toolbar: câu hỏi hiện tại + fullscreen */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-sm font-bold text-slate-300">
            Chặng <strong className="text-amber-300 font-extrabold">{state.currentPhase}</strong> — Câu{' '}
            <strong className="text-amber-300 font-extrabold">{state.currentQuestionIndex + 1}</strong>/
            {state.questions.filter((q) => q.phase === state.currentPhase).length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (window.confirm('Reset toàn bộ game? Điểm số và tên các đội sẽ về mặc định, quay lại sảnh chờ.')) {
                socket.emit(SOCKET_EVENTS.ADMIN_RESTART_GAME);
              }
            }}
            className="p-2 rounded-lg bg-slate-800/90 hover:bg-rose-900/60 border border-slate-700/80 text-slate-300 hover:text-rose-300 transition-all"
            title="Reset Game"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-cyan-300 transition-all"
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Bộ câu hỏi */}
      <div className="rounded-xl bg-slate-950/70 border border-slate-800/90 overflow-hidden">
        <SectionHeader icon={<BookOpen className="w-4 h-4 text-amber-400" />} label="Bộ câu hỏi" open={openSection === 'questions'} onClick={() => toggleSection('questions')} />
        {openSection === 'questions' && (
          <QuestionManagerPanel questions={state.questions} currentPhase={state.currentPhase} currentQuestionIndex={state.currentQuestionIndex} />
        )}
      </div>

      {/* Ô nón vòng quay */}
      <div className="rounded-xl bg-slate-950/70 border border-slate-800/90 overflow-hidden">
        <SectionHeader icon={<Sliders className="w-4 h-4 text-emerald-400" />} label="Ô nón vòng quay" open={openSection === 'wheel'} onClick={() => toggleSection('wheel')} />
        {openSection === 'wheel' && <WheelCustomizerPanel segments={state.wheelSegments} />}
      </div>

      {/* Nhập chữ */}
      <form onSubmit={submitLetter} className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-400">Nhập chữ:</label>
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={letter}
            onChange={(e) => setLetter(e.target.value.toUpperCase())}
            placeholder="Ê / Ơ / Ă..."
            maxLength={3}
            className="flex-1 min-w-0 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-center text-lg font-black text-white uppercase outline-none transition-colors placeholder:text-slate-600 shadow-inner"
          />
          <button
            type="submit"
            disabled={!letter.trim()}
            className="w-12 h-12 shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black transition-all shadow-md flex items-center justify-center border border-indigo-400/30 active:scale-95"
          >
            <Check className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </form>

      {/* Hành động: cộng/trừ/phạt/mất lượt/bốc thăm cho đội active */}
      <div className="rounded-xl bg-slate-950/70 border border-slate-800/90 overflow-hidden">
        <SectionHeader
          icon={<Sparkles className="w-4 h-4 text-orange-400" />}
          label={`Hành động ${activeTeam ? `(${activeTeam.name})` : ''}`}
          open={openSection === 'action'}
          onClick={() => toggleSection('action')}
        />
        {openSection === 'action' && (
          <div className="p-3 pt-0 flex flex-col gap-2.5">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={pointValue}
                onChange={(e) => setPointValue(Number(e.target.value))}
                className="w-24 rounded-lg px-2.5 py-2 text-slate-900 text-sm bg-white"
              />
              <button
                disabled={!activeTeam}
                onClick={() => sendAction('add', pointValue)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-3 py-2 rounded-lg text-sm"
              >
                Cộng điểm
              </button>
              <button
                disabled={!activeTeam}
                onClick={() => sendAction('subtract', pointValue)}
                className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold px-3 py-2 rounded-lg text-sm"
              >
                Trừ điểm
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                disabled={!activeTeam}
                onClick={() => sendAction('penalty')}
                className="bg-rose-800 hover:bg-rose-700 disabled:opacity-40 text-white font-bold px-2 py-2 rounded-lg text-xs"
              >
                Phạt
              </button>
              <button
                disabled={!activeTeam}
                onClick={() => sendAction('skipTurn')}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white font-bold px-2 py-2 rounded-lg text-xs"
              >
                Mất lượt
              </button>
              <button
                disabled={!activeTeam}
                onClick={() => sendAction('luckyDraw')}
                className="bg-violet-700 hover:bg-violet-600 disabled:opacity-40 text-white font-bold px-2 py-2 rounded-lg text-xs"
              >
                Bốc thăm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Xử lý khi có đội xin trả lời toàn bộ (Enter) */}
      {state.phase === 'solving' && state.solvingTeamId && (
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 space-y-2.5">
          <p className="text-sm font-bold text-amber-300">
            {state.teams.find((t) => t.id === state.solvingTeamId)?.name} đang xin trả lời toàn bộ!
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => socket.emit(SOCKET_EVENTS.ADMIN_RESOLVE_SOLVE, { correct: true })}
              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm"
            >
              Đúng
            </button>
            <button
              onClick={() => socket.emit(SOCKET_EVENTS.ADMIN_RESOLVE_SOLVE, { correct: false })}
              className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm"
            >
              Sai
            </button>
          </div>
        </div>
      )}

      {/* Mở hết / Câu tiếp */}
      <div className="pt-1 grid grid-cols-2 gap-2">
        <button
          onClick={() => socket.emit(SOCKET_EVENTS.ADMIN_SHOW_ANSWER)}
          className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-sm transition-colors flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Eye className="w-4 h-4 text-slate-400" />
          <span>Mở hết</span>
        </button>
        <button
          onClick={() => socket.emit(SOCKET_EVENTS.ADMIN_NEXT_QUESTION)}
          className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-sm transition-colors flex items-center justify-center gap-1.5 active:scale-95"
        >
          <SkipForward className="w-4 h-4 text-slate-400" />
          <span>Câu tiếp</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Chiếc Nón Kì Quặc</span>
      </div>
    </div>
  );
}
