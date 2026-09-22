import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';

interface WheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpinComplete: (result: WheelResult) => void;
  currentTeamName: string;
}

export interface WheelResult {
  type: 'points' | 'lose_turn' | 'double' | 'half' | 'gift';
  value: number;
  label: string;
}

const SEGMENTS: WheelResult[] = [
  { type: 'points', value: 500, label: '500' },
  { type: 'points', value: 300, label: '300' },
  { type: 'lose_turn', value: 0, label: 'MẤT LƯỢT' },
  { type: 'points', value: 800, label: '800' },
  { type: 'points', value: 200, label: '200' },
  { type: 'double', value: 2, label: 'NHÂN ĐÔI' },
  { type: 'points', value: 400, label: '400' },
  { type: 'points', value: 1000, label: '1000' },
  { type: 'points', value: 100, label: '100' },
  { type: 'half', value: 0.5, label: 'CHIA ĐÔI' },
  { type: 'points', value: 600, label: '600' },
  { type: 'points', value: 700, label: '700' },
  { type: 'gift', value: 1500, label: 'PHẦN THƯỞNG' },
  { type: 'points', value: 900, label: '900' },
  { type: 'points', value: 350, label: '350' },
  { type: 'points', value: 500, label: '500' },
];

const COLORS = [
  '#ef4444', '#f97316', '#1e293b', '#84cc16',
  '#06b6d4', '#eab308', '#ec4899', '#10b981',
  '#6366f1', '#64748b', '#8b5cf6', '#14b8a6',
  '#f59e0b', '#3b82f6', '#0ea5e9', '#d946ef',
];

export const WheelModal: React.FC<WheelModalProps> = ({
  isOpen,
  onClose,
  onSpinComplete,
  currentTeamName,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelResult | null>(null);
  const lastTickAngle = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    // Random landing segment
    const segmentCount = SEGMENTS.length;
    const chosenIndex = Math.floor(Math.random() * segmentCount);
    const segmentAngle = 360 / segmentCount;

    // Additional full spins (between 5 and 8 full turns)
    const extraTurns = (5 + Math.floor(Math.random() * 4)) * 360;
    
    // The top pointer is at 270 deg (or 0 at top depending on wheel orientation)
    // Here needle is pointing from the top (270 deg)
    const targetAngle = extraTurns + (360 - chosenIndex * segmentAngle - segmentAngle / 2);
    const finalRotation = rotation + targetAngle;

    setRotation(finalRotation);

    // Ticking audio simulation during rotation
    const duration = 4500; // ms
    const startTime = performance.now();

    const checkTicks = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const currentAngle = rotation + targetAngle * (1 - Math.pow(1 - progress, 3));

      if (Math.abs(currentAngle - lastTickAngle.current) >= segmentAngle / 2) {
        soundManager.playWheelTick();
        lastTickAngle.current = currentAngle;
      }

      if (progress < 1) {
        requestAnimationFrame(checkTicks);
      } else {
        setIsSpinning(false);
        const selected = SEGMENTS[chosenIndex];
        setResult(selected);
        if (selected.type === 'lose_turn') {
          soundManager.playBuzzer();
        } else {
          soundManager.playCorrectAnswer();
        }
      }
    };

    requestAnimationFrame(checkTicks);
  };

  const handleConfirmResult = () => {
    if (result) {
      onSpinComplete(result);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b1633] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col items-center shadow-[0_0_50px_rgba(245,158,11,0.3)] relative">
        {/* Modal Header */}
        <h3 className="text-xl sm:text-2xl font-black text-amber-300 font-display mb-1 text-center">
          VÒNG QUAY MAY MẮN
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-6 text-center">
          Lượt quay của: <span className="text-amber-300 font-bold">{currentTeamName}</span>
        </p>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-6">
          {/* Top Indicator Needle */}
          <div className="absolute -top-3 z-30 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-amber-400 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]" />
          </div>

          {/* Wheel Disc */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] overflow-hidden relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
            }}
          >
            {/* SVG Wheel segments */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {SEGMENTS.map((seg, idx) => {
                const total = SEGMENTS.length;
                const angle = 360 / total;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const midAngle = startAngle + angle / 2;
                const tx = 50 + 32 * Math.cos((Math.PI * midAngle) / 180);
                const ty = 50 + 32 * Math.sin((Math.PI * midAngle) / 180);

                return (
                  <g key={idx}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={COLORS[idx % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth="0.6"
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill="#ffffff"
                      fontSize={seg.label.length > 5 ? '3' : '4.5'}
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Center Cap */}
            <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 border-2 border-white shadow-xl flex items-center justify-center">
              <span className="text-[10px] font-black text-slate-900 tracking-tighter">NÓN KỲ QUẶC</span>
            </div>
          </div>
        </div>

        {/* Spin Outcome & Controls */}
        {result ? (
          <div className="flex flex-col items-center gap-3 w-full animate-scale-up">
            <div className="px-5 py-2.5 rounded-xl bg-amber-400/20 border border-amber-400 text-center">
              <span className="text-xs uppercase text-amber-200 block font-semibold">Kết quả quay:</span>
              <span className="text-2xl font-black text-amber-300 font-display">
                {result.label}
              </span>
            </div>
            <button
              onClick={handleConfirmResult}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-base shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all active:scale-[0.98]"
            >
              {result.type === 'lose_turn' ? 'Chuyển lượt cho đội kế tiếp' : 'Tiếp tục chọn chữ cái'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-base transition-all ${
                isSpinning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.6)] active:scale-[0.98]'
              }`}
            >
              {isSpinning ? 'Đang quay...' : 'QUAY NGAY (Hoặc bấm Space)'}
            </button>
            <button
              onClick={onClose}
              disabled={isSpinning}
              className="py-3.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
