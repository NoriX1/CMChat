const socketioJwt = require('socketio-jwt');
const keys = require('./config/keys');
const Message = require('./models/message');
const User = require('./models/user');

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
            const newMessage = new Message({
                _room: message.room,
                _user: socket.decoded_token.sub,
                content: message.content,
                dateSent: new Date()
            });
            newMessage.save((err, savedMessage) => {
                if (err) { return console.log(err) };
                User.findById(savedMessage._user, (err, findedUser) => {
                    if (err) { return console.log(err) };
                    savedMessage._user = findedUser;
                    io.to(savedMessage._room).emit('message', savedMessage);
                    console.log(`Message: "${savedMessage.content}" has been sent to room ${savedMessage._room}`);
                });
            });
        });

        socket.on('disconnect', () => {
            console.log(`User ${socket.decoded_token.sub} disconnected`);
        });

    });
}