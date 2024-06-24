const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/user.controller');

// Ruta para crear un nuevo taller
router.get('/list', getUsers);

module.exports = router;