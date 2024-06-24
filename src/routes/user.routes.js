const express = require('express');
const router = express.Router();
const { getUsers, getProfessionals } = require('../controllers/user.controller');

router.get('/list', getUsers);

router.get('/list/profesionales', getProfessionals);

module.exports = router;