import express from 'express';
import { Server } from 'http';
import morgan from 'morgan';
import Socket from 'socket.io';

import { mainRouter } from './routes';

const PORT = process.env.PORT || 3000;

const app = express();
const server = new Server(app); // Server that will be used by socket.io
const io = Socket(server); // informs socket.io which server we are using - injects lib to DOM

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(morgan('dev'));

app.use('/', mainRouter);

// On  connection, emit the scoket that the user is connecting to
io.on('connection', (socket) => {
    // Listen to events
    socket.on('join-room', (roomId, userId) => {
        // Inform other users that we have joined
        socket.join(roomId);

        // Send a message to everyone one in Room
        // but not back to me because we know we have connected. We don't need to receive a message saying we have connected
        socket.to(roomId).broadcast.emit('user-connected', userId);

        // When a user disconnects
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});

server.listen(PORT);
