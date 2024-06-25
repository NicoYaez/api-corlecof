const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

// Definir las especialidades válidas
const especialidadesValidas = ['Medico', 'Kinesiologo', 'Nutricionista', 'Profesor', 'Psicologo'];

// Definir el schema para el Profesional
const profesionalSchema = new Schema({
    speciality: {
        type: String,
        required: true,
        enum: especialidadesValidas // La especialidad debe estar en la lista de especialidades válidas
    }
});

// Crear el discriminador para Profesional
const Profesional = User.discriminator('Profesional', profesionalSchema);

module.exports = Profesional;