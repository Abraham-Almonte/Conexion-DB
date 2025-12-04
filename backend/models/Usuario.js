// models/Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio']
  },
  edad: {
    type: Number,
    required: [true, 'La edad es obligatoria'],
    min: 1,
    max: 120
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);