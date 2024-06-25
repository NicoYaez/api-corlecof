const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/paciente.controller');

// Ruta para crear un nuevo paciente
router.post('/add', pacienteController.createPaciente);

// Ruta para obtener todos los pacientes
router.get('/list', pacienteController.getAllPacientes);

// Ruta para obtener un paciente por su ID
router.get('/:id', pacienteController.getPacienteById);

// Ruta para actualizar un paciente por su ID
router.put('/', pacienteController.updatePaciente);

// Ruta para eliminar un paciente por su ID
router.delete('/delete/:id', pacienteController.deletePaciente);

module.exports = router;