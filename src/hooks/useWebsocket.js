import { useState, useEffect, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL;

export const useWebsocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  const connect = useCallback(() => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      const ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket Connected');
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket Disconnected');
        // Attempt to reconnect in 5 seconds
        setTimeout(connect, 5000);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setLastMessage(message);
      };

      setSocket(ws);
    }
  }, [socket]);

  useEffect(() => {
    connect();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  return {
    isConnected,
    lastMessage,
    sendMessage
  };
};

export default useWebsocket;