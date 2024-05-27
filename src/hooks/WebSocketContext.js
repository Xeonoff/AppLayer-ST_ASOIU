import { useState, useEffect, useRef, useContext, createContext } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const ws = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (!username) {
            console.error('Username is required to open WebSocket connection.');
            return;
        }

        const websocket = new WebSocket('ws://localhost:8080');
        ws.current = websocket;

        websocket.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            websocket.send(JSON.stringify({ type: 'register', username }));
        };

        websocket.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            setUsername('');
        };

        websocket.onerror = (err) => {
            console.error('WebSocket error:', err);
        };

        return () => {
            websocket.close();
        };
    }, [username]);

    const connect = () => {
        if (!username) {
            console.error('Username is required to open WebSocket connection.');
            return;
        }

        if (ws.current?.readyState === WebSocket.CLOSED) {
          const websocket = new WebSocket('ws://localhost:8080');
          ws.current = websocket;
  
          websocket.onopen = () => {
              console.log('WebSocket connected');
              setIsConnected(true);
          };
  
          websocket.onclose = () => {
              console.log('WebSocket disconnected');
              setIsConnected(false);
          };
      }
    };

    const disconnect = () => {
        if (ws.current) {
            ws.current.close();
        }
    };

    const value = {
        ws: ws.current,
        isConnected,
        username,
        connect,
        disconnect,
        setUsernameInProvider: setUsername,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);

    if (!context) {
        throw new Error('useWebSocketProvider must be used within a WebSocketProvider');
    }

    return context;
};
