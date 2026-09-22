import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ResizerBarProps {
  scale: number; // 0 (Question max) to 100 (Wheel max)
  onChangeScale: (newScale: number) => void;
}

export const ResizerBar: React.FC<ResizerBarProps> = ({ scale, onChangeScale }) => {
  return (
    <div className="w-full max-w-3xl py-1.5 px-3 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800/80 my-1 flex items-center justify-between gap-2.5 text-xs select-none">
      {/* Label: Question bigger */}
      <button
        type="button"
        onClick={() => onChangeScale(Math.max(0, scale - 25))}
        className="flex items-center gap-1 text-slate-400 hover:text-amber-300 font-semibold transition-colors shrink-0 text-[11px]"
        title="Phần câu hỏi lớn hơn"
      >
        <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Phần câu hỏi (lớn hơn)</span>
        <span className="sm:hidden">Ô chữ +</span>
      </button>

      {/* Central Slider & Presets */}
      <div className="flex-1 flex items-center gap-2 max-w-sm mx-auto">
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={scale}
          onChange={(e) => onChangeScale(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300"
          title="Kéo thanh trượt để điều chỉnh tỉ lệ kích thước giữa Ô chữ và Vòng quay"
        />

        {/* Quick presets */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onChangeScale(20)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              scale <= 30
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Ưu tiên ô chữ"
          >
            Ô chữ
          </button>
          <button
            type="button"
            onClick={() => onChangeScale(50)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              scale > 30 && scale < 70
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Tỉ lệ cân bằng 50/50"
          >
            1:1
          </button>
          <button
            type="button"
            onClick={() => onChangeScale(80)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              scale >= 70
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Ưu tiên vòng quay to"
          >
            Vòng quay
          </button>
        </div>
      </div>

      {/* Label: Wheel bigger */}
      <button
        type="button"
        onClick={() => onChangeScale(Math.min(100, scale + 25))}
        className="flex items-center gap-1 text-slate-400 hover:text-amber-300 font-semibold transition-colors shrink-0 text-[11px]"
        title="Phần vòng quay lớn hơn"
      >
        <span className="hidden sm:inline">Phần vòng quay (lớn hơn)</span>
        <span className="sm:hidden">Vòng quay +</span>
        <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
      </button>
    </div>
  );
};
