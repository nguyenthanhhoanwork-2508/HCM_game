import React, { useState } from 'react';
import { Plus, Trash2, Check, Trophy } from 'lucide-react';
import { Team } from '../types';

interface ScoreboardProps {
  teams: Team[];
  activeTeamId: string;
  onSelectActiveTeam: (teamId: string) => void;
  onUpdateTeamScore: (teamId: string, delta: number) => void;
  onUpdateTeamName: (teamId: string, newName: string) => void;
  onAddTeam: () => void;
  onRemoveTeam: (teamId: string) => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  teams,
  activeTeamId,
  onSelectActiveTeam,
  onUpdateTeamName,
  onAddTeam,
  onRemoveTeam,
}) => {
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  const startEdit = (team: Team, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTeamId(team.id);
    setEditNameValue(team.name);
  };

  const saveEdit = (teamId: string, e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.stopPropagation();
    if (editNameValue.trim()) {
      onUpdateTeamName(teamId, editNameValue.trim());
    }
    setEditingTeamId(null);
  };

  // Find max score for leader indicator
  const maxScore = Math.max(...teams.map((t) => t.score));

  return (
    <div className="w-full h-full bg-slate-900/80 rounded-xl xl:rounded-2xl border border-slate-800/80 p-2.5 sm:p-3 xl:p-3.5 backdrop-blur-sm shadow-xl flex flex-col justify-between select-none overflow-y-auto">
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Trophy className="w-4 h-4 xl:w-5 xl:h-5 text-amber-400 shrink-0" />
            <span className="text-xs xl:text-sm font-extrabold uppercase tracking-wider text-slate-200 truncate">
              BẢNG ĐIỂM
            </span>
          </div>

          {teams.length < 6 && (
            <button
              id="btn-add-team"
              onClick={onAddTeam}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
              title="Thêm đội chơi"
            >
              <Plus className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
            </button>
          )}
        </div>

        {/* Vertical Stack of Team Score Cards */}
        <div className="space-y-2 xl:space-y-2.5">
          {teams.map((team) => {
            const isActive = team.id === activeTeamId;
            const isLeader = maxScore > 0 && team.score === maxScore;

            return (
              <div
                key={team.id}
                id={`team-card-${team.id}`}
                onClick={() => onSelectActiveTeam(team.id)}
                className={`p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all border flex flex-col gap-1 relative shadow-sm ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-400/60 shadow-lg ring-1 ring-amber-400/40'
                    : 'bg-slate-950/60 hover:bg-slate-800/50 border-slate-800/90'
                }`}
              >
                {/* Active marker pill */}
                {isActive && (
                  <span className="absolute -top-2 -right-1 text-[9px] xl:text-[10px] font-black uppercase text-slate-950 bg-amber-400 px-1.5 py-0.5 rounded-full shadow-md">
                    Lượt này
                  </span>
                )}

                {/* Team Name header */}
                <div className="flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="w-2.5 h-2.5 xl:w-3 xl:h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: team.color }}
                    />

                    {editingTeamId === team.id ? (
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(team.id);
                          }}
                          autoFocus
                          className="bg-slate-950 border border-amber-500/60 rounded px-1.5 py-0.5 text-xs xl:text-sm text-white outline-none w-20"
                        />
                        <button
                          onClick={(e) => saveEdit(team.id, e)}
                          className="p-1 text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span
                        className="text-xs sm:text-sm xl:text-base font-bold text-slate-200 truncate cursor-text hover:text-amber-300 transition-colors"
                        onClick={(e) => startEdit(team, e)}
                        title="Bấm để đổi tên đội"
                      >
                        {team.name}
                      </span>
                    )}
                  </div>

                  {teams.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTeam(team.id);
                      }}
                      className="opacity-0 hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity"
                      title="Xóa đội"
                    >
                      <Trash2 className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                    </button>
                  )}
                </div>

                {/* Score Number Display */}
                <div className="flex items-baseline justify-end pt-1">
                  <span
                    className={`text-xl sm:text-2xl xl:text-3xl font-black font-mono-numbers tracking-tight ${
                      team.score > 0
                        ? 'text-emerald-400'
                        : team.score < 0
                        ? 'text-rose-400'
                        : 'text-slate-400'
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

      {/* Footer subtle counter */}
      <div className="pt-2 border-t border-slate-800/80 text-[10px] xl:text-xs text-slate-500 text-center shrink-0">
        <span>Tổng cộng: <strong className="text-slate-300">{teams.length}</strong> đội chơi</span>
      </div>
    </div>
  );
};
