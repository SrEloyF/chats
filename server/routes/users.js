// /server/routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

router.get('/:correo', (req, res) => {
  const { correo } = req.params;
  db.query('SELECT correo FROM usuarios WHERE correo != ?', [correo], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    res.json(results);
  });
});

module.exports = router;