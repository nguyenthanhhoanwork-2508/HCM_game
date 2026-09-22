import React from 'react';
import { Award, AlertTriangle, AlertCircle, Music, Dumbbell, Gift, ArrowRight } from 'lucide-react';
import { WheelSegment } from '../types';

interface SpinResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: WheelSegment | null;
  activeTeamName: string;
}

export const SpinResultModal: React.FC<SpinResultModalProps> = ({
  isOpen,
  onClose,
  result,
  activeTeamName,
}) => {
  if (!isOpen || !result) return null;

  const isPositivePoints = result.type === 'points_pos' || (result.value > 0 && !result.specialAction);
  const isNegativePoints = result.type === 'points_neg' || result.value < 0;
  const isLoseTurn = result.specialAction === 'LOSE_TURN';
  const isChallenge = result.type === 'challenge' || result.specialAction === 'SING_SONG' || result.specialAction === 'PUSH_UPS';
  const isBonus = result.type === 'bonus' || result.specialAction === 'LUCKY_DRAW' || result.specialAction === 'DOUBLE';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative text-center">
        {/* Glow backdrop accent */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: result.color }}
        />

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 mb-3">
          <span>Lượt quay của:</span>
          <strong className="text-amber-300">{activeTeamName}</strong>
        </div>

        {/* Icon & Big Result Title */}
        <div className="my-3 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border border-white/20 mb-3 text-white"
            style={{ backgroundColor: result.color }}
          >
            {isLoseTurn ? (
              <AlertCircle className="w-9 h-9 text-white" />
            ) : isNegativePoints ? (
              <AlertTriangle className="w-9 h-9 text-white" />
            ) : result.specialAction === 'SING_SONG' ? (
              <Music className="w-9 h-9 text-white" />
            ) : result.specialAction === 'PUSH_UPS' ? (
              <Dumbbell className="w-9 h-9 text-white" />
            ) : isBonus ? (
              <Gift className="w-9 h-9 text-white" />
            ) : (
              <Award className="w-9 h-9 text-white" />
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
            {result.label}
          </h3>
          {result.sublabel && (
            <p className="text-sm font-semibold text-amber-300 mt-0.5">
              {result.sublabel}
            </p>
          )}
        </div>

        {/* Detailed Explanation / Rule */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 my-4 text-xs leading-relaxed text-slate-300 text-left">
          {isPositivePoints && (
            <div className="space-y-1">
              <p>
                🎉 Bạn đã quay trúng <strong className="text-emerald-400 font-bold">{result.label} điểm</strong>!
              </p>
              <p className="text-slate-300">
                Hãy nhập và <strong>Check 1 chữ cái</strong>:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                <li>Đúng 1 chữ: nhận <strong className="text-emerald-400">+{result.value} điểm</strong> (x1).</li>
                <li>Đúng 2 chữ: nhận <strong className="text-emerald-400">+{result.value * 2} điểm</strong> (x2)...</li>
                <li>Đoán sai: <strong className="text-rose-400">Mất lượt chơi</strong>!</li>
              </ul>
            </div>
          )}

          {isNegativePoints && (
            <p className="text-rose-300">
              ⚠️ Rất tiếc! Ô điểm trừ đã <strong className="font-bold underline">trừ thẳng {Math.abs(result.value)} điểm</strong> của {activeTeamName}!
              <br />
              (Trừ điểm trực tiếp và chuyển lượt chơi sang đội tiếp theo).
            </p>
          )}

          {isLoseTurn && (
            <p className="text-rose-300">
              ❌ Ô <strong>MẤT LƯỢT</strong>! Đội {activeTeamName} mất quyền chơi trong vòng quay này. Lượt chơi chuyển sang đội kế tiếp!
            </p>
          )}

          {isChallenge && (
            <p className="text-amber-200">
              🎯 Ô THỬ THÁCH! {activeTeamName} hãy thực hiện thử thách:
              <br />
              <strong>{result.label} {result.sublabel || ''}</strong> để nhận thưởng hoặc giữ lượt!
            </p>
          )}

          {isBonus && !isPositivePoints && (
            <p className="text-amber-200">
              ✨ Ô ĐẶC BIỆT! Cơ hội nhân đôi điểm số hoặc nhận phần thưởng may mắn!
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="w-full py-2.5 rounded-xl font-extrabold text-sm tracking-wide text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
        >
          <span>{isPositivePoints ? 'Bắt Đầu Đoán Chữ' : 'Đã Hiểu, Tiếp Tục'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
