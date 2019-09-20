const socketioJwt = require('socketio-jwt');
const keys = require('./config/keys');
const Message = require('./models/message');
const User = require('./models/user');
const Room = require('./models/room');
const Party = require('./models/party');

module.exports = function (io) {

    io.use(socketioJwt.authorize({
        secret: keys.secret,
        handshake: true
    }));

    io.on('connect', (socket) => {
        socket.on('roomInformation', (roomId) => {

            Party.countDocuments({ _room: roomId, _user: socket.decoded_token.sub }, (err, count) => {
                if (count) {
                    return socket.emit('errorEvent', {
                        type: err ? err.name : 403,
                        code: err ? err.message : 'You already joined this room. Close other tabs and try again!'
                    });
                }
            });

            Room.findOne({ _id: roomId }, (err, findedRoom) => {
                if (err || !findedRoom) {
                    return socket.emit('errorEvent', { type: err ? err.name : 404, code: err ? err.message : 'Room is not found!' });
                }
            });

            User.findOne({ _id: socket.decoded_token.sub }, { password: 0 }, (err, findedUser) => {
                if (err || !findedUser) {
                    return socket.emit('errorEvent', { type: err ? err.name : 404, code: err ? err.message : 'User is not found!' });
                }
                socket.join(roomId);
                io.to(roomId).emit('joinUser', findedUser);
                console.log(`User ${socket.decoded_token.sub} connected to ${roomId}`);
            });

            new Party({
                _room: roomId,
                _user: socket.decoded_token.sub
            }).save((err, savedParty) => {
                if (err || !savedParty) {
                    return socket.emit('errorEvent', { type: err ? err.name : 505, code: err ? err.message : 'Error with joining this room!' });
                }
            });

        });

        socket.on('message', (message) => {
            Room.findOne({ _id: message._room }, (err, findedRoom) => {
                if (err || !findedRoom) {
                    return socket.emit('errorEvent', { type: err ? err.name : 404, code: err ? err.message : 'Room is not found!' });
                }
            });
            const newMessage = new Message({
                _room: message.room,
                _user: socket.decoded_token.sub,
                content: message.content,
                dateSent: new Date()
            });
            newMessage.save((err, savedMessage) => {
                if (err) { return console.log(err) };
                User.findById(savedMessage._user, { password: 0 }, (err, findedUser) => {
                    if (err) { return console.log(err) };
                    savedMessage._user = findedUser;
                    io.to(savedMessage._room).emit('message', savedMessage);
                    console.log(`Message: "${savedMessage.content}" has been sent to room ${savedMessage._room}`);
                });
            });
        });

        socket.on('closeRoom', (roomId) => {
            Party.deleteMany({ _room: roomId }, (err) => {
                if (err) { return io.to(roomId).emit('errorEvent', { type: err.name, code: err.message }); }
            });
            console.log(`Room with id: ${roomId} is closed by owner`);
            io.to(roomId).emit('closeRoom');
        })

        socket.on('disconnectUser', (roomId) => {
            User.findOne({ _id: socket.decoded_token.sub }, { password: 0 }, (err, findedUser) => {
                if (err || !findedUser) {
                    return socket.emit('errorEvent', { type: err ? err.name : 404, code: err ? err.message : 'User is not found!' });
                }
                Party.deleteOne({ _room: roomId, _user: findedUser._id }, (err) => {
                    if (err) { return console.log(err); }
                });
                socket.leave(roomId);
                io.to(roomId).emit('disconnectUser', findedUser);
            });
        });

        socket.on('disconnect', () => {
            Party.deleteMany({ _user: socket.decoded_token.sub }, (err) => {
                if (err) { return console.log(err); }
            });
            console.log(`User ${socket.decoded_token.sub} disconnected`);
        });

    });
}