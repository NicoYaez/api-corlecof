const mongoose = require('mongoose');
const { Schema } = mongoose;

// Definición del esquema para citas médicas
const HoraMedicaSchema = new Schema({
    profesional: { type: String, required: true },
    pacient: { type: String, required: true },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    assistance: { type: Boolean, default: false },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true }
});

// Creación del modelo 'MedicalAppointment' a partir del esquema
const MedicalAppointment = mongoose.model('HoraMedica', HoraMedicaSchema);

module.exports = MedicalAppointment;