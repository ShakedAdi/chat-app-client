import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
  withCredentials: true,
});
export const WebsocketContext = createContext<Socket>(socket);
