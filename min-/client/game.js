const socket = io();
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let playerId = null;
let players = {};

socket.on('init', data => {
  playerId = data.id;
  players = data.players;
});

socket.on('new-player', ({ id, player }) => {
  players[id] = player;
});

socket.on('update', serverPlayers => {
  players = serverPlayers;
});

socket.on('remove-player', id => {
  delete players[id];
});

document.addEventListener('keydown', e => {
  const keyMap = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
  if (keyMap[e.key]) socket.emit('move', keyMap[e.key]);
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let id in players) {
    const p = players[id];
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 30, 30);
  }
  requestAnimationFrame(gameLoop);
}
gameLoop();
