const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;
const rooms = new Map();

app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req, res) => res.json({ ok: true, game: 'DEAD SIGNAL', rooms: rooms.size }));

function roomState(room) {
  const r = rooms.get(room);
  if (!r) return [];
  return [...r.values()].map(p => ({ id: p.id, name: p.name, x: p.x, z: p.z, rot: p.rot }));
}
function broadcast(room) { io.to(room).emit('state', { players: roomState(room) }); }

io.on('connection', socket => {
  socket.on('joinRoom', data => {
    const room = String(data?.room || 'KITA01').toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 12) || 'KITA01';
    const name = String(data?.name || 'Survivor').slice(0, 18);
    if (!rooms.has(room)) rooms.set(room, new Map());
    const r = rooms.get(room);
    if (r.size >= 10) { socket.emit('roomError', { message: 'Room full (10 survivors max).' }); return; }
    if (socket.data.room) {
      const old = rooms.get(socket.data.room); old?.delete(socket.id); broadcast(socket.data.room);
    }
    socket.join(room); socket.data.room = room;
    r.set(socket.id, { id: socket.id, name, x: Number(data.x) || 0, z: Number(data.z) || 3, rot: 0 });
    socket.emit('welcome', { id: socket.id, room, count: r.size });
    broadcast(room);
  });
  socket.on('move', data => {
    const room = socket.data.room; if (!room) return;
    const p = rooms.get(room)?.get(socket.id); if (!p) return;
    const x = Number(data?.x), z = Number(data?.z), rot = Number(data?.rot);
    if (Number.isFinite(x)) p.x = Math.max(-66, Math.min(66, x));
    if (Number.isFinite(z)) p.z = Math.max(-62, Math.min(63, z));
    if (Number.isFinite(rot)) p.rot = rot;
    broadcast(room);
  });
  socket.on('disconnect', () => {
    const room = socket.data.room; if (!room) return;
    rooms.get(room)?.delete(socket.id);
    if (rooms.get(room)?.size === 0) rooms.delete(room); else broadcast(room);
  });
});
server.listen(PORT, () => console.log(`DEAD SIGNAL server running on port ${PORT}`));
