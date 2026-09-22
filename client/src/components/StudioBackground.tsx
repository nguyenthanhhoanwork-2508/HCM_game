import React from 'react';

export const StudioBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Deep Royal Navy & Midnight Studio Radial Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 85% at 50% 20%, #0f1d3d 0%, #091226 40%, #050a16 75%, #02050c 100%)',
        }}
      />

      {/* 2. Top Studio Overhead Grid Lighting / Trusses */}
      <div
        className="absolute top-0 left-0 right-0 h-44 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
          backgroundSize: '48px 24px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* 3. Stage Spotlights Beams (Left, Center, Right) */}
      {/* Left Spotlight Beam - Angled towards WordBoard */}
      <div
        className="absolute -top-16 left-[12%] w-[450px] h-[750px] opacity-25 mix-blend-screen transform -rotate-18 pointer-events-none"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 0%, transparent 60deg, rgba(56, 189, 248, 0.35) 90deg, transparent 120deg)',
          filter: 'blur(35px)',
        }}
      />

      {/* Right Spotlight Beam - Angled towards WordBoard */}
      <div
        className="absolute -top-16 right-[12%] w-[450px] h-[750px] opacity-25 mix-blend-screen transform rotate-18 pointer-events-none"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 0%, transparent 60deg, rgba(245, 158, 11, 0.3) 90deg, transparent 120deg)',
          filter: 'blur(35px)',
        }}
      />

      {/* Center Stage Downlight - Glowing on Wheel & Stage */}
      <div
        className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[700px] xl:w-[900px] h-[450px] opacity-35 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(217, 119, 6, 0.22) 0%, rgba(30, 58, 138, 0.2) 45%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 4. Circular Stage Floor Concentric Light Rings (Under Wheel) */}
      <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[850px] xl:w-[1100px] h-[500px] opacity-20 pointer-events-none">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Perspective Stage Rings */}
          <ellipse
            cx="500"
            cy="350"
            rx="460"
            ry="180"
            fill="none"
            stroke="url(#stageGlowBlue)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <ellipse
            cx="500"
            cy="350"
            rx="380"
            ry="145"
            fill="none"
            stroke="url(#stageGlowGold)"
            strokeWidth="2"
          />
          <ellipse
            cx="500"
            cy="350"
            rx="290"
            ry="110"
            fill="none"
            stroke="url(#stageGlowBlue)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <ellipse
            cx="500"
            cy="350"
            rx="200"
            ry="75"
            fill="none"
            stroke="url(#stageGlowGold)"
            strokeWidth="2.5"
          />

          <defs>
            <linearGradient id="stageGlowBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="stageGlowGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" stopOpacity="0" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 5. Subtle Studio Ambient Particles / Bokeh */}
      <div className="absolute inset-0 overflow-hidden">
        <span
          className="absolute top-1/4 left-[18%] w-1.5 h-1.5 rounded-full bg-amber-300 opacity-60 animate-ping"
          style={{ animationDuration: '4s' }}
        />
        <span
          className="absolute top-1/3 right-[22%] w-2 h-2 rounded-full bg-sky-300 opacity-50 animate-pulse"
          style={{ animationDuration: '3.5s' }}
        />
        <span
          className="absolute top-[60%] left-[28%] w-1 h-1 rounded-full bg-amber-400 opacity-40 animate-ping"
          style={{ animationDuration: '5s' }}
        />
        <span
          className="absolute top-[48%] right-[15%] w-1.5 h-1.5 rounded-full bg-amber-200 opacity-60 animate-pulse"
          style={{ animationDuration: '4.5s' }}
        />
        <span
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-sky-400 opacity-30 animate-pulse"
          style={{ animationDuration: '6s' }}
        />
      </div>

      {/* 6. Dark Horizon Vignette edges */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 120px 40px rgba(0, 0, 0, 0.75)',
        }}
      />
    </div>
  );
};
