import React from 'react';
import { useWebSocket } from 'C:/Users/Xeonoff/OneDrive/Рабочий стол/MTSchat_app/mts_chat/src/hooks/WebSocketContext.js'; // Предполагаем, что у вас есть провайдер для WebSocket
import './MessageCard.css';

const MessageCard = ({ name, message, time }) => {
  const { username } = useWebSocket();

  const getInitials = (name) => {
    console.log(username);
    console.log(name, message, time);
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0][0];
    }
    return words.map(word => word[0]).join('');
  };

  const isOutgoing = name === username; // Предполагаем, что контекст предоставляет текущего пользователя
  
  const formatMessage = (message) => {
    const maxLength = 60;
    const softLength = 50;
    let currentLength = 0;
    return message.split('').reduce((acc, char) => {
      currentLength++;
      acc += char;
      if (currentLength >= maxLength || (currentLength >= softLength && char === ' ')) {
        acc += '\n';
        currentLength = 0;
      }
      return acc;
    }, '');
  };

  return (
    <div className={`message-card ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      {!isOutgoing && <div className="avatar">{getInitials(name)}</div>}
      <div className="message-content">
        <div className="username">{name}</div>
        <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>{formatMessage(message)}</div>
      </div>
      <div className="message-time">{time}</div>
    </div>
  );
};

export default MessageCard;
