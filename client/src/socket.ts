import { io, Socket } from 'socket.io-client';

// Dev: client (5173) and server (4000) run on different ports, so default
// to localhost:4000 unless overridden. Prod: client is served BY the same
// Node process as the API (see server/src/index.ts), so connect same-origin
// by passing no URL at all — socket.io-client then uses window.location.
const SERVER_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.PROD ? undefined : 'http://localhost:4000');

export const socket: Socket = io(SERVER_URL, {
  autoConnect: true,
});
