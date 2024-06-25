const mongoose = require('mongoose');
const { Schema } = mongoose;

const Paciente = require('../models/paciente');

// Definición del esquema para citas médicas
const HoraMedicaSchema = new Schema({
    profesional: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paciente: { 
        type: Schema.Types.ObjectId, 
        ref: 'Paciente', required: true 
    },
    status: { type: String, enum: ['Programada', 'Completada', 'Cancellada'], default: 'Programada' },
    asistancia: { type: Boolean, default: false },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true }
});

// Creación del modelo 'MedicalAppointment' a partir del esquema
const MedicalAppointment = mongoose.model('HoraMedica', HoraMedicaSchema);

module.exports = MedicalAppointment;