import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { WheelSegment } from '../types';

// One color per wheel segment slot, cycles if the admin adds more than 15.
export const SEGMENT_COLORS = [
  '#059669', '#0891b2', '#16a34a', '#f97316', '#10b981',
  '#eab308', '#0284c7', '#1e293b', '#8b5cf6', '#ea580c',
  '#4f46e5', '#e11d48', '#10b981', '#ea580c', '#a855f7',
];

interface Props {
  segments: WheelSegment[];
  spinning: boolean;
  resultSegmentId: string | null;
  onSpin: () => void;
  spinDisabled: boolean;
  activeTeamName: string;
  wheelSize?: number;
}

export function Wheel({ segments, spinning, resultSegmentId, onSpin, spinDisabled, activeTeamName, wheelSize = 440 }: Props) {
  const [rotation, setRotation] = useState(0);
  const spunForResult = useRef<string | null>(null);
  const arcAngle = 360 / segments.length;

  // Pointer sits at 3 o'clock (right, 0deg). Segment i spans
  // [i*arc - 90, (i+1)*arc - 90); bring its center under the pointer.
  useEffect(() => {
    if (spinning && resultSegmentId && spunForResult.current !== resultSegmentId) {
      spunForResult.current = resultSegmentId;
      const targetIndex = segments.findIndex((s) => s.id === resultSegmentId);
      if (targetIndex === -1) return;
      const midAngle = targetIndex * arcAngle + arcAngle / 2;
      // rotation r such that (90 - r) mod 360 lands in this segment's range
      const targetRot = 90 - midAngle;
      const extraSpins = 360 * 5;
      setRotation((prev) => prev - (prev % 360) + extraSpins + ((targetRot % 360) + 360) % 360);
    }
  }, [spinning, resultSegmentId, segments, arcAngle]);

  const size = wheelSize;
  const center = size / 2;
  const radius = Math.max(70, center - 20);
  const hubRadius = Math.round(size * 0.11);
  const pointerLength = Math.round(Math.max(32, size * 0.08));
  const pointerThickness = Math.round(Math.max(22, size * 0.055));

  return (
    <div className="flex flex-col items-center select-none relative">
      <div className="relative p-1">
        {/* Horizontal pointer + active team badge at 3 o'clock */}
        <div
          className="absolute right-0 top-1/2 z-30 flex items-center pointer-events-none select-none"
          style={{ transform: 'translateX(calc(100% - 20px)) translateY(-50%)' }}
        >
          <div className="-mr-0.5" style={{ filter: 'drop-shadow(-3px 4px 7px rgba(0,0,0,0.85))' }}>
            <svg width={pointerLength} height={pointerThickness} viewBox="0 0 42 34" fill="none">
              <path d="M2 17 L34 3C38 1 41 3 41 7L41 27C41 31 38 33 34 31L2 17Z" fill="#ef4444" stroke="#fbbf24" strokeWidth="2.5" />
              <circle cx="32" cy="17" r="5" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
            </svg>
          </div>
          <div className="px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs xl:text-sm font-extrabold bg-slate-900/95 border-2 border-amber-500/60 text-amber-300 shadow-2xl backdrop-blur-md flex items-center gap-2 whitespace-nowrap ring-2 ring-amber-400/20">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            <span>
              Lượt: <strong className="text-white text-xs xl:text-sm">{activeTeamName}</strong>
            </span>
          </div>
        </div>

        <div
          className="rounded-full relative p-2 shadow-2xl"
          style={{
            background: 'radial-gradient(circle, #382c16 0%, #1e1709 85%, #0d0a03 100%)',
            boxShadow: '0 20px 45px -10px rgba(0,0,0,0.8), 0 0 35px rgba(245, 158, 11, 0.15)',
            border: '4px solid #785a28',
          }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
            <circle
              cx={center}
              cy={center}
              r={radius + 4}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.4))' }}
            />

            <g
              transform={`rotate(${rotation}, ${center}, ${center})`}
              style={{
                willChange: 'transform',
                transition: spinning ? 'transform 3.4s cubic-bezier(0.2, 0.7, 0.2, 1)' : 'none',
              }}
            >
              {segments.map((seg, i) => {
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
                const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

                const pegRadius = radius - 3;
                const pegX = center + pegRadius * Math.cos(startRad);
                const pegY = center + pegRadius * Math.sin(startRad);

                // Label runs radially (along the spoke, hub -> rim) instead of
                // along the arc, since a wedge is far longer radially than it
                // is wide at the arc — long labels no longer spill outside it.
                const textRadius = (hubRadius + radius) / 2;
                const fontSize = seg.label.length > 7 ? Math.max(10, Math.round(size * 0.027)) : Math.max(12, Math.round(size * 0.036));
                const availableLength = radius - hubRadius - size * 0.02;
                const estimatedWidth = seg.label.length * fontSize * 0.62;
                const needsCompression = estimatedWidth > availableLength;

                return (
                  <g key={seg.id}>
                    <path d={pathData} fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} stroke="#0f172a" strokeWidth="1.5" />
                    <circle cx={pegX} cy={pegY} r={Math.max(2.5, Math.round(size * 0.008))} fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
                    <g transform={`rotate(${midAngleDeg}, ${center}, ${center})`}>
                      <text
                        x={center + textRadius}
                        y={center}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffffff"
                        fontSize={fontSize}
                        fontWeight="900"
                        textLength={needsCompression ? availableLength : undefined}
                        lengthAdjust={needsCompression ? 'spacingAndGlyphs' : undefined}
                        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))', letterSpacing: '-0.02em' }}
                      >
                        {seg.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            <circle cx={center} cy={center} r={hubRadius + 5} fill="#090d16" stroke="#fbbf24" strokeWidth="3.5" />
            <defs>
              <clipPath id="hubClip">
                <circle cx={center} cy={center} r={hubRadius} />
              </clipPath>
            </defs>
            <circle cx={center} cy={center} r={hubRadius} fill="#0f172a" />
            <image
              href="/logo.png"
              x={center - hubRadius}
              y={center - hubRadius}
              width={hubRadius * 2}
              height={hubRadius * 2}
              clipPath="url(#hubClip)"
              preserveAspectRatio="xMidYMid slice"
            />
          </svg>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <button
          disabled={spinDisabled}
          onClick={onSpin}
          className={`flex items-center gap-2.5 px-7 xl:px-9 py-2.5 xl:py-3 rounded-2xl font-black text-sm xl:text-base tracking-wider transition-all shadow-xl ${
            spinDisabled
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 hover:shadow-amber-500/30 hover:scale-[1.03] active:scale-[0.97] border-2 border-amber-300'
          }`}
        >
          <Play className={`w-4 h-4 xl:w-5 xl:h-5 fill-current ${spinning ? 'animate-spin' : ''}`} />
          <span>{spinning ? 'ĐANG QUAY...' : 'QUAY VÒNG QUAY'}</span>
        </button>
      </div>
    </div>
  );
}
