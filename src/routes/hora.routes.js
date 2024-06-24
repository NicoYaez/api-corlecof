const express = require('express');
const router = express.Router();
const {
    agregarHoraMedica,
    obtenerHorasMedicas,
    obtenerHoraMedicaPorId,
    actualizarHoraMedica,
    eliminarHoraMedica
} = require('../controllers/hora.controller');

router.post('/add', agregarHoraMedica);
router.get('/list', obtenerHorasMedicas);
router.get('/:id', obtenerHoraMedicaPorId);
router.put('/update/:id', actualizarHoraMedica);
router.delete('/delete/:id', eliminarHoraMedica);

module.exports = router;