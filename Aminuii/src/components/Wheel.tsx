import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { WheelSegment } from '../types';
import { sound } from '../utils/audio';

interface WheelProps {
  segments: WheelSegment[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (result: WheelSegment) => void;
  activeTeamName: string;
  wheelSize?: number;
}

export const Wheel: React.FC<WheelProps> = ({
  segments,
  isSpinning,
  onSpinStart,
  onSpinEnd,
  activeTeamName,
  wheelSize = 440,
}) => {
  const [rotation, setRotation] = useState(0);
  const [, setSelectedResult] = useState<WheelSegment | null>(null);
  const [pointerFlap, setPointerFlap] = useState(false);
  const [, setLastTickSegment] = useState<number | null>(null);

  const spinAnimationRef = useRef<number | null>(null);

  const numSegments = segments.length;
  const arcAngle = 360 / numSegments;

  // Find segment at left needle (horizontal pointer at 9 o'clock / 180deg)
  // Each segment i is defined from (i*arcAngle - 90deg) to ((i+1)*arcAngle - 90deg).
  // At needle angle 180deg, segment matches when:
  // (i*arcAngle - 90) <= (180 - rot) < ((i+1)*arcAngle - 90)
  // <=> i*arcAngle <= (270 - rot) < (i+1)*arcAngle
  const getSelectedSegment = (currentRot: number): WheelSegment => {
    const normalized = (((270 - currentRot) % 360) + 360) % 360;
    const segIndex = Math.floor(normalized / arcAngle) % numSegments;
    return segments[segIndex];
  };

  const handleSpinClick = () => {
    if (isSpinning) return;

    sound.playTick(1.2);
    onSpinStart();

    // 4 to 7 full rotations plus random offset for natural unpredictable spin
    const fullSpins = 5 + Math.floor(Math.random() * 4);
    const randomOffset = Math.random() * 360;
    const targetRot = rotation + fullSpins * 360 + randomOffset;
    const startRot = rotation;
    const distance = targetRot - startRot;

    // Spin duration 5.5s
    const duration = 5500;
    const startTime = performance.now();
    let previousSegIndex = -1;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quartic ease out for realistic heavy wheel inertia
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentAngle = startRot + distance * ease;

      setRotation(currentAngle);

      // Check peg tick at left needle (9 o'clock / 180deg)
      const normalized = (((270 - currentAngle) % 360) + 360) % 360;
      const currentSegIndex = Math.floor(normalized / arcAngle);

      if (currentSegIndex !== previousSegIndex) {
        previousSegIndex = currentSegIndex;
        setLastTickSegment(currentSegIndex);

        // Flap pointer upward with wheel upward velocity at 9 o'clock
        setPointerFlap(true);
        setTimeout(() => setPointerFlap(false), 50);

        // Vary tick pitch based on speed
        const speed = 1 - progress;
        sound.playTick(0.8 + speed * 0.4);
      }

      if (progress < 1) {
        spinAnimationRef.current = requestAnimationFrame(animate);
      } else {
        const finalSegment = getSelectedSegment(targetRot);
        setSelectedResult(finalSegment);
        sound.playStopChime();
        onSpinEnd(finalSegment);
      }
    };

    spinAnimationRef.current = requestAnimationFrame(animate);
  };

