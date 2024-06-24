const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Definir el esquema de Taller
const TallerSchema = new Schema({
    profesional: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    maxParticipants: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // Agrega las propiedades createdAt y updatedAt automáticamente
});

// Crear el modelo a partir del esquema
module.exports = model('Taller', TallerSchema);