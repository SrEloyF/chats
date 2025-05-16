const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participantes: [String]
});

module.exports = mongoose.model('Chat', chatSchema);
