import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerSocketHandlers, initBroadcast } from './socket/handlers';

const app = express();
app.use(cors());
app.get('/health', (_req, res) => res.json({ ok: true }));

// In production, this one Node process also serves the built React client
// (client/dist) — same origin as the API, so no CORS/two-domain setup needed.
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/socket.io')) return next();
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next(); // client/dist doesn't exist (e.g. plain `npm run dev`) — fall through
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

initBroadcast(io);
// Server boots into the "idle" lobby — the admin presses Start when ready
// (see ADMIN_START_GAME), so nothing reveals until then.

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);
  registerSocketHandlers(io, socket);
  socket.on('disconnect', () => console.log(`[socket] disconnected: ${socket.id}`));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
httpServer.listen(PORT, () => {
  console.log(`Gamewheel server listening on http://localhost:${PORT}`);
});
