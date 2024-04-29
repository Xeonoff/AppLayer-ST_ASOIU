const express = require('express');
const bodyParser = require('body-parser'); // Для разбора тела POST запроса
const app = express();
const port = 3000;
const WebSocket = require('ws');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid'); // Пакет для генерации UUID
const wss = new WebSocket.Server({ port: 8080 });

app.use(bodyParser.json());

const connections = {}; // Хранит соотношение между UUID и WebSocket соединениями
const usersMap = {}; // Хранит соотношение между UUID и именами пользователей

wss.on('connection', function connection(ws) {
  const userId = uuidv4(); // Генерируем уникальный ID для нового пользователя
  ws.userId = userId; // Сохраняем ID на объекте WebSocket подключения

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    if (data.type === 'register') {
      const username = data.username;
      connections[userId] = ws; // Регистрируем новое соединение
      usersMap[userId] = username; // Сохраняем имя пользователя
      return;
    }

    if (data.type === 'send') {
      // Попытка отправить сообщение на основной бэкенд сервер
      const { text, time } = data;
      const username = usersMap[userId]; // Получаем имя пользователя по его ID
      axios.post('http://your-backend-server/send', {
        id: userId,
        username,
        text,
        time
      })
      .then(response => {
        // Обрабатываем успешную отправку
      })
      .catch(error => {
        console.error('Error sending message:', error);
        if (connections[userId]) {
          connections[userId].send(JSON.stringify({
            type: 'error',
            message: 'Failed to send message to the server.'
          }));
        }
      });
      return;
    }
  });

  ws.on('close', () => {
    // Удаляем пользователя и его соединение при отключении
    delete connections[ws.userId];
    delete usersMap[ws.userId];
  });
});
app.post('/receive', (req, res) => {
    const { id, username, time, ...rest} = req.body;
    const ws = connections[id];
    if (ws) {
        ws.send(JSON.stringify({
          id,
          username,
          ...rest,
          time,
        }));
        res.send({ status: 'success', message: 'Message sent to WebSocket client.' });
      } else {
        console.error('Attempt to send to unknown user ID:', id);
        res.status(404).send({ status: 'error', message: 'Client not found.' });
      }
  });

app.listen(port, () => console.log(`HTTP server is running on http://localhost:${port}`));
console.log('WebSocket server is running on ws://localhost:8080');
