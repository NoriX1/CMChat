const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    _room: { type: Schema.Types.ObjectId, ref: 'room' },
    _user: {type: Schema.Types.ObjectId, ref: 'user'},
    content: String,
    dateSent: Date
});

const ModelClass = mongoose.model('messages', messageSchema);

module.exports = ModelClass;