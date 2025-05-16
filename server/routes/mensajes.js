// /server/routes/mensajes.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const Mensaje = require('../models/mensaje');

router.get('/', async (req, res) => {
  const { usuario1, usuario2 } = req.query;
  try {
    const chat = await Chat.findOne({ participantes: { $all: [usuario1, usuario2] } });
    if (!chat) return res.json([]);
    
    const mensajes = await Mensaje.find({ id_chat: chat._id }).sort({ fecha: 1 });
    res.json(mensajes);
  } catch (err) {
    console.error("Error al obtener mensajes:", err);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
});

module.exports = router;