const socketioJwt = require('socketio-jwt');
const keys = require('./config/keys');

module.exports = function (io) {

    io.use(socketioJwt.authorize({
        secret: keys.secret,
        handshake: true
    }));

    io.on('connect', (socket) => {
        socket.on('roomInformation', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.decoded_token.sub} connected to ${roomId}`);
        });

        socket.on('message', (message) => {
            console.log(`Message: "${message.content}" has been sent to room ${message.room}`);
            io.to(message.room).emit('message', message.content);
        })

        socket.on('disconnect', () => {
            console.log(`User ${socket.decoded_token.sub} disconnected`);
        });

    });
}