const User = require("../models/user");
const { Role } = require("../models/role");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const { generateToken } = require("../utils/tokenManager");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendRegister, sendEmailUpdate } = require('../services/emailService');


function generatePassword() {
  const length = 16,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

const register = async (req, res) => {
  const { serial, roles } = req.body; // Recibo los datos
  let { username } = req.body; // Recibo los datos
  const email = req.body.email.toLowerCase();
  const password = generatePassword();

  if (!serial) {
    return res.status(400).json({ message: "Debe proporcionar un número de serie" });
  }

  if (!username) {
    username = email.split('@')[0];
  }

  // Verificar si ya existe un usuario con el mismo nombre de usuario
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "El correo ya está en uso" });
  }

  const newUser = new User({
    username: username,
    email: email,
    password: password,
    serial: Array.isArray(serial) ? serial : [serial],  // Asegurándonos de que "serial" es un array
  });

  newUser.password = await newUser.encryptPassword(password); //Cifrar contraseña

  // si se le da un rol lo que hace es buscar ese rol y darle la id al nuevo usuario como array
  // en caso de no tener un rol se le dara el rol por defecto llamado user
  if (roles) {
    const foundRoles = await Role.find({ name: { $in: roles } });
    newUser.roles = foundRoles.map((role) => role._id);
  } else {
    const role = await Role.findOne({ name: "user" });
    newUser.roles = [role._id];
  }

  const userSave = await newUser.save(); //Usuario Guardado
  await sendRegister(username, email, password); // Enviar correo electrónico

  const { token, expiresIn } = generateToken({ id: userSave._id, serial: userSave.serial }, res);

  return res.status(200).json({ token, expiresIn });
};

const login = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();

    console.log(email)

    const userFound = await User.findOne({
      email: email,
    }).populate("roles");
    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    //Verificar Contraseñas
    const matchPassword = await User.validatePassword(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
      return res
        .status(401)
        .json({ token: null, message: "Contraseña incorrecta" });
    const expiresIn = 60 * 60 * 24;

    try {
      const roles = await Role.find({ _id: { $in: userFound.roles } }); // Buscar los roles dentro de user
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          const token = jwt.sign({ id: userFound._id, role: userFound.roles[i].name, serial: userFound.serial }, process.env.SECRET_API, {
            expiresIn,
          });
          return res.status(200).json({ token });
        }
        if (roles[i].name === "user") {
          const token = jwt.sign({ id: userFound._id, role: userFound.roles[i].name, serial: userFound.serial }, process.env.SECRET_API, {
            expiresIn,
          });
          return res.status(200).json({ token });
        }
      }
    } catch (error) {
      console.log(error);
    };

  } catch (error) {
    console.log(error);
  };
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'No user found with this email.' });
  }

  // Generate reset token and set expiration
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = Date.now() + 3600000; // Token valid for 1 hour

  user.passwordResetToken = resetToken;
  user.passwordResetExpires = resetExpires;

  await user.save();

  // Send email to user with reset link
  await sendPasswordResetEmail(user.email, resetToken);

  res.status(200).json({ message: 'Password reset email sent.' });
};

const resetPassword = async (req, res) => {
  const { token: { token: tokenString }, password } = req.body;

  const user = await User.findOne({ passwordResetToken: tokenString, passwordResetExpires: { $gt: Date.now() } });

  if (!user) {
    return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
  }

  // Hash new password and clear reset token fields
  user.password = bcrypt.hashSync(password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({ message: 'Password has been reset. You can now log in with your new password.' });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ auth: false, message: 'Token no proporcionado' });
  }
  const extractedToken = token.split(' ')[1];

  if (!extractedToken) {
    return res.status(401).json({ auth: false, message: 'Token no proporcionado' });
  }

  if (!process.env.SECRET_API) {
    return res.status(500).json({ message: "La clave secreta del API no está definida" });
  }

  let decoded;
  try {
    decoded = jwt.verify(extractedToken, process.env.SECRET_API);
  } catch (err) {
    return res.status(401).json({ auth: false, message: 'Token no es válido' });
  }

  const userId = decoded.id;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Debe proporcionar la contraseña actual, la nueva contraseña y la confirmación de la nueva contraseña" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "La nueva contraseña y la confirmación de la nueva contraseña deben coincidir" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const validPassword = await user.comparePassword(currentPassword);

  if (!validPassword) {
    return res.status(400).json({ message: "La contraseña actual es incorrecta" });
  }

  const samePassword = await user.comparePassword(newPassword);

  if (samePassword) {
    return res.status(400).json({ message: "La nueva contraseña no puede ser la misma que la actual" });
  }

  user.password = await user.encryptPassword(newPassword);
  await user.save();

  return res.status(200).json({ message: "Contraseña actualizada con éxito" });
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error });
  }
};

module.exports = { register, login, requestPasswordReset, resetPassword, changePassword, getUserByEmail };
