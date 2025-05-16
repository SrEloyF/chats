
const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  id_chat: { type: mongoose.Types.ObjectId, required: true },
  emisor: { type: String, required: true },
  contenido: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mensaje', mensajeSchema);
