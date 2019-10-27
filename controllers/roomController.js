const Room = require('../models/room');
const User = require('../models/user');
const Message = require('../models/message');
const Party = require('../models/party');

exports.createNewRoom = function (req, res, next) {
    if (!req.body.name) {
        return res.status(422).send({ error: "You must provide a name of room" });
    }
    if (!/^[A-Za-zА-Я-а-я0-9_]+$/.test(req.body.name)) {
        return res.status(422).send({ error: "Only letters and numbers (and _ ) are allowed in name" });
    }
    if (req.body.name.length > 10) {
        return res.status(422).send({ error: "Max length of name is 10 characters" });
    }
    if (req.body.private && !req.body.password) {
        return res.status(422).send({ error: "Private room should have a password!" });
    }

    Room.findOne({ name: req.body.name }, function (err, existingRoom) {
        if (err) { return next(err); }

        if (existingRoom) {
            return res.status(422).send({ error: `Room with name "${req.body.name}" is already exists` });
        }

        const room = new Room({
            name: req.body.name,
            _owner: req.user,
            isPrivate: req.body.private,
            password: req.body.password || ''
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
        const promises = rooms.map(({ _id, _owner, name, isPrivate }) => {
            return new Promise((resolve, reject) => {
                let changedRoom = { _id, _owner, name, isPrivate };
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
    Room.findOne({ _id: req.params.id }, { password: 0 }, (err, room) => {
        if (err) { return next(err); }
        if (!room) {
            return res.status(403).send('Room is not found!');
        }
        let changedRoom = room;
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

exports.checkPassword = function (req, res, next) {
    Room.findOne({ _id: req.body._id }, (err, room) => {
        if (err) return next(err);
        if (!room) return res.status(403).send('Room is not found!');
        room.comparePassword(req.body.roompassword, function (err, isMatch) {
            if (err) return next(err);
            if (!isMatch) return res.status(401).send({ error: 'Password is incorrect!' });
            res.send({ message: 'Password is correct!' });

        });
    });
}