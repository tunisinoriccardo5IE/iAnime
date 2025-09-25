const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Placeholder route
app.get('/', (req, res) => {
  res.send('iAnime backend attivo');
});

// Socket.io base
io.on('connection', (socket) => {
  console.log('Nuovo utente connesso');
  socket.on('disconnect', () => {
    console.log('Utente disconnesso');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
