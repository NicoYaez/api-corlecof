const express = require('express');
const router = express.Router();
const { createTaller, listTalleres, updateTaller, getTallerById, assignProfesionalByRut, addPacientes, deleteTaller, removePaciente } = require('../controllers/taller.controller');

// Ruta para crear un nuevo taller
router.post('/register', createTaller);
// Ruta para listar todos los talleres
router.get('/list', listTalleres);
// Ruta para actualizar un taller
router.put('/:id', updateTaller);

router.get('/:id', getTallerById);
// Ruta para eliminar un taller
router.delete('/delete/:id', deleteTaller);

router.put('/:id/assign-profesional', assignProfesionalByRut);

router.put('/:id/assign-participants', addPacientes);

router.delete('/:id/remove-paciente', removePaciente);

module.exports = router;