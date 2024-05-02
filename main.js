const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const WebSocket = require('ws');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const wss = new WebSocket.Server({ port: 8080 });

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
      return;
    }

    if (data.type === 'send') {
      const { text, time } = data;
      const username = usersMap[userId];
      axios.post('http://your-backend-server/send', {
        id: userId,
        username,
        text,
        time
      })
      .then(response => {
        response.status();
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
    delete connections[userId];
    delete usersMap[userId];
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
