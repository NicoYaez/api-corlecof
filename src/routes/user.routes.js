const express = require('express');
const router = express.Router();
const { getUsers, getProfessionals, getProfesionalesEspecialidad } = require('../controllers/user.controller');

router.get('/list', getUsers);

router.get('/list/profesionales', getProfessionals);

router.get('/list/profesionales/:especialidad', getProfesionalesEspecialidad);

module.exports = router;