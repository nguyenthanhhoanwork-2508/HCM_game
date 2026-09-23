import { Trophy, Ban } from 'lucide-react';
import { Team } from '../types';

// One accent color per team slot, mirrors the Aminuii palette.
const TEAM_COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#f97316', '#a855f7'];

interface Props {
  teams: Team[];
  activeTeamId: number | null;
  onSelectTeam?: (teamId: number) => void;
  eliminatedTeamIds?: number[];
}

export function ScoreBoard({ teams, activeTeamId, onSelectTeam, eliminatedTeamIds = [] }: Props) {
  const maxScore = Math.max(...teams.map((t) => t.score));

  return (
    <div className="w-full h-full bg-slate-900/80 rounded-xl xl:rounded-2xl border border-slate-800/80 p-2.5 sm:p-3 xl:p-3.5 backdrop-blur-sm shadow-xl flex flex-col justify-between select-none overflow-y-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-2 pb-2 mb-1 border-b border-slate-800/80 shrink-0">
          <Trophy className="w-4 h-4 xl:w-5 xl:h-5 text-amber-400 shrink-0" />
          <span className="text-xs xl:text-sm font-extrabold uppercase tracking-wider text-slate-200 truncate">
            THỨ TỰ CHƠI &amp; BẢNG ĐIỂM
          </span>
        </div>

        <div className="space-y-2 xl:space-y-2.5">
          {teams.map((team, i) => {
            const isActive = team.id === activeTeamId;
            const isLeader = maxScore > 0 && team.score === maxScore;
            const isEliminated = eliminatedTeamIds.includes(team.id);
            const color = TEAM_COLORS[i % TEAM_COLORS.length];

            return (
              <div
                key={team.id}
                onClick={() => onSelectTeam?.(team.id)}
                className={`p-2.5 sm:p-3 rounded-xl transition-all border flex flex-col gap-1 relative shadow-sm ${
                  onSelectTeam ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isEliminated
                    ? 'bg-rose-950/40 border-rose-800/60 opacity-75'
                    : isActive
                    ? 'bg-amber-500/15 border-amber-400/60 shadow-lg ring-1 ring-amber-400/40'
                    : 'bg-slate-950/60 hover:bg-slate-800/50 border-slate-800/90'
                }`}
              >
                {isEliminated ? (
                  <span className="absolute -top-2 -right-1 text-[9px] xl:text-[10px] font-black uppercase text-white bg-rose-600 px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Ban className="w-2.5 h-2.5" /> Đã bị loại
                  </span>
                ) : (
                  isActive && (
                    <span className="absolute -top-2 -right-1 text-[9px] xl:text-[10px] font-black uppercase text-slate-950 bg-amber-400 px-1.5 py-0.5 rounded-full shadow-md">
                      Lượt này
                    </span>
                  )
                )}

                <div className="flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[10px] xl:text-xs font-black text-slate-500 tabular-nums shrink-0">#{i + 1}</span>
                    <span className="w-2.5 h-2.5 xl:w-3 xl:h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: color }} />
                    <span className="text-xs sm:text-sm xl:text-base font-bold text-slate-200 truncate">{team.name}</span>
                    {isLeader && <Trophy className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-amber-400 shrink-0" />}
                  </div>
                </div>

                <div className="flex items-baseline justify-end pt-1">
                  <span
                    className={`text-xl sm:text-2xl xl:text-3xl font-black tracking-tight ${
                      team.score > 0 ? 'text-emerald-400' : team.score < 0 ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  >
                    {team.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 text-[10px] xl:text-xs text-slate-500 text-center shrink-0">
        <span>
          Tổng cộng: <strong className="text-slate-300">{teams.length}</strong> đội chơi
        </span>
      </div>
    </div>
  );
}
