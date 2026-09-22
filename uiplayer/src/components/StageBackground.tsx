import React from 'react';

export const StageBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#050b1a]">
      {/* 1. Deep Stage Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1538] via-[#050e26] to-[#030714]" />

      {/* 2. Top Dramatic Spotlights */}
      {/* Left Spotlight cone */}
      <div
        className="absolute -top-32 left-[15%] w-[480px] h-[750px] opacity-25 filter blur-3xl transform -rotate-12"
        style={{
          background: 'conic-gradient(from 180deg at 50% 0%, #38bdf8 0deg, #1d4ed8 45deg, transparent 90deg)',
        }}
      />
      {/* Right Spotlight cone */}
      <div
        className="absolute -top-32 right-[15%] w-[480px] h-[750px] opacity-25 filter blur-3xl transform rotate-12"
        style={{
          background: 'conic-gradient(from 180deg at 50% 0%, #38bdf8 0deg, #1d4ed8 45deg, transparent 90deg)',
        }}
      />
      {/* Center Top Ambient Blue Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 rounded-full blur-[120px]" />

      {/* 3. Golden Rim Lighting from Side Pillars (matching Image 2) */}
      <div className="absolute top-20 -left-10 w-28 h-96 bg-amber-500/20 blur-2xl rounded-full" />
      <div className="absolute top-20 -right-10 w-28 h-96 bg-amber-500/20 blur-2xl rounded-full" />

      {/* Side Arches / Stage Pillars outline effect */}
      <div className="absolute top-0 left-0 w-24 sm:w-32 h-full border-r border-blue-500/10 bg-gradient-to-r from-blue-950/40 to-transparent" />
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-full border-l border-blue-500/10 bg-gradient-to-l from-blue-950/40 to-transparent" />

      {/* 4. Circular Reflective Stage Platform Floor matching Image 2 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160%] sm:w-[130%] h-[320px] rounded-[100%] border-t-2 border-blue-400/30 bg-gradient-to-b from-[#0b1b42]/80 via-[#06112c]/95 to-[#020614] shadow-[0_-15px_40px_rgba(29,78,216,0.25)]">
        {/* Stage floor rim glow line */}
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-[1px]" />
        {/* Ambient floor reflection center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-blue-500/10 rounded-full blur-2xl" />
      </div>

      {/* Subtle floor spotlight points on left and right */}
      <div className="absolute bottom-40 left-12 w-20 h-20 bg-amber-400/15 rounded-full blur-xl" />
      <div className="absolute bottom-40 right-12 w-20 h-20 bg-amber-400/15 rounded-full blur-xl" />
    </div>
  );
};
