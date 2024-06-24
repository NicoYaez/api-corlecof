const Paciente = require('../models/paciente');

// Crear un nuevo paciente
const createPaciente = async (req, res) => {
    try {
        const newPaciente = new Paciente(req.body);
        const savedPaciente = await newPaciente.save();
        res.status(201).json(savedPaciente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los pacientes
const getAllPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un paciente por su ID
const getPacienteById = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        if (paciente) {
            res.status(200).json(paciente);
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un paciente por su ID
const updatePaciente = async (req, res) => {
    try {
        const updatedPaciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedPaciente) {
            res.status(200).json(updatedPaciente);
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un paciente por su ID
const deletePaciente = async (req, res) => {
    try {
        const deletedPaciente = await Paciente.findByIdAndDelete(req.params.id);
        if (deletedPaciente) {
            res.status(200).json({ message: 'Paciente eliminado' });
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPaciente,
    getAllPacientes,
    getPacienteById,
    updatePaciente,
    deletePaciente
};
