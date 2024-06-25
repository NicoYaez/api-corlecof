const User = require("../models/user");
const Profesional = require("../models/profesional");

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

const especialidadesValidas = ['Medico', 'Kinesiologo', 'Nutricionista', 'Profesor', 'Psicologo'];

const getProfesionalesEspecialidad = async (req, res) => {
    try {
        // Obtener la especialidad desde los parámetros de la URL
        const especialidad = req.params.especialidad;

        // Validar que la especialidad proporcionada esté en la lista de especialidades válidas
        if (!especialidadesValidas.includes(especialidad)) {
            return res.status(400).json({ message: "Especialidad no válida" });
        }

        // Ejecutar la consulta para encontrar profesionales con la especialidad proporcionada
        const professionals = await Profesional.find({ role: 'Profesional', speciality: especialidad });

        // Devolver los profesionales encontrados
        res.status(200).json(professionals);
    } catch (error) {
        console.error('Error al obtener profesionales:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = getProfessionals;


module.exports = { getProfessionals, getUsers, getProfesionalesEspecialidad };