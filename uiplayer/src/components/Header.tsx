import React from 'react';
import { User, Volume2, VolumeX, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Team } from '../types';

interface HeaderProps {
  teams: Team[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHostControls: () => void;
  onSelectTeamTurn?: (teamId: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  teams,
  soundEnabled,
  onToggleSound,
  onOpenHostControls,
  onSelectTeamTurn,
}) => {
  const currentActiveTeam = teams.find(t => t.isCurrentTurn) || teams[1];

  return (
    <header className="w-full max-w-7xl mx-auto px-4 pt-3 pb-2 flex flex-col md:flex-row items-center justify-between gap-4 z-20 relative">
      {/* Left: Gameshow Logo */}
      <div className="flex items-center gap-2 select-none cursor-pointer group" onClick={onOpenHostControls} title="Chiếc Nón Kỳ Quặc">
        <div className="relative flex flex-col items-center">
          {/* Conical Hat Icon (Nón Lá) with stylized glowing elements */}
          <div className="relative -mb-1 transform -rotate-6 transition-transform group-hover:rotate-0 duration-300">
            <svg width="46" height="32" viewBox="0 0 54 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)]">
              {/* Conical Hat Cone */}
              <path d="M27 2L52 30H2L27 2Z" fill="url(#hatGradient)" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
              {/* Hat Stripes / Bamboo Rings */}
              <path d="M12 20C18 22 36 22 42 20" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M17 14C21 15.5 33 15.5 37 14" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M22 8C24 9 30 9 32 8" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              {/* Little red silk chin strap ribbon */}
              <path d="M15 30C18 35 24 35 27 34C30 35 36 35 39 30" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="hatGradient" x1="27" y1="2" x2="27" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FDE68A" />
                  <stop offset="0.5" stopColor="#F59E0B" />
                  <stop offset="1" stopColor="#D97706" />
                </linearGradient>
              </defs>
            </svg>
            {/* Sparkle particle */}
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 absolute -top-1 -right-2 animate-bounce" />
          </div>

          {/* Logo Typography matching Image 2 */}
          <div className="text-center font-display font-black leading-none tracking-tight">
            <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-sky-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter">
              CHIẾC NÓN
            </div>
            <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] -mt-0.5">
              KỲ QUẶC
            </div>
          </div>
        </div>
      </div>

      {/* Center: Scoreboard matching Image 2 */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1 px-1 max-w-full">
        {teams.map((team) => {
          const isCurrent = team.isCurrentTurn;
          return (
            <button
              key={team.id}
              onClick={() => onSelectTeamTurn?.(team.id)}
              className={`flex flex-col items-center justify-center px-4 sm:px-6 py-2 rounded-xl transition-all duration-300 cursor-pointer min-w-[76px] sm:min-w-[92px] ${
                isCurrent
                  ? 'bg-[#121c38]/95 border-2 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)] ring-1 ring-amber-300/40 transform -translate-y-0.5'
                  : 'bg-[#0d1733]/75 border border-slate-700/60 text-slate-200 hover:border-slate-500/80 hover:bg-[#121e42]/80'
              }`}
            >
              <span className={`text-xs sm:text-sm font-medium ${isCurrent ? 'text-amber-200 font-semibold' : 'text-slate-400'}`}>
                {team.name}
              </span>
              <span className={`text-lg sm:text-xl font-bold tracking-tight ${isCurrent ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-white'}`}>
                {team.score.toLocaleString('vi-VN')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Player badge matching Image 2 & Tools */}
      <div className="flex items-center gap-2.5">
        {/* "Đội của bạn" Pill Badge */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0c1630]/95 border border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
            <User className="w-4 h-4 fill-amber-300/30" />
          </div>
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-300/80">
              Đội của bạn
            </span>
            <span className="text-sm font-bold text-amber-300">
              {currentActiveTeam.name}
            </span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 rounded-full bg-[#0d1733]/80 border border-slate-700/60 text-slate-300 hover:text-amber-300 hover:border-amber-400/50 transition-colors"
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Host / Settings Toggle */}
        <button
          onClick={onOpenHostControls}
          className="p-2 rounded-full bg-[#0d1733]/80 border border-slate-700/60 text-slate-300 hover:text-amber-300 hover:border-amber-400/50 transition-colors"
          title="Bảng điều khiển câu hỏi / MC"
          aria-label="Host controls"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
