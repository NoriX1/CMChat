const Party = require('../models/party');
const Room = require('../models/room');
const User = require('../models/user');

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
        const promises = rooms.map((room) => {
            return User.findOne({ _id: room._owner }, { name: 1 }).then((findedUser) => {
                if (findedUser) {
                    room._owner = findedUser;
                }
                return room;
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
        res.send(deletedRoom)
    })
}

exports.joinRoom = function (req, res, next) {
    const newParty = new Party({
        _room: req.body.room,
        _user: req.user
    })
    newParty.save((err, createdParty) => {
        if (err) { return next(err) };
        res.send(createdParty);
    });
}