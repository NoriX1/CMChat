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
                    Party.countDocuments({ _room: _id }, (err, countOfUsers) => {
                        changedRoom.countOfUsers = countOfUsers;
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

exports.deleteRoom = function (req, res, next) {
    Room.findOneAndDelete({ _id: req.params.id, _owner: req.user.id }, (err, deletedRoom) => {
        if (err) { return next(err); }
        if (!deletedRoom) return res.status(403).send({ error: 'You haven`t got permissions to delete this room' });
        Message.deleteMany({ _room: deletedRoom._id }, (err) => {
            if (err) { return next(err); }
            res.send(deletedRoom);
        });

    })
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