  // Keyboard shortcut: Spacebar to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpinning && e.target === document.body) {
        e.preventDefault();
        handleSpinClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (spinAnimationRef.current) {
        cancelAnimationFrame(spinAnimationRef.current);
      }
    };
  }, [isSpinning, rotation]);

  const size = wheelSize;
  const center = size / 2;
  const radius = Math.max(70, center - 20);
  const hubRadius = Math.round(size * 0.11);

  // Horizontal Pointer dimensions (pointing left-to-right into wheel at 9 o'clock)
  const pointerLength = Math.round(Math.max(32, size * 0.08));
  const pointerThickness = Math.round(Math.max(22, size * 0.055));

  return (
    <div className="flex flex-col items-center select-none relative">
      {/* Wheel Container */}
      <div className="relative p-1">
        {/* Horizontal Pointer Needle & Active Turn Indicator on the Left (9 o'clock) */}
        <div
          className="absolute left-0 top-1/2 z-30 flex items-center pointer-events-none select-none"
          style={{
            transform: 'translateX(calc(-100% + 20px)) translateY(-50%)',
          }}
        >
          {/* Active team turn badge directly on the left of pointer */}
          <div className="px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs xl:text-sm font-extrabold bg-slate-900/95 border-2 border-amber-500/60 text-amber-300 shadow-2xl backdrop-blur-md flex items-center gap-2 whitespace-nowrap ring-2 ring-amber-400/20">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span>
              Lượt: <strong className="text-white text-xs xl:text-sm">{activeTeamName}</strong>
            </span>
          </div>

          {/* Pointer needle flapping pointing to the right into the wheel */}
          <div
            className={`transition-transform duration-75 origin-left -ml-0.5 ${
              pointerFlap ? '-rotate-6 scale-x-95' : 'rotate-0 scale-x-100'
            }`}
            style={{
              filter: 'drop-shadow(3px 4px 7px rgba(0,0,0,0.85))',
            }}
          >
            <svg
              width={pointerLength}
              height={pointerThickness}
              viewBox="0 0 42 34"
              fill="none"
            >
              {/* Horizontal pointer bezel: tip at right (40, 17) */}
              <path
                d="M40 17 L8 3C4 1 1 3 1 7L1 27C1 31 4 33 8 31L40 17Z"
                fill="#ef4444"
                stroke="#fbbf24"
                strokeWidth="2.5"
              />
              {/* Pointer Inner Gem at base */}
              <circle cx="10" cy="17" r="5" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Outer Golden Border & Shadow */}
        <div
          className="rounded-full relative p-2 shadow-2xl"
          style={{
            background:
              'radial-gradient(circle, #382c16 0%, #1e1709 85%, #0d0a03 100%)',
            boxShadow:
              '0 20px 45px -10px rgba(0,0,0,0.8), 0 0 35px rgba(245, 158, 11, 0.15)',
            border: '4px solid #785a28',
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="overflow-visible"
            style={{ width: size, height: size }}
          >
            {/* Outer Ring */}
            <circle
              cx={center}
              cy={center}
              r={radius + 4}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.4))' }}
            />

            {/* Rotating Wheel Group */}
            <g
              transform={`rotate(${rotation}, ${center}, ${center})`}
              style={{ willChange: 'transform' }}
            >
              {segments.map((seg, i) => {
                // Wedge angles
                const startAngleDeg = i * arcAngle - 90;
                const endAngleDeg = (i + 1) * arcAngle - 90;
                const midAngleDeg = startAngleDeg + arcAngle / 2;

                const startRad = (startAngleDeg * Math.PI) / 180;
                const endRad = (endAngleDeg * Math.PI) / 180;
                const midRad = (midAngleDeg * Math.PI) / 180;

                const x1 = center + radius * Math.cos(startRad);
                const y1 = center + radius * Math.sin(startRad);
                const x2 = center + radius * Math.cos(endRad);
                const y2 = center + radius * Math.sin(endRad);

                const largeArc = arcAngle > 180 ? 1 : 0;
                const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                // Peg pin coordinates at perimeter
                const pegRadius = radius - 3;
                const pegX = center + pegRadius * Math.cos(startRad);
                const pegY = center + pegRadius * Math.sin(startRad);

                // Text position along radius
                const textDist = radius * 0.65;
                const textX = center + textDist * Math.cos(midRad);
                const textY = center + textDist * Math.sin(midRad);

                // Responsive font sizing based on wheel size
                const mainFontSize =
                  seg.label.length > 7
                    ? Math.max(10, Math.round(size * 0.027))
                    : Math.max(12, Math.round(size * 0.036));
                const subFontSize = Math.max(8, Math.round(size * 0.022));

                return (
                  <g key={seg.id}>
                    {/* Segment slice */}
                    <path
                      d={pathData}
                      fill={seg.color}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />

                    {/* Metal Peg pin */}
                    <circle
                      cx={pegX}
                      cy={pegY}
                      r={Math.max(2.5, Math.round(size * 0.008))}
                      fill="#fbbf24"
                      stroke="#78350f"
                      strokeWidth="1"
                    />

                    {/* Segment Text */}
                    <g
                      transform={`translate(${textX}, ${textY}) rotate(${midAngleDeg + 90})`}
                    >
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={seg.textColor || '#ffffff'}
                        fontSize={mainFontSize}
                        fontWeight="900"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {seg.label}
                      </text>
                      {seg.sublabel && (
                        <text
                          y={Math.round(mainFontSize * 0.95)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={seg.textColor || '#ffffff'}
                          fontSize={subFontSize}
                          fontWeight="700"
                          style={{
                            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.7))',
                          }}
                        >
                          {seg.sublabel}
                        </text>
                      )}
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Static Wheel Center Hub with Gold Bezel */}
            <circle
              cx={center}
              cy={center}
              r={hubRadius + 5}
              fill="#090d16"
              stroke="#fbbf24"
              strokeWidth="3.5"
            />
            <defs>
              <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="70%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
            </defs>

            {/* Inner Wheel Center Logo */}
            <circle cx={center} cy={center} r={hubRadius} fill="url(#hubGradient)" />
            <text
              x={center}
              y={center - Math.round(hubRadius * 0.16)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#f59e0b"
              fontSize={Math.max(9, Math.round(hubRadius * 0.28))}
              fontWeight="900"
              letterSpacing="0.08em"
            >
              CHIẾC NÓN
            </text>
            <text
              x={center}
              y={center + Math.round(hubRadius * 0.22)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#ffffff"
              fontSize={Math.max(8, Math.round(hubRadius * 0.25))}
              fontWeight="800"
              letterSpacing="0.04em"
            >
              KỲ DIỆU
            </text>
          </svg>
        </div>
      </div>

      {/* Spin Wheel Controls */}
      <div className="mt-3 flex items-center gap-2.5">
        <button
          id="btn-spin-wheel"
          disabled={isSpinning}
          onClick={handleSpinClick}
          className={`flex items-center gap-2.5 px-7 xl:px-9 py-2.5 xl:py-3 rounded-2xl font-black text-sm xl:text-base tracking-wider transition-all shadow-xl ${
            isSpinning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 hover:shadow-amber-500/30 hover:scale-[1.03] active:scale-[0.97] border-2 border-amber-300'
          }`}
        >
          <Play className={`w-4 h-4 xl:w-5 xl:h-5 fill-current ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'ĐANG QUAY...' : 'QUAY VÒNG QUAY'}</span>
        </button>

        <span className="text-xs text-slate-500 hidden sm:inline">
          <kbd className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs shadow-sm">Space</kbd>
        </span>
      </div>
    </div>
  );
};
