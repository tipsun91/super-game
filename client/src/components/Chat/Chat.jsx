/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');

  const { user } = useSelector((state) => state.user); // подключаем юзера из реакт редакса

  function connect() {
    socket.current = new WebSocket('ws://localhost:4000');

    socket.current.onopen = () => {
      console.log('Socket открыт');
      setConnected(true);
      const message = {
        event: 'connection',
        username: user.name,
        id: user.id,
      };
      setUsername(user.name);
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
      console.log(message);
    };
    socket.current.onclose = () => {
      console.log('Socket закрыт');
    };
    socket.current.onerror = () => {
      console.log('Socket произошла ошибка');
    };
  }

  const sendMessage = async () => {
    const message = {
      username: user.name,
      message: value,
      mess_id: v4(),
      event: 'message',
    };
    socket.current.send(JSON.stringify(message));
    setValue('');
  };

  if (!connected) {
    return (
      <button onClick={connect} type="button">Войти</button>
    );
  }

  return (
    <div className="center">
      <div className="form">
        <input value={value} onChange={(e) => setValue(e.target.value)} type="text" />
        <button onClick={sendMessage} type="button">Отправить</button>
      </div>
      <div>
        <div className="messages">
          {messages.map((mess) => (
            <div key={mess.id}>
              {mess.event === 'connection'
                ? (
                  <div className="connection-message">
                    Пользователь
                    {' '}
                    {mess.username}
                    {' '}
                    подключился
                  </div>
                )
                : (
                  <div className="message" key={v4()}>
                    {mess.username}
                    :
                    {mess.message}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chat;
