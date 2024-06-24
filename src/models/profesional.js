const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

// Definir discriminador para Profesional
const profesionalSchema = new Schema({
    speciality: {
        type: String,
        required: true
    }
});

const Profesional = User.discriminator('Profesional', profesionalSchema);

module.exports = Profesional;
