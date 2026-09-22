import { PartyPopper, ArrowRight } from 'lucide-react';
import { Team } from '../types';

interface Props {
  teams: Team[];
  onContinue?: () => void; // provided by Admin only; Player sees a read-only screen
  hasPhase2Questions: boolean;
}

export function PhaseCompleteBoard({ teams, onContinue, hasPhase2Questions }: Props) {
  const ranked = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl text-center">
        <PartyPopper className="w-14 h-14 mx-auto text-amber-400 mb-2" />
        <h1 className="text-3xl sm:text-4xl font-black text-amber-300 tracking-wide mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          CHÚC MỪNG HOÀN THÀNH CHẶNG 1!
        </h1>
        <p className="text-slate-400 text-sm mb-6">Điểm số hiện tại của các đội</p>

        <div className="space-y-2 mb-6">
          {ranked.map((team, i) => (
            <div
              key={team.id}
              className={`flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border ${
                i === 0 ? 'bg-amber-500/15 border-amber-400/70' : 'bg-slate-900/80 border-slate-700/60'
              }`}
            >
              <span className="text-base sm:text-lg font-bold text-white">{team.name}</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">{team.score.toLocaleString('vi-VN')}</span>
            </div>
          ))}
        </div>

        {onContinue ? (
          <>
            <button
              onClick={onContinue}
              disabled={!hasPhase2Questions}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-400 font-black text-base tracking-wide shadow-lg shadow-amber-500/20 transition-all inline-flex items-center gap-2 active:scale-95"
            >
              <span>Sang Chặng 2</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            {!hasPhase2Questions && (
              <p className="text-rose-400 text-xs mt-2">
                Chưa có câu hỏi nào cho Chặng 2 — mở "Bộ câu hỏi" ở panel Control và thêm câu hỏi, chọn "Chặng 2".
              </p>
            )}
          </>
        ) : (
          <p className="text-slate-500 text-sm">Đang chờ MC chuyển sang Chặng 2...</p>
        )}
      </div>
    </div>
  );
}
