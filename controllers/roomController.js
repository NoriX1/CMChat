const Room = require('../models/room');

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

        room.save((err) => {
            if (err) { return next(err); }
            res.send(room);
        });
    });
}

exports.getAllRooms = function (req, res, next) {
    Room.find((err, rooms) => {
        if (err) { return next(err); }
        res.send(rooms);
    });
}

exports.deleteRoom = function (req, res, next) {
    Room.findOneAndDelete({ _id: req.params.id, _owner: req.user.id }, (err, deletedRoom) => {
        if (err) { return next(err); }
        if (!deletedRoom) return res.status(403).send({ error: 'You haven`t got permissions to delete this room' });
        res.send(deletedRoom)
    })
}