const express = require('express');
const router = express.Router();
const { createTaller, listTalleres, updateTaller, getTallerById, assignProfesionalByRut, addParticipants, deleteTaller } = require('../controllers/taller.controller');

// Ruta para crear un nuevo taller
router.post('/register', createTaller);
// Ruta para listar todos los talleres
router.get('/list', listTalleres);
// Ruta para actualizar un taller
router.put('/:id', updateTaller);

router.get('/:id', getTallerById);
// Ruta para eliminar un taller
router.delete('/:id', deleteTaller);

router.put('/:id/assign-profesional', assignProfesionalByRut);

router.put('/:id/assign-participants', addParticipants);

module.exports = router;