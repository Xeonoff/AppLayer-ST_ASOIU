const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8081;
const WebSocket = require('ws');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const wss = new WebSocket.Server({ port: 8080 });

const JSON5 = require('json5');

app.use(bodyParser.json());

const connections = {}; 
const usersMap = {};
wss.on('connection', function connection(ws) {
  const userId = uuidv4();
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    if (data.type === 'register') {
      const username = data.username;
      connections[userId] = ws; 
      usersMap[userId] = username;
      console.log(usersMap);
      console.log("подключился")
      return;
    }
    if (data.type === 'send') {
      const { message, time } = data.messageObject;
      console.log(message, time);
      const username = usersMap[userId];
      console.log(usersMap);
      try {
        axios.post('http://10.147.17.225:9097/send', {
          id: userId,
          username,
          text: message,
          time
        });
      } catch{

      }
      return;
    }
  });

  ws.on('close', () => {
    delete connections[userId];
    delete usersMap[userId];
    console.log('закрыто');
  });
});

app.post('/receive', (req, res) => {
  let message;
  console.log(connections);
  try {
    message = req.body;
  } catch (e) {
    console.log('Error parsing main JSON:', e.message);
    return res.status(400).send({ status: 'error', message: 'Invalid JSON. Details: ' + e.message });
  }

  const { data: dataString, error } = message;
  let cleanedDataString;
  let data;

  try {
    // Удаление слешей и символов перевода строки из dataString
    cleanedDataString = dataString.replace(/\\n/g, '').replace(/\\t/g, '').replace(/\\/g, '');
    // Парсинг очищенной строки JSON
    data = JSON.parse(cleanedDataString);
  } catch (e) {
    console.log('Error parsing JSON in data field:', e.message);
    return res.status(400).send({ status: 'error', message: 'Invalid JSON in data. Details: ' + e.message });
  }

  const { id, username, text, time } = data || {};
  const ws = connections[id];
  console.log(id, username, text, time);
  if (ws) {
    try {
      if (error === 'OK') {
        // Отправляем нормальное сообщение при error равном "OK"
        const messageObject = {
          name: username,
          message: text,
          time
        };
        ws.send(JSON.stringify({type: 'send', messageObject}));
      } else {
        const messageObject = {
          name: username,
          message: error,
          time,
          isError: true
        };
        // Отправляем сообщение об ошибке в вебсокет
        ws.send(JSON.stringify({ type: 'send', messageObject}));
      }
      res.status(200).send({ status: 'success', message: 'Message sent to WebSocket client.' });
    } catch (error) {
      console.error('Error sending message:', error.message);
      res.status(400).send({ status: 'error', message: 'Failed to send message. Details: ' + error.message });
    }
  } else {
    console.error('Attempt to send to unknown user ID:', id);
    res.status(404).send({ status: 'error', message: 'Client not found.' });
  }
});


app.listen(port, () => console.log(`HTTP server is running on http://localhost:${port}`));
console.log('WebSocket server is running on ws://localhost:8080');