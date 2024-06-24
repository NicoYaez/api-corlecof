const User = require("../models/user");

const getUsers = async (req, res) => {
    try {
        const users = await User.find(); // Obtener todos los usuarios
        res.status(200).json(users); // Devolver los usuarios en formato JSON
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = { getUsers };