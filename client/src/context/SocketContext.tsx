import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { io, type Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  userId: string;
  children: ReactNode;
}

export function SocketProvider({ userId, children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io({ query: { userId } });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [userId]);

  if (!socket) return null;

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
