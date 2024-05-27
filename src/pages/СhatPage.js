import React, { useState, useEffect} from 'react';
import ChatContainer from '../components/ChatContainer/ChatContainer';
import InputSend from '../components/InputSend/InputSend';
import { Row, Container} from 'react-bootstrap';
import { useWebSocket } from '../hooks/WebSocketContext';
import './ChatPage.css';

const СhatPage = () =>{
    const { ws, isConnected } = useWebSocket();
    const [messages, setMessages] = useState([]);
    console.log(isConnected);
    console.log(messages);
    useEffect(() => {
        if (isConnected && ws) {
        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };
        }
    }, [isConnected, ws]);

    const addMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };
    console.log(messages);
    return(
        <>
            <Container id="box">
                <Row >
                    <ChatContainer messages={messages} isConnected={isConnected} />
                    {isConnected && <InputSend onSendMessage={addMessage} />}
                </Row>
                
            </Container>
        </>
    )
}

export default СhatPage;