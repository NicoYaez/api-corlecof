const mongoose = require('mongoose');
const { Schema } = mongoose;

// Asumiendo que PacienteSchema y FichaMedicaSchema están definidos en otros archivos, necesitas importarlos
// Por ejemplo:
const Paciente = require('../models/paciente');
// const FichaMedicaSchema = require('./FichaMedica');
// Si los esquemas no están en archivos separados, asegúrate de definirlos antes de usarlos aquí.

const FichaPacienteSchema = new Schema({
    paciente: { 
        type: Schema.Types.ObjectId, 
        ref: 'Paciente', required: true 
    }, // Referencia al modelo Paciente
    edad: { 
        type: String, required: true 
    },
    fichasMedicas: [
        { type: Schema.Types.ObjectId, ref: 'FichaMedica', required: true }
    ], // Referencia a un array de FichaMedica
    estadoFicha: { 
        type: Boolean, required: true 
    },
});

// Creación del modelo 'FichaPaciente' a partir del esquema
const FichaPaciente = mongoose.model('FichaPaciente', FichaPacienteSchema);

module.exports = FichaPaciente;