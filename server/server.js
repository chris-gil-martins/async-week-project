if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const roomHosts = {};

io.on('connection', (socket) => {
  socket.on('joinHost', (streamer) => {
    roomHosts[streamer] = socket.id;
    socket.join(streamer);
  });

  socket.on('joinGuest', (streamer) => {
    socket.join(streamer);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('streamEnded');
  });

  socket.on('joinStream', ({ streamer, visitor }) => {
    io.to(roomHosts[streamer]).emit('requestJoin', { visitor });
  });

  socket.on('codeUpdate', ({ newVal, streamer }) => {
    socket.to(streamer).emit('codeUpdate', newVal);
  });

  socket.on('sendMessage', ({ name, message, streamer }) => {
    socket.to(streamer).emit('newMessage', { name, message });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
