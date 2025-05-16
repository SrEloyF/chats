// /server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/mysql');

router.post('/register', async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const hash = await bcrypt.hash(contrasena, 10);
    db.query('INSERT INTO usuarios (correo, contrasena) VALUES (?, ?)', [correo, hash], (err) => {
      if (err) {
        console.error('Error al registrar el usuario:', err);
        return res.status(500).json({ error: 'Error al registrar' });
      }
      res.json({ mensaje: 'Usuario registrado' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registro' });
  }
});

router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;
  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ error: 'Usuario no encontrado' });
    const valido = await bcrypt.compare(contrasena, results[0].contrasena);
    if (!valido)
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    res.json({ mensaje: 'Login exitoso' });
  });
});

module.exports = router;