const mongoose = require('mongoose');
const { Schema } = mongoose;

const Paciente = require('../models/paciente');

const FichaPacienteSchema = new Schema({
    paciente: { 
        type: Schema.Types.ObjectId, 
        ref: 'Paciente', required: true 
    },
    edad: { 
        type: String, required: true 
    },
    estadoFicha: { 
        type: Boolean, default: false
    },
});

// Creación del modelo 'FichaPaciente' a partir del esquema
const FichaPaciente = mongoose.model('FichaPaciente', FichaPacienteSchema);

module.exports = FichaPaciente;

/*    fichasMedicas: [
        { type: Schema.Types.ObjectId, ref: 'FichaMedica', required: true }
    ], // Referencia a un array de FichaMedica*/