import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { GameState, SOCKET_EVENTS } from '../types';

export function useGameState(): GameState | null {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    const onSync = (next: GameState) => setState(next);
    socket.on(SOCKET_EVENTS.STATE_SYNC, onSync);
    socket.emit(SOCKET_EVENTS.CLIENT_REQUEST_STATE);
    return () => {
      socket.off(SOCKET_EVENTS.STATE_SYNC, onSync);
    };
  }, []);

  return state;
}
