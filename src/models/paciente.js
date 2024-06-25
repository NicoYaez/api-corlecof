const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  rut: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellidoPaterno: {
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
    unique: false
  },
  fichaMedica: {
    type: Boolean,
    required: true,
    default: false
  }
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;