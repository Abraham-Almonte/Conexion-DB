//server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/usuarios', usuarioRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});