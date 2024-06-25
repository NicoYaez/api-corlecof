const express = require('express');
const router = express.Router();
const fichaPacienteController = require('../controllers/ficha.controller'); // Asegúrate de que la ruta al controlador es correcta

router.post('/add', fichaPacienteController.create);
router.get('/list', fichaPacienteController.findAll);
router.get('/:id', fichaPacienteController.findOne);
router.put('/:id', fichaPacienteController.update);
router.delete('/delete/:id', fichaPacienteController.delete);

router.get('/', fichaPacienteController.findByPacienteId);

// Ruta para asignar un paciente a una ficha
router.put('/ficha/:fichaId/paciente/:pacienteId', fichaPacienteController.asignarPaciente);


module.exports = router;