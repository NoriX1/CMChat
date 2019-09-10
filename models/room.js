const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: { type: String, unique: true },
    _owner: { type: Schema.Types.ObjectId, ref: 'user' }
});

const ModelClass = mongoose.model('rooms', roomSchema);

module.exports = ModelClass;