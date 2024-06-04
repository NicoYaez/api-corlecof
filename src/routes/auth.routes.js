const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authJwt = require("../middlewares/auth.jwt");
const verifyRegister = require("../middlewares/verifyRegister");

router.post('/register', [authJwt.isAdmin,verifyRegister.checkRegisterUser, verifyRegister.checkRolesExisted], authController.register);

router.post('/login', authController.login);

router.post('/request-password-reset', authController.requestPasswordReset);

router.post('/reset-password', authController.resetPassword);

router.post('/change-password', authController.changePassword);

module.exports = router;
