const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const players = {};

app.use(express.static('client'));

io.on('connection', socket => {
  console.log('Player connected:', socket.id);
  players[socket.id] = { x: 300, y: 300, color: getRandomColor() };

  socket.emit('init', { id: socket.id, players });
  socket.broadcast.emit('new-player', { id: socket.id, player: players[socket.id] });

  socket.on('move', dir => {
    const p = players[socket.id];
    if (!p) return;
    if (dir === 'left') p.x -= 5;
    if (dir === 'right') p.x += 5;
    if (dir === 'up') p.y -= 5;
    if (dir === 'down') p.y += 5;

    io.emit('update', players);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('remove-player', socket.id);
  });
});

function getRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

http.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});