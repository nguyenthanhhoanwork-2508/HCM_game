import { useState } from 'react';
import { User, Pencil, Check } from 'lucide-react';
import { Team } from '../types';

interface Props {
  teams: Team[];
  activeTeamId: number | null;
  myTeamId: number;
  myTeamName: string;
  onRenameTeam: (name: string) => void;
}

export function PlayerHeader({ teams, activeTeamId, myTeamId, myTeamName, onRenameTeam }: Props) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(myTeamName);

  const startEdit = () => {
    setNameInput(myTeamName);
    setEditing(true);
  };

  const saveEdit = () => {
    const trimmed = nameInput.trim();
    if (trimmed) onRenameTeam(trimmed);
    setEditing(false);
  };

  return (
    <header className="w-full max-w-7xl mx-auto px-4 pt-3 pb-2 flex flex-col md:flex-row items-center justify-between gap-4 z-20 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 select-none">
        <img src="/logo.png" alt="Chiếc Nón Kì Quặc" className="w-24 sm:w-28 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Scoreboard row, display only */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1 px-1 max-w-full">
        {teams.map((team) => {
          const isCurrent = team.id === activeTeamId;
          return (
            <div
              key={team.id}
              className={`flex flex-col items-center justify-center px-4 sm:px-6 py-2 rounded-xl transition-all duration-300 min-w-[76px] sm:min-w-[92px] ${
                isCurrent
                  ? 'bg-[#121c38]/95 border-2 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)] ring-1 ring-amber-300/40 -translate-y-0.5'
                  : 'bg-[#0d1733]/75 border border-slate-700/60 text-slate-200'
              } ${team.id === myTeamId ? 'ring-1 ring-sky-400/50' : ''}`}
            >
              <span className={`text-xs sm:text-sm font-medium truncate max-w-[100px] ${isCurrent ? 'text-amber-200 font-semibold' : 'text-slate-400'}`}>{team.name}</span>
              <span className={`text-lg sm:text-xl font-bold tracking-tight ${isCurrent ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-white'}`}>
                {team.score.toLocaleString('vi-VN')}
              </span>
            </div>
          );
        })}
      </div>

      {/* This player's own team badge, editable */}
      <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0c1630]/95 border border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
        <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
          <User className="w-4 h-4 fill-amber-300/30" />
        </div>
        <div className="flex flex-col text-left leading-tight pr-1">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-300/80">Đội của bạn</span>
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                maxLength={24}
                className="bg-slate-950 border border-amber-500/60 rounded px-1.5 py-0.5 text-xs text-white outline-none w-24"
              />
              <button onClick={saveEdit} className="text-emerald-400 hover:text-emerald-300 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={startEdit} className="flex items-center gap-1 text-sm font-bold text-amber-300 hover:text-amber-200" title="Bấm để đổi tên đội">
              {myTeamName}
              <Pencil className="w-3 h-3 opacity-60" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
