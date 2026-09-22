import { PartyPopper, ArrowRight } from 'lucide-react';

interface Props {
  onContinue: () => void;
  hasPhase2Questions: boolean;
}

// Non-blocking banner for Admin: unlike the full-screen PhaseCompleteBoard
// (shown to players), this leaves the ControlPanel reachable so the admin
// can open "Bộ câu hỏi" and add Chặng 2 questions before continuing.
export function PhaseCompleteBanner({ onContinue, hasPhase2Questions }: Props) {
  return (
    <div className="relative z-20 mx-2 sm:mx-2.5 xl:mx-3.5 mt-2 sm:mt-2.5 xl:mt-3.5 p-3 rounded-xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <PartyPopper className="w-5 h-5 text-amber-400 shrink-0" />
        <span className="text-sm font-bold text-amber-200">
          Chặng 1 đã hoàn thành! {!hasPhase2Questions && '— thêm câu hỏi Chặng 2 ở panel bên phải trước khi tiếp tục.'}
        </span>
      </div>
      <button
        onClick={onContinue}
        disabled={!hasPhase2Questions}
        title={!hasPhase2Questions ? 'Chưa có câu hỏi Chặng 2' : undefined}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-400 font-black text-sm inline-flex items-center gap-1.5 active:scale-95 shrink-0"
      >
        <span>Sang Chặng 2</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
