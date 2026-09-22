import { Award, AlertTriangle, Gift, Info } from 'lucide-react';
import { PopupState } from '../types';

const ICON: Record<PopupState['type'], typeof Award> = {
  info: Info,
  success: Award,
  error: AlertTriangle,
  wheel: Gift,
};

const COLOR: Record<PopupState['type'], string> = {
  info: '#0284c7',
  success: '#059669',
  error: '#dc2626',
  wheel: '#eab308',
};

export function Popup({ popup }: { popup: PopupState | null }) {
  if (!popup) return null;
  const Icon = ICON[popup.type];
  const color = COLOR[popup.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div
        key={popup.id}
        className="pointer-events-auto w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative text-center animate-bounce-in"
      >
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: color }}
        />
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-xl border border-white/20 mb-3 text-white"
          style={{ backgroundColor: color }}
        >
          <Icon className="w-9 h-9" />
        </div>
        {popup.title && <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">{popup.title}</div>}
        <div className="text-xl sm:text-2xl font-black text-white">{popup.message}</div>
      </div>
    </div>
  );
}
