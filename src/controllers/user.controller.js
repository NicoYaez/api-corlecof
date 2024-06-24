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
const getProfessionals = async (req, res) => {
    try {
        // Construir el objeto de consulta inicial para buscar por rol 'profesional'
        let query = { role: 'Profesional' };

        // Si se proporciona una especialidad, añadirla al objeto de consulta
        if (req.query.especialidad) {
            query.especialidad = req.query.especialidad;
        }

        // Ejecutar la consulta con el objeto de consulta construido
        const professionals = await User.find(query);

        // Devolver los profesionales encontrados
        res.status(200).json(professionals);
    } catch (error) {
        console.error('Error al obtener profesionales:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = { getProfessionals, getUsers };