import React from 'react';

interface BottomBarProps {
  onSpinClick: () => void;
  onSolveClick: () => void;
  isUserTurn: boolean;
  disabledSpin?: boolean;
  disabledSolve?: boolean;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  onSpinClick,
  onSolveClick,
  isUserTurn,
  disabledSpin = false,
  disabledSolve = false,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 z-20 relative">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Action: [Space] Xin quay vòng quay */}
        <button
          onClick={onSpinClick}
          disabled={disabledSpin}
          className={`flex items-center gap-3.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl transition-all duration-200 border text-left group min-w-[280px] sm:min-w-[310px] ${
            disabledSpin
              ? 'bg-[#0a1329]/60 border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-[#0f1b3b]/90 hover:bg-[#152552] border-slate-700/80 hover:border-amber-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-[0.98]'
          }`}
        >
          {/* Keyboard Badge "Space" */}
          <div
            className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase border flex items-center justify-center min-w-[62px] transition-colors ${
              disabledSpin
                ? 'bg-slate-900 border-slate-800 text-slate-600'
                : 'bg-[#182343] border-slate-600 text-slate-200 group-hover:border-amber-400/70 group-hover:text-amber-300 shadow-inner'
            }`}
          >
            Space
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm sm:text-base font-bold transition-colors ${
                disabledSpin ? 'text-slate-500' : 'text-white group-hover:text-amber-200'
              }`}
            >
              Xin quay vòng quay
            </span>
            <span className="text-[11px] text-slate-400">
              (Chỉ khi đến lượt đội của bạn)
            </span>
          </div>
        </button>

        {/* Center Slogan matching Image 2 */}
        <div className="flex items-center gap-3 select-none px-2 order-last sm:order-none">
          <div className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent via-slate-600 to-slate-400 opacity-60" />
          <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-slate-400 uppercase whitespace-nowrap">
            NHANH TRÍ &nbsp;—&nbsp; VUI HẾT Ý
          </span>
          <div className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent via-slate-600 to-slate-400 opacity-60" />
        </div>

        {/* Right Action: [Enter] Xin trả lời toàn bộ đáp án */}
        <button
          onClick={onSolveClick}
          disabled={disabledSolve}
          className={`flex items-center gap-3.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl transition-all duration-200 border text-left group min-w-[280px] sm:min-w-[310px] ${
            disabledSolve
              ? 'bg-[#0a1329]/60 border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-[#0f1b3b]/90 hover:bg-[#152552] border-slate-700/80 hover:border-amber-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-[0.98]'
          }`}
        >
          {/* Keyboard Badge "Enter" */}
          <div
            className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase border flex items-center justify-center min-w-[62px] transition-colors ${
              disabledSolve
                ? 'bg-slate-900 border-slate-800 text-slate-600'
                : 'bg-[#182343] border-slate-600 text-slate-200 group-hover:border-amber-400/70 group-hover:text-amber-300 shadow-inner'
            }`}
          >
            Enter
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm sm:text-base font-bold transition-colors ${
                disabledSolve ? 'text-slate-500' : 'text-white group-hover:text-amber-200'
              }`}
            >
              Xin trả lời toàn bộ đáp án
            </span>
            <span className="text-[11px] text-slate-400">
              (Mỗi câu chỉ 1 lần duy nhất)
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
