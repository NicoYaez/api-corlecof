const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  rut: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  apellidoMaterno: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fichaMedica: {
    type: Boolean,
    required: true,
    default: false
  }
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;