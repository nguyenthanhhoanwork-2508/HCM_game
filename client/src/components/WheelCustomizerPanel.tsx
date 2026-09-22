import { useEffect, useState } from 'react';
import { RefreshCw, Check, Trash2, Plus } from 'lucide-react';
import { WheelSegment, WheelSegmentKind, SOCKET_EVENTS } from '../types';
import { socket } from '../socket';
import { SEGMENT_COLORS } from './Wheel';

interface Props {
  segments: WheelSegment[];
}

const KIND_LABEL: Record<WheelSegmentKind, string> = {
  add: 'Cộng điểm',
  subtract: 'Trừ điểm',
  action: 'Hành động',
  lucky: 'May mắn',
};

// Inline expandable panel (lives inside the Control column, no popup/backdrop).
export function WheelCustomizerPanel({ segments }: Props) {
  const [edited, setEdited] = useState<WheelSegment[]>(segments);

  useEffect(() => {
    setEdited(segments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments.length]);

  const update = (index: number, field: keyof WheelSegment, value: string | number) => {
    setEdited((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const removeSegment = (index: number) => {
    if (edited.length <= 2) return;
    setEdited((prev) => prev.filter((_, i) => i !== index));
  };

  const addSegment = () => {
    setEdited((prev) => [...prev, { id: `w${Date.now()}`, kind: 'add', label: '+100', value: 100 }]);
  };

  const handleSave = () => {
    socket.emit(SOCKET_EVENTS.ADMIN_UPDATE_WHEEL_SEGMENTS, { segments: edited });
  };

  return (
    <div className="p-3 space-y-2.5">
      <p className="text-sm text-slate-400">Điều chỉnh nội dung các ô ({edited.length} ô)</p>

      {edited.map((seg, idx) => (
        <div key={seg.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-2 text-sm">
          <span className="w-4 h-4 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: SEGMENT_COLORS[idx % SEGMENT_COLORS.length] }} />
          <span className="text-slate-500 font-mono w-6">#{idx + 1}</span>

          <select
            value={seg.kind}
            onChange={(e) => update(idx, 'kind', e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white text-sm outline-none"
          >
            {(Object.keys(KIND_LABEL) as WheelSegmentKind[]).map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={seg.label}
            onChange={(e) => update(idx, 'label', e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white text-sm font-bold outline-none flex-1 min-w-[100px]"
          />

          {(seg.kind === 'add' || seg.kind === 'subtract') && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-xs">Điểm:</span>
              <input
                type="number"
                value={Math.abs(seg.value ?? 0)}
                onChange={(e) => {
                  const n = Math.abs(parseInt(e.target.value) || 0);
                  update(idx, 'value', seg.kind === 'subtract' ? -n : n);
                }}
                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white text-sm font-bold font-mono outline-none text-right"
              />
            </div>
          )}

          <button
            onClick={() => removeSegment(idx)}
            disabled={edited.length <= 2}
            className="p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-30 shrink-0"
            title="Xóa ô này"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        onClick={addSegment}
        className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 text-sm font-bold flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm ô</span>
      </button>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <button
          onClick={() => socket.emit(SOCKET_EVENTS.ADMIN_RESET_WHEEL)}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Mặc định</span>
        </button>
        <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-1.5">
          <Check className="w-4 h-4" />
          <span>Áp dụng</span>
        </button>
      </div>
    </div>
  );
}
