// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarioController');

// Rutas CRUD
router.route('/')
  .get(obtenerUsuarios)
  .post(crearUsuario);

router.route('/:id')
  .get(obtenerUsuarioPorId)
  .put(actualizarUsuario)
  .delete(eliminarUsuario);

module.exports = router;