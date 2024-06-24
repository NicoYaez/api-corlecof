const mongoose = require('mongoose');
const User = require('./user');

// Definir discriminador para Admin
const Admin = User.discriminator('Admin', new mongoose.Schema({}));

module.exports = Admin;