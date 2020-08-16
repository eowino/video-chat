"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const http_1 = require("http");
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const socket_io_1 = tslib_1.__importDefault(require("socket.io"));
const routes_1 = require("./routes");
const PORT = process.env.PORT || 3000;
const app = express_1.default();
const server = new http_1.Server(app);
const io = socket_io_1.default(server);
app.set('view engine', 'ejs');
app.use(express_1.default.static('public'));
app.use(morgan_1.default('dev'));
app.use('/', routes_1.mainRouter);
io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});
server.listen(PORT);
