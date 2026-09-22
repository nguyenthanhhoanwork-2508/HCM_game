import { Trophy, Medal, Award, RotateCcw } from 'lucide-react';
import { Team } from '../types';

interface Props {
  teams: Team[];
  onRestart?: () => void; // provided by Admin only; Player sees a read-only screen
}

const RANK_STYLE = [
  { icon: Trophy, color: '#fbbf24', label: 'Hạng Nhất' },
  { icon: Medal, color: '#cbd5e1', label: 'Hạng Nhì' },
  { icon: Award, color: '#d97706', label: 'Hạng Ba' },
];

export function GameOverBoard({ teams, onRestart }: Props) {
  const ranked = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <img src="/logo.png" alt="Chiếc Nón Kì Quặc" className="w-32 mx-auto mb-2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
        <h1 className="text-3xl sm:text-4xl font-black text-amber-300 tracking-wide mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          KẾT THÚC CHƯƠNG TRÌNH
        </h1>
        <p className="text-slate-400 text-sm mb-6">Bảng xếp hạng chung cuộc</p>

        <div className="space-y-2.5">
          {ranked.map((team, i) => {
            const rank = RANK_STYLE[i];
            const Icon = rank?.icon;
            return (
              <div
                key={team.id}
                className={`flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border ${
                  i === 0
                    ? 'bg-amber-500/15 border-amber-400/70 shadow-[0_0_30px_rgba(251,191,36,0.3)] scale-[1.03]'
                    : 'bg-slate-900/80 border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-black text-sm sm:text-base text-slate-300 shrink-0">
                    {i + 1}
                  </span>
                  {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ color: rank.color }} />}
                  <span className="text-base sm:text-xl font-bold text-white text-left truncate">{team.name}</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 shrink-0">{team.score.toLocaleString('vi-VN')}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-slate-500">Cảm ơn các đội đã tham gia!</p>

        {onRestart && (
          <button
            onClick={onRestart}
            className="mt-4 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-sm inline-flex items-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi lại</span>
          </button>
        )}
      </div>
    </div>
  );
}
