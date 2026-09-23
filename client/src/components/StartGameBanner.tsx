import { Play } from 'lucide-react';

interface Props {
  onStart: () => void;
}

// Non-blocking banner for Admin while the game hasn't started yet — gives
// the admin time to brief players before pressing Start. ControlPanel stays
// reachable underneath so they can still tweak questions/wheel first.
export function StartGameBanner({ onStart }: Props) {
  return (
    <div className="relative z-20 mx-2 sm:mx-2.5 xl:mx-3.5 mt-2 sm:mt-2.5 xl:mt-3.5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/50 flex items-center justify-between gap-3 flex-wrap">
      <span className="text-sm font-bold text-emerald-200">
        Sẵn sàng bắt đầu Chặng 0. Thứ tự chơi sẽ được xáo trộn khi bấm bắt đầu.
      </span>
      <button
        onClick={onStart}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-sm inline-flex items-center gap-1.5 active:scale-95 shrink-0"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>Bắt đầu Chặng 0</span>
      </button>
    </div>
  );
}
