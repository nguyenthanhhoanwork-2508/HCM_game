import React, { useState } from 'react';
import { X, Sliders, RefreshCw, Check } from 'lucide-react';
import { WheelSegment } from '../types';
import { DEFAULT_WHEEL_SEGMENTS } from '../data/defaultWheel';

interface WheelCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: WheelSegment[];
  onSaveSegments: (newSegments: WheelSegment[]) => void;
  onResetSegments: () => void;
}

export const WheelCustomizerModal: React.FC<WheelCustomizerModalProps> = ({
  isOpen,
  onClose,
  segments,
  onSaveSegments,
  onResetSegments,
}) => {
  const [editedSegments, setEditedSegments] = useState<WheelSegment[]>(segments);

  if (!isOpen) return null;

  const handleUpdate = (index: number, field: keyof WheelSegment, val: any) => {
    const updated = [...editedSegments];
    updated[index] = { ...updated[index], [field]: val };
    setEditedSegments(updated);
  };

  const handleSave = () => {
    onSaveSegments(editedSegments);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tùy Chỉnh Ô Nón Quay</h3>
              <p className="text-xs text-slate-400">
                Điều chỉnh điểm số và nội dung các ô trên vòng quay ({editedSegments.length} ô)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segments List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-4">
          {editedSegments.map((seg, idx) => (
            <div
              key={seg.id}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="w-5 h-5 rounded-full shrink-0 border border-white/20"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-slate-500 font-mono w-5">#{idx + 1}</span>
                <input
                  type="text"
                  value={seg.label}
                  onChange={(e) => handleUpdate(idx, 'label', e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs font-bold outline-none flex-1 min-w-[100px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Điểm:</span>
                <input
                  type="number"
                  value={seg.value}
                  onChange={(e) => handleUpdate(idx, 'value', parseInt(e.target.value) || 0)}
                  className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs font-bold font-mono outline-none text-right"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              setEditedSegments(DEFAULT_WHEEL_SEGMENTS);
              onResetSegments();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Áp dụng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
