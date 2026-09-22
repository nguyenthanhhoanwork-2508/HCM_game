import React from 'react';
import { X, HelpCircle, Award, Target, Flame, CheckCircle2 } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Luật Chơi Chiếc Nón Kỳ Diệu</h3>
            <p className="text-xs text-slate-400">
              Quy tắc thi đấu và tính điểm chuẩn phong cách truyền hình
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Target className="w-4 h-4" />
              <span>1. Lượt Chơi & Quay Nón</span>
            </div>
            <p className="text-slate-400 pl-6">
              Đến lượt đội nào, đội đó bấm nút <strong>QUAY VÒNG QUAY</strong> (hoặc nhấn phím Space) để xác định điểm số hoặc nhận thử thách may rủi.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Đoán Chữ Cái</span>
            </div>
            <p className="text-slate-400 pl-6">
              Sau khi quay trúng điểm, đội đoán 1 chữ cái (phụ âm hoặc nguyên âm). Nếu chữ cái có trong ô chữ, số điểm quay được sẽ nhân với số lượng chữ xuất hiện! Đội được tiếp tục lượt. Nếu đoán sai, lượt chơi chuyển sang đội kế tiếp.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <Flame className="w-4 h-4" />
              <span>3. Các Ô Đặc Biệt</span>
            </div>
            <p className="text-slate-400 pl-6">
              <strong>Mất lượt:</strong> Lập tức mất quyền quay và chuyển lượt. <br />
              <strong>Thử thách (Hát, Chống đẩy...):</strong> Thực hiện vui vẻ để giữ lượt hoặc nhận điểm thưởng. <br />
              <strong>May mắn & Nhân đôi:</strong> Cơ hội bứt phá điểm số ngoạn mục!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Award className="w-4 h-4" />
              <span>4. Đoán Cả Ô Chữ (Về Đích)</span>
            </div>
            <p className="text-slate-400 pl-6">
              Bất kỳ lúc nào trong lượt của mình, đội có thể bấm nút <strong>Đoán cả ô chữ</strong> để đọc toàn bộ câu trả lời. Đoán đúng sẽ nhận thêm +1000 điểm và giành chiến thắng vòng chơi!
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md"
          >
            Đã hiểu, bắt đầu chơi!
          </button>
        </div>
      </div>
    </div>
  );
};
