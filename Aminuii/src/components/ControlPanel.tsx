import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, 
  Eye, 
  SkipForward, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Sliders,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { WheelSegment, Team } from '../types';
import { sound } from '../utils/audio';

interface ControlPanelProps {
  activeTeam: Team;
  currentSpinResult: WheelSegment | null;
  guessedLetters?: Set<string>;
  puzzleAnswer?: string;
  onGuessLetter: (letter: string) => void;
  onOpenSolveModal: () => void;
  onRevealAll: () => void;
  onNextQuestion: () => void;
  onNextTurn: () => void;
  onApplyChallengeScore: (points: number) => void;
  exactVowels: boolean;
  onToggleExactVowels: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenQuestionManager: () => void;
  onOpenWheelManager: () => void;
  onResetGame: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentSpinResult,
  onGuessLetter,
  onOpenSolveModal,
  onRevealAll,
  onNextQuestion,
  onNextTurn,
  onApplyChallengeScore,
  exactVowels,
  onToggleExactVowels,
  currentQuestionIndex,
  totalQuestions,
  isMuted,
  onToggleSound,
  onOpenQuestionManager,
  onOpenWheelManager,
  onResetGame,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputValue.trim().toUpperCase();
    if (!clean) return;

    const letterToCheck = clean.slice(-1);
    onGuessLetter(letterToCheck);
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full bg-slate-900/80 rounded-xl xl:rounded-2xl border border-slate-800/80 p-2.5 sm:p-3 xl:p-4 backdrop-blur-sm shadow-xl flex flex-col gap-3">
      {/* 1. Quick Tools Toolbar: Bộ câu hỏi, Ô nón, Âm thanh, Full màn, Reload */}
      <div className="p-2.5 xl:p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2 shadow-sm">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/70 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-xs xl:text-sm font-bold text-slate-300">
              Câu <strong className="text-amber-300 font-extrabold">{currentQuestionIndex + 1}</strong>/{totalQuestions}
            </span>
          </div>

          <button
            onClick={onToggleExactVowels}
            className={`text-[10px] xl:text-xs font-semibold px-2 py-0.5 xl:py-1 rounded-md border transition-colors ${
              exactVowels
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Bật/Tắt kiểm tra nguyên âm có dấu chuẩn tiếng Việt"
          >
            {exactVowels ? 'Dấu chuẩn' : 'Bỏ qua dấu'}
          </button>
        </div>

        {/* 5 action buttons */}
        <div className="grid grid-cols-5 gap-1.5">
          <button
            id="btn-questions-manager"
            onClick={onOpenQuestionManager}
            className="p-1.5 xl:p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-amber-300 flex flex-col items-center justify-center gap-1 transition-all"
            title="Quản lý Bộ câu hỏi"
          >
            <BookOpen className="w-4 h-4 xl:w-5 xl:h-5 text-amber-400" />
            <span className="text-[10px] xl:text-xs font-bold tracking-tight">Câu hỏi</span>
          </button>

          <button
            id="btn-wheel-manager"
            onClick={onOpenWheelManager}
            className="p-1.5 xl:p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-emerald-300 flex flex-col items-center justify-center gap-1 transition-all"
            title="Tùy chỉnh Ô nón quay"
          >
            <Sliders className="w-4 h-4 xl:w-5 xl:h-5 text-emerald-400" />
            <span className="text-[10px] xl:text-xs font-bold tracking-tight">Ô nón</span>
          </button>

          <button
            id="btn-sound-toggle"
            onClick={() => {
              onToggleSound();
              sound.playTick();
            }}
            className={`p-1.5 xl:p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
              isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700/80 text-slate-300 hover:text-white'
            }`}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 xl:w-5 xl:h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 xl:w-5 xl:h-5 text-indigo-400" />
            )}
            <span className="text-[10px] xl:text-xs font-bold tracking-tight">{isMuted ? 'Tắt' : 'Âm thanh'}</span>
          </button>

          <button
            id="btn-fullscreen-toggle"
            onClick={toggleFullscreen}
            className="p-1.5 xl:p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-cyan-300 flex flex-col items-center justify-center gap-1 transition-all"
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 xl:w-5 xl:h-5 text-cyan-400" />
            ) : (
              <Maximize2 className="w-4 h-4 xl:w-5 xl:h-5 text-cyan-400" />
            )}
            <span className="text-[10px] xl:text-xs font-bold tracking-tight">Full</span>
          </button>

          <button
            id="btn-reload-game"
            onClick={onResetGame}
            className="p-1.5 xl:p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-amber-400 flex flex-col items-center justify-center gap-1 transition-all"
            title="Reload / Bắt đầu lại ván chơi"
          >
            <RotateCcw className="w-4 h-4 xl:w-5 xl:h-5 text-amber-400" />
            <span className="text-[10px] xl:text-xs font-bold tracking-tight">Reload</span>
          </button>
        </div>
      </div>

      {/* 2. Spin Result Status (Only shown if wheel was spun) */}
      {currentSpinResult ? (
        <div className="p-2.5 xl:p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs xl:text-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs xl:text-sm font-semibold">Kết quả nón:</span>
            <span className="font-black text-amber-300 text-sm xl:text-base">
              {currentSpinResult.label}
            </span>
          </div>

          {currentSpinResult.specialAction === 'LOSE_TURN' ? (
            <div className="space-y-1.5 pt-1">
              <p className="text-xs xl:text-sm text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Mất lượt chơi!
              </p>
              <button
                id="btn-next-turn"
                onClick={onNextTurn}
                className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs xl:text-sm transition-colors shadow-md"
              >
                Chuyển lượt tiếp theo
              </button>
            </div>
          ) : currentSpinResult.specialAction === 'SING_SONG' ||
            currentSpinResult.specialAction === 'PUSH_UPS' ? (
            <div className="space-y-1.5 pt-1">
              <p className="text-xs xl:text-sm text-amber-300 font-bold">
                {currentSpinResult.specialAction === 'SING_SONG'
                  ? '🎤 Hát 1 đoạn tự chọn!'
                  : '💪 Thực hiện thử thách thể lực!'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onApplyChallengeScore(200)}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs xl:text-sm font-bold shadow-md"
                >
                  Xong (+200)
                </button>
                <button
                  onClick={onNextTurn}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs xl:text-sm"
                >
                  Bỏ lượt
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[11px] xl:text-xs text-emerald-400 font-semibold">
              👉 Nhập chữ cái và bấm dấu ✓ để kiểm tra!
            </p>
          )}
        </div>
      ) : null}

      {/* 3. Vietnamese Keyboard Input Form with Compact Check Button (Icon only) */}
      <form onSubmit={handleSubmit} className="space-y-1.5">
        <label className="block text-[11px] xl:text-xs font-semibold text-slate-400">
          Nhập chữ từ bàn phím tiếng Việt:
        </label>
        <div className="flex gap-2 items-center">
          <input
            id="input-letter"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            placeholder="A, B, C, Đ, Ê..."
            className="flex-1 min-w-0 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 xl:py-2.5 text-center text-base xl:text-lg font-black text-white uppercase outline-none transition-colors placeholder:text-slate-600 shadow-inner"
          />
          <button
            id="btn-confirm-check"
            type="submit"
            disabled={!inputValue.trim()}
            className="w-10 h-10 sm:w-11 sm:h-11 xl:w-12 xl:h-12 shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black transition-all shadow-md flex items-center justify-center border border-indigo-400/30 active:scale-95"
            title="Kiểm tra chữ cái này"
          >
            <Check className="w-5 h-5 xl:w-6 xl:h-6 stroke-[3]" />
          </button>
        </div>
      </form>

      {/* 4. Game Master Action Buttons */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2">
        <button
          id="btn-solve-puzzle"
          onClick={onOpenSolveModal}
          className="w-full py-2 xl:py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs xl:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 xl:w-5 xl:h-5" />
          <span>Đoán cả ô chữ</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-reveal-all"
            onClick={onRevealAll}
            className="py-2 xl:py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs xl:text-sm transition-colors flex items-center justify-center gap-1.5 active:scale-95"
            title="Mở toàn bộ đáp án"
          >
            <Eye className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400" />
            <span>Mở hết</span>
          </button>

          <button
            id="btn-next-question"
            onClick={onNextQuestion}
            className="py-2 xl:py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs xl:text-sm transition-colors flex items-center justify-center gap-1.5 active:scale-95"
            title="Chuyển sang câu hỏi kế tiếp"
          >
            <SkipForward className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400" />
            <span>Câu tiếp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
