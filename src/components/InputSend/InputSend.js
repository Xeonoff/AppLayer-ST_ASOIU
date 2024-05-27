import React, { useState } from 'react';
import { useWebSocket } from 'C:/Users/Xeonoff/OneDrive/Рабочий стол/MTSchat_app/mts_chat/src/hooks/WebSocketContext';
import { Alert } from 'react-bootstrap';
import './InputSend.css';  // Импортируем наш новый файл CSS

const InputSend = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const { ws, isConnected, username } = useWebSocket();
  const [error, setError] = useState('');

  const sendMessage = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      if (ws && isConnected) {
        const currentTime = new Date().toLocaleTimeString();
        const messageObject = {
          name: username,
          message,
          time: currentTime,
        };
        if(messageObject.message !== ''){ 
          ws.send(JSON.stringify({ type: 'send', messageObject }));
          console.log(messageObject);
          onSendMessage(messageObject); // Добавляем сообщение в состояние родительского компонента
          setMessage('');
          setError('');
        } else{
          setError('Сообщение не должно быть пустым');
        }
      } else {
        console.error("WebSocket isn't connected");
      }
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <>
      <div className="input-container">
        {error && <Alert variant="danger" className="input-alert">{error}</Alert>}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите ваше сообщение"
          className="input-field"
          onKeyDown={sendMessage}
        />
        <button 
          onClick={sendMessage} 
          className="input-button"
        >
          <span>&#10132;</span>
        </button>
      </div>
    </>
  );
};

export default InputSend;
