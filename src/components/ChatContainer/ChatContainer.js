import React, { useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import warning from 'C:/Users/Xeonoff/OneDrive/Рабочий стол/MTSchat_app/mts_chat/src/assets/warning.png';
import './ChatContainer.css';
import MessageCard from '../Message/MessageCard';

const ChatContainer = ({ messages, isConnected }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getDisconnectedChat = () => (
    <div className="chat_div">
      <div className="chat_div-2">
        <img alt="warning" loading="lazy" src={warning} className="chat_img"/>
        <div className="chat_div-3">ТРЕБУЕТСЯ ПОДКЛЮЧЕНИЕ</div>
      </div>
    </div>
  );

  const getConnectedChat = () => (
    <div className="chat_div connected">
      <Container className="messages-container">
        {messages.map((message, index) => (
          <MessageCard key={index} name={message.name} message={message.message} time={message.time} />
        ))}
        <div ref={chatEndRef} />
      </Container>
    </div>
  );

  return isConnected ? getConnectedChat() : getDisconnectedChat();
};

export default ChatContainer;
