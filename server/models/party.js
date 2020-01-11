const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partySchema = new Schema({
    _room: { type: Schema.Types.ObjectId, ref: 'room' },
    _user: {type: Schema.Types.ObjectId, ref: 'user'}
});

const ModelClass = mongoose.model('partyes', partySchema);

module.exports = ModelClass;