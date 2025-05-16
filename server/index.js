const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('./db/mysql');
const mongo = require('./db/mongo');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const mensajesRoutes = require('./routes/mensajes');

const Chat = require('./models/chat');
const Mensaje = require('./models/mensaje');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Rutas HTTP
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/mensajes', mensajesRoutes);  // Se añade para GET /mensajes

const usuariosConectados = {};

io.on('connection', (socket) => {
  socket.on('registrarUsuario', (correo) => {
    usuariosConectados[correo] = socket.id;
  });

  // Modifica el evento 'mensaje' en el socket.io
  socket.on('mensaje', async (data) => {
    const { emisor, receptor, contenido } = data;

    // Buscar el chat existente o crear uno nuevo
    let chat = await Chat.findOne({ participantes: { $all: [emisor, receptor] } });
    if (!chat) {
      chat = new Chat({ participantes: [emisor, receptor] });
      await chat.save();
    }

    // Determinar el receptor automáticamente
    const receptorReal = chat.participantes.find(p => p !== emisor);

    // Crear y guardar el mensaje
    const mensaje = new Mensaje({
      id_chat: chat._id,
      emisor,
      contenido,
      fecha: new Date()
    });
    await mensaje.save();

    // Construir objeto para el frontend
    const mensajeFrontend = {
      _id: mensaje._id,
      _idTemp: data._idTemp, // ID temporal
      emisor: mensaje.emisor,
      receptor: receptorReal,
      contenido: mensaje.contenido,
      fecha: mensaje.fecha
    };

    // Emitir a ambos participantes
    const participantes = chat.participantes;
    participantes.forEach(correo => {
      const socketId = usuariosConectados[correo];
      if (socketId) {
        io.to(socketId).emit('mensaje', mensajeFrontend);
      }
    });
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
