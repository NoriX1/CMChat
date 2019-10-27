const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: { type: String, unique: true },
    _owner: { type: Schema.Types.ObjectId, ref: 'user' },
    isPrivate: { type: Boolean, default: false },
    password: String
});

roomSchema.pre('save', function (next) {
    const room = this;
    if (room.isPrivate && !room.password) { return next(); };
    bcrypt.genSalt(10, function (err, salt) {
        if (err) { return next(err); }

        bcrypt.hash(room.password, salt, null, function (err, hash) {
            if (err) { return next(err); }

            room.password = hash;
            next();
        });
    });
});

roomSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) { return callback(err); }
        callback(null, isMatch);
    });
}

const ModelClass = mongoose.model('rooms', roomSchema);

module.exports = ModelClass;