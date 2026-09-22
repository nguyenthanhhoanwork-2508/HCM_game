import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  HelpCircle, 
  BookOpen, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenQuestionManager: () => void;
  onOpenWheelManager: () => void;
  onOpenRules: () => void;
  onResetGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
  isMuted,
  onToggleSound,
  onOpenQuestionManager,
  onOpenWheelManager,
  onOpenRules,
  onResetGame,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg">
          <Sparkles className="w-5 h-5 text-slate-900 fill-slate-900" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
              CHIẾC NÓN KỲ DIỆU
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
              Vòng {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Trò chơi truyền hình trí tuệ & giải trí
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          id="btn-questions-manager"
          onClick={onOpenQuestionManager}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 transition-all shadow-sm"
          title="Quản lý bộ câu hỏi"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">Bộ câu hỏi</span>
        </button>

        <button
          id="btn-wheel-manager"
          onClick={onOpenWheelManager}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 transition-all shadow-sm"
          title="Chỉnh sửa ô nón quay"
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">Ô nón</span>
        </button>

        <button
          id="btn-sound-toggle"
          onClick={() => {
            onToggleSound();
            sound.playTick();
          }}
          className={`p-2 rounded-lg border transition-all ${
            isMuted
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
              : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/80'
          }`}
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          id="btn-rules-help"
          onClick={onOpenRules}
          className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all"
          title="Luật chơi & Hướng dẫn"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          id="btn-fullscreen-toggle"
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all hidden sm:flex"
          title="Chế độ toàn màn hình"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          id="btn-reset-game"
          onClick={onResetGame}
          className="p-2 rounded-lg bg-slate-800/70 hover:bg-rose-900/40 border border-slate-700/60 text-slate-400 hover:text-rose-300 transition-all ml-1"
          title="Bắt đầu lại ván chơi"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
