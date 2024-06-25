const FichaPaciente = require('../models/fichapaciente'); // Asegúrate de que la ruta al modelo es correcta

// Crear una nueva ficha de paciente
exports.create = async (req, res) => {
    try {
        const fichaPaciente = new FichaPaciente(req.body);
        const savedFichaPaciente = await fichaPaciente.save();
        res.status(200).json(savedFichaPaciente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todas las fichas de pacientes
exports.findAll = async (req, res) => {
    try {
        const fichasPacientes = await FichaPaciente.find().populate('paciente');
        res.json(fichasPacientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una ficha de paciente por ID
exports.findOne = async (req, res) => {
    try {
        const fichaPaciente = await FichaPaciente.findById(req.params.id).populate('paciente');
        if (!fichaPaciente) {
            return res.status(404).json({ message: 'Ficha de Paciente no encontrada' });
        }
        res.json(fichaPaciente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buscar una ficha por la ID del paciente usando un parámetro de consulta
exports.findByPacienteId = async (req, res) => {
    try {
        const pacienteId = req.query.id; // Obtiene el ID del paciente desde el parámetro de consulta 'id'
        const fichaPaciente = await FichaPaciente.findOne({ paciente: pacienteId }).populate('paciente');
        if (!fichaPaciente) {
            return res.status(404).json({ message: 'Ficha no encontrada para el paciente con el ID proporcionado' });
        }
        res.json(fichaPaciente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una ficha de paciente por ID
exports.update = async (req, res) => {
    try {
        const fichaPaciente = await FichaPaciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!fichaPaciente) {
            return res.status(404).json({ message: 'Ficha de Paciente no encontrada' });
        }
        res.json(fichaPaciente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar una ficha de paciente por ID
exports.delete = async (req, res) => {
    try {
        const fichaPaciente = await FichaPaciente.findByIdAndDelete(req.params.id);
        if (!fichaPaciente) {
            return res.status(404).json({ message: 'Ficha de Paciente no encontrada' });
        }
        res.json({ message: 'Ficha de Paciente eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.asignarPaciente = async (req, res) => {
    try {
        const { fichaId, pacienteId } = req.params; // Capturar fichaId y pacienteId de los parámetros de la URL

        // Verificar si fichaId proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(fichaId)) {
            return res.status(404).json({ message: "ID de ficha no válido" });
        }

        // Buscar la ficha por ID
        const ficha = await FichaPaciente.findById(fichaId);
        if (!ficha) {
            return res.status(404).json({ message: "Ficha no encontrada" });
        }

        // Asignar el ID del paciente a la ficha
        ficha.paciente = pacienteId;

        // Guardar la ficha actualizada en la base de datos
        await ficha.save();

        res.status(200).json({ message: "Paciente asignado con éxito a la ficha" });
    } catch (error) {
        console.error('Error al asignar paciente a la ficha:', error.message);
        res.status(500).json({ message: "Error al asignar paciente a la ficha" });
    }
};