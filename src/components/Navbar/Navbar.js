import React, { useEffect, useState } from 'react';
import './disconNav.css';
import './conNav.css';
import logo from 'C:/Users/Xeonoff/OneDrive/Рабочий стол/MTSchat_app/mts_chat/src/assets/logo.png';
import connectImg from 'C:/Users/Xeonoff/OneDrive/Рабочий стол/MTSchat_app/mts_chat/src/assets/connect.png';
import { useWebSocket } from 'C:/Users/Xeonoff/OneDrive/Рабочий стол/MTSchat_app/mts_chat/src/hooks/WebSocketContext.js';

const Navbar = () => {
  const { isConnected, connect, disconnect, setUsernameInProvider } = useWebSocket();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      setUsernameInProvider(savedUsername);
      connect();
    }
  }, [connect, setUsernameInProvider]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const getInitials = (username) => {
    const words = username.split(' ');
    if (words.length === 1) {
      return words[0][0];
    } 
    return words.map(word => word[0]).join('');
  };

  const handleConnect = () => {
    if (!username) {
      alert('Введите имя перед подключением.');
      return;
    }
    localStorage.setItem('username', username);
    setUsernameInProvider(username);
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem('username');
  };

  const getDisconnectedNavbar = () => (
    <div className="div">
      <div className="div-2">
        <div className="div-3">
          <div className="div-4">
            <img alt="logo" loading="lazy" src={logo} className="img" />
            <div className="div-5">МТС</div>
          </div>
          <div className="div-6">
            <div className="div-8">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="div-7"
                disabled={isConnected}
              />
              <div className='Div-9'>
                <div className='Div-10' />
              </div>
            </div>
            <img
              alt="connect"
              loading="lazy"
              src={connectImg}
              className="img-2"
              onClick={handleConnect}
            />
          </div>
        </div>
      </div>
      <div className='Div-9'>
        <div className="Div-10" />
      </div>
      <div className="div-10">ПОДКЛЮЧИТЬСЯ</div>
    </div>
  );

  const getConnectedNavbar = () => (
    <div className="Div">
      <div className="Div-2">
        <img
          alt="logo"
          loading="lazy"
          src={logo}
          className="Img"
        />
        <div className="Div-3">
          <div className="Div-4">МТС</div>
          <div className="Div-5">ПОДКЛЮЧЕН ⬤</div>
        </div>
        <div className="Div-6">
          <div className="Div-7">{getInitials(username)}</div>
          <div className="Div-8">{username}</div>
          <div className="circle">
            <div className="cross" onClick={handleDisconnect}></div>
          </div>
        </div>
      </div>
      <div className="Div-9">
        <div className="Div-10" />
      </div>
    </div>
  );

  return isConnected ? getConnectedNavbar() : getDisconnectedNavbar();
};

export default Navbar;
