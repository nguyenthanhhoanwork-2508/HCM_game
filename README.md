# Chiếc Nón Kì Quặc — MVP

Game show đoán chữ realtime. 1 màn Admin điều khiển, 5 màn Player (Team 1–5), đồng bộ qua Socket.IO. State lưu in-memory trên server, không DB, không auth.

Giao diện Admin dùng lại các component từ thư mục `Aminuii/` (app AI Studio độc lập), được nối vào backend Socket.IO hiện có — không đổi logic/state phía server.

## Cấu trúc thư mục

```
Gamewheel/
  server/            # Node + Express + Socket.IO + TypeScript
    src/
      index.ts        # khởi tạo http server + socket.io, tự bắt đầu đếm giờ câu hỏi 1
      state.ts         # GameState in-memory + mutation helpers
      types.ts         # types + socket event names (mirrored ở client)
      data/
        questions.ts    # mock câu hỏi
        wheelSegments.ts # 15 ô vòng quay (8 cộng / 3 trừ / 3 hành động / 1 may mắn)
      utils/
        answerLayout.ts # build 44 ô / 4 hàng (10-12-12-10) từ answer string
      socket/
        handlers.ts     # toàn bộ logic xử lý event
  client/            # React + TypeScript + Vite + Tailwind
    src/
      pages/
        AdminPage.tsx    # bố cục 3 cột kiểu Aminuii (Score | Board+Wheel | Control)
        PlayerPage.tsx
      components/
        ScoreBoard.tsx    # phong cách Aminuii, dùng Team{id:number} của server
        AnswerBoard.tsx   # thẻ lật 3D, 4 hàng, dùng answerLayout từ server
        Wheel.tsx         # SVG kiểu Aminuii, điều khiển bằng state server (không tự random)
        ControlPanel.tsx  # nối đúng các socket event hiện có
        Popup.tsx
        StudioBackground.tsx # nền sân khấu trang trí, copy nguyên từ Aminuii
      hooks/useGameState.ts
      socket.ts
      types.ts           # copy từ server/src/types.ts
      wheelSegments.ts   # copy từ server/src/data/wheelSegments.ts
    public/
      logo.png            # logo Chiếc Nón Kì Quặc (nền đã xóa), dùng ở tâm vòng quay
  Aminuii/           # app AI Studio gốc (tham khảo/độc lập, không chạy trong luồng chính)
  image/
    image.png          # ảnh logo gốc do người dùng cung cấp
```

## Cài đặt & chạy local

```bash
# cài dependency cho cả server + client
npm run install:all

# chạy song song server (port 4000) + client (port 5173)
npm run dev
```

Hoặc chạy riêng từng phần:

```bash
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```

Mở trình duyệt:
- Admin: http://localhost:5173/admin
- Team 1: http://localhost:5173/player/1
- Team 2: http://localhost:5173/player/2
- ... Team 5: http://localhost:5173/player/5

Mở 6 tab/cửa sổ (1 admin + 5 player) để demo đồng bộ realtime.

## Danh sách socket event

Client → Server:
- `admin:selectTeam` `{ teamId }` — chọn đội active
- `admin:nextQuestion` — chuyển câu hỏi kế tiếp, reset trạng thái ô đáp án
- `admin:showAnswer` — hiện toàn bộ đáp án
- `admin:inputLetter` `{ letter }` — mở 1 chữ cái (hỗ trợ Ê/Ơ/Ă/Â/Ô/Ư...)
- `admin:action` `{ actionType, value? }` — actionType: `add | subtract | penalty | skipTurn | luckyDraw`
- `admin:spin` — quay vòng quay cho đội active
- `admin:resolveSolve` `{ correct }` — xử lý kết quả khi đội xin trả lời toàn bộ (Enter)
- `player:requestSpin` `{ teamId }` — player bấm Space
- `player:requestSolve` `{ teamId }` — player bấm Enter

Server → Client:
- `state:sync` — bắn toàn bộ `GameState` mỗi khi state đổi (broadcast full snapshot, đơn giản hoá cho MVP)

## State chính (GameState)

```ts
{
  teams: Team[],                 // id, name, score
  activeTeamId: number | null,
  currentQuestionIndex: number,
  currentQuestion: Question,
  phase: 'idle' | 'showing-question' | 'ready' | 'spinning' | 'solving' | 'finished',
  answerLayout: AnswerCell[],     // 44 ô, 4 hàng (10-12-12-10)
  structureRevealed: boolean,     // true sau 2s -> ô có chữ chuyển trắng
  revealedChars: string[],        // các chữ cái đã mở
  enterUsedByTeam: Record<number, boolean>,
  solvingTeamId: number | null,
  spinRequestedTeamId: number | null,
  wheelSpinning: boolean,
  wheelResultSegmentId: string | null,
  popup: PopupState | null,
}
```

## Luật phím Player

- **Space**: chỉ có tác dụng khi player thuộc team đang active và `phase === 'ready'`. Trigger server tự random kết quả vòng quay (admin thấy vòng quay animate). Không phải team active hoặc chưa đúng phase thì Space không có tác dụng.
- **Enter**: xin trả lời toàn bộ đáp án. Mỗi team chỉ dùng được 1 lần/câu (`enterUsedByTeam`). Admin xử lý Đúng/Sai ở Control Panel — Đúng thì +1000 điểm và show đáp án; Sai thì đánh dấu team mất lượt Enter câu đó.

## Ghi chú thiết kế

- `answerLayout.ts`: 44 ô chia 4 hàng (10/12/12/10), ưu tiên chia đều số từ cho 2 hàng giữa (rộng hơn), mỗi hàng tự căn giữa; fallback greedy-wrap nếu tràn.
- Giao diện Admin (Scoreboard/AnswerBoard/Wheel/ControlPanel/StudioBackground) lấy từ `Aminuii/src/components/`, được viết lại để đọc/ghi qua `useGameState()` + `socket.emit(...)` thay vì state cục bộ + localStorage của bản gốc. Các modal của Aminuii cần backend mới (Quản lý câu hỏi, Tùy chỉnh vòng quay, Đoán ô chữ kiểu gõ tay, Luật chơi) đã được lược bỏ để giữ nguyên logic backend.
- Vòng quay (`Wheel.tsx`) chỉ render ở Admin — Player không thấy. 15 ô: 8 cộng / 3 trừ / 3 hành động / 1 may mắn, xen kẽ không gom cụm (`server/src/data/wheelSegments.ts`, đồng bộ với `client/src/wheelSegments.ts`).
- Popup tự động biến mất sau 4 giây (server-side timer), đồng bộ cho mọi màn.
- Logo (`client/public/logo.png`) đã qua xử lý xóa nền (flood-fill), dùng ở tâm vòng quay và có thể tái sử dụng ở nơi khác.

## Việc còn thiếu (ngoài scope MVP)

- Không có auth / phân quyền — ai vào đúng URL cũng điều khiển được (dùng nội bộ để demo).
- Không có reconnect resilience nâng cao ngoài việc server gửi lại full state khi connect.
- Chưa có màn "kết thúc game tổng" — hết bộ câu hỏi thì quay vòng lại câu đầu.
- Không hỗ trợ sửa câu hỏi / sửa ô vòng quay lúc chạy (yêu cầu backend mới, cố tình bỏ qua để giữ nguyên logic server).
