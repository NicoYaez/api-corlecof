const mongoose = require('mongoose');
const User = require('./user');

// Definir discriminador para Secretary
const Secretary = User.discriminator('Secretary', new mongoose.Schema({}));

module.exports = Secretary;
