const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chat')
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err);
  });
