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
        User.findOne({ _id: socket.decoded_token.sub }, { password: 0 }, (err, findedUser) => {
            if (err || !findedUser) {
                return socket.emit('errorEvent', { type: err ? err.name : 404, code: err ? err.message : 'User is not found!' });
            }
            socket.currentUser = findedUser;
            console.log(`***** User ${socket.currentUser.name} : ${socket.id} connected *****`);
        });

        socket.on('joinRoom', (roomId) => {
            Room.findOne({ _id: roomId }, (err, findedRoom) => {
                if (err || !findedRoom) {
                    return socket.emit('errorEvent', { type: err ? err.name : 404, code: err ? err.message : 'Room is not found!' });
                }
                new Party({
                    _room: roomId,
                    _user: socket.decoded_token.sub
                }).save((err, savedParty) => {
                    if (err || !savedParty) {
                        return socket.emit('errorEvent', { type: err ? err.name : 505, code: err ? err.message : 'Error with joining this room!' });
                    }
                    Party.countDocuments({ _room: roomId, _user: socket.currentUser._id }, (err, count) => {
                        if (count === 1) {
                            io.to(roomId).emit('joinUser', socket.currentUser);
                            socket.broadcast.emit('updateRoomInList', { id: roomId });
                        }
                    });
                    socket.join(roomId);
                    console.log(`User ${socket.currentUser.name} : ${socket.id} connected to ${roomId}`);
                });
            });
        });

        socket.on('message', (message) => {
            Room.findOne({ _id: message.room }, (err, findedRoom) => {
                if (message.content.length > 4096) {
                    return socket.emit('errorEvent', { type: err ? err.name : 404, code: err ? err.message : 'Max length of message is 4096 letters' });
                }
                if (err || !findedRoom) {
                    return socket.emit('errorEvent', { type: err ? err.name : 404, code: err ? err.message : 'Room is not found!' });
                }
                const newMessage = new Message({
                    _room: message.room,
                    _user: socket.currentUser,
                    content: message.content,
                    dateSent: new Date()
                });
                newMessage.save((err, savedMessage) => {
                    if (err) { return console.log(err) };
                    io.to(savedMessage._room).emit('message', savedMessage);
                    console.log(`Message: "${savedMessage.content}" has been sent to room ${savedMessage._room}`);
                });
            });
        });

        socket.on('closeRoom', (roomId) => {
            Party.deleteMany({ _room: roomId }, (err) => {
                if (err) { return io.to(roomId).emit('errorEvent', { type: err.name, code: err.message }); }
                io.to(roomId).emit('closeRoom');
                socket.broadcast.emit('updateRoomList');
                console.log(`Room with id: ${roomId} is closed by owner`);
            });
        });

        socket.on('leaveRoom', (roomId) => {
            Party.deleteOne({ _room: roomId, _user: socket.currentUser._id }, (err) => {
                if (err) { return console.log(err); }
                socket.leave(roomId);
                console.log(`User ${socket.currentUser.name} : ${socket.id} disconnected ${roomId}`);
                Room.findById(roomId, (err, res) => {
                    if (res) {
                        Party.countDocuments({ _room: roomId, _user: socket.currentUser._id }, (err, count) => {
                            if (!count) {
                                io.to(roomId).emit('disconnectUser', socket.currentUser);
                                socket.broadcast.emit('updateRoomInList', { id: roomId });
                            }
                        });
                    }
                });
            });
        });

        socket.on('updateRoomInList', (roomId) => { socket.broadcast.emit('updateRoomInList', roomId) });
        socket.on('updateRoomList', () => { socket.broadcast.emit('updateRoomList') });

        socket.on('disconnect', () => {
            console.log(`***** User ${socket.currentUser.name} : ${socket.id} disconnected *****`);
        });
    });
}