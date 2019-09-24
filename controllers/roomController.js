const Room = require('../models/room');
const User = require('../models/user');
const Message = require('../models/message');
const Party = require('../models/party');

exports.createNewRoom = function (req, res, next) {
    if (!req.body.name) {
        return res.status(422).send({ error: "You must provide a name of room" });
    }
    Room.findOne({ name: req.body.name }, function (err, existingRoom) {
        if (err) { return next(err); }

        if (existingRoom) {
            return res.status(422).send({ error: 'Room with this name is already exists!' });
        }

        const room = new Room({
            name: req.body.name,
            _owner: req.user
        });

        room.save((err, createdRoom) => {
            if (err) { return next(err); }
            res.send(createdRoom);
        });
    });
}

exports.getAllRooms = function (req, res, next) {
    Room.find((err, rooms) => {
        if (err) { return next(err); }
        const promises = rooms.map(({ _id, _owner, name }) => {
            return new Promise((resolve, reject) => {
                let changedRoom = { _id, name };
                User.findOne({ _id: _owner }, { name: 1 }, (err, findedUser) => {
                    if (findedUser) {
                        changedRoom._owner = findedUser;
                    }
                    Party.distinct('_user', { '_room': _id }, (err, partyes) => {
                        changedRoom.countOfUsers = partyes.length;
                        resolve(changedRoom);
                    });
                });
            });
        });
        Promise.all(promises).then((roomsWithUser) => {
            res.send(roomsWithUser);
        });
    });
}

exports.getRoom = function (req, res, next) {
    Room.findOne({ _id: req.params.id }, (err, room) => {
        if (err) { return next(err); }
        if (!room) {
            return res.status(403).send('Room is not found!');
        }
        let changedRoom = { _id: room._id, name: room.name };
        User.findOne({ _id: room._owner }, { name: 1 }, (err, findedUser) => {
            if (findedUser) {
                changedRoom._owner = findedUser;
            }
            Party.distinct('_user', { '_room': room._id }, (err, partyes) => {
                changedRoom.countOfUsers = partyes.length;
                res.send(changedRoom);
            });
        });
    });
}

exports.deleteRoom = function (req, res, next) {
    Room.findOneAndDelete({ _id: req.params.id, _owner: req.user.id }, (err, deletedRoom) => {
        if (err) { return next(err); }
        if (!deletedRoom) return res.status(403).send({ error: 'You haven`t got permissions to delete this room' });
        Message.deleteMany({ _room: deletedRoom._id }, (err) => {
            if (err) { return next(err); }
            res.send(deletedRoom);
        });

    });
}

exports.getAllMessagesFromRoom = function (req, res, next) {
    Message.find({ _room: req.params.id }, (err, messages) => {
        if (err) { return next(err); }
        const promises = messages.map((message) => {
            return User.findOne({ _id: message._user }, { password: 0 }).then((findedUser) => {
                if (findedUser) {
                    message._user = findedUser;
                }
                return message;
            });
        });
        Promise.all(promises).then((messagesWithUser) => {
            res.send(messagesWithUser);
        });
    }).sort({ dateSent: -1 }).limit(50);
}

exports.getAllUsersOfRoom = function (req, res, next) {
    Room.findOne({ _id: req.params.id }, (err, room) => {
        if (err) { return next(err); }
        if (!room) {
            return res.status(403).send('Room is not found!');
        }
        Party.distinct('_user', { '_room': room._id }, (err, partyes) => {
            if (!partyes.length) {
                return res.send([]);
            }
            const promises = partyes.map((party) => {
                return User.findOne({ _id: party }, { password: 0 }).then((findedUser) => {
                    if (findedUser) {
                        return findedUser;
                    }
                });
            })
            Promise.all(promises).then((userList) => {
                res.send(userList);
            });
        });
    });
}