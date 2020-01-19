const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageStatusSchema = new Schema({
  _message: { type: Schema.Types.ObjectId, ref: 'message' },
  _user: { type: Schema.Types.ObjectId, ref: 'user' },
  isRead: Boolean
});

const ModelClass = mongoose.model('messageStatuses', messageStatusSchema);

module.exports = ModelClass;