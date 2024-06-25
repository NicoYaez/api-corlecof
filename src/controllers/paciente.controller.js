const mongoose = require('mongoose');
const Paciente = require('../models/paciente');
const FichaPaciente = require('../models/fichapaciente');
const MedicalAppointment = require('../models/horamedica');

const createPaciente = async (req, res) => {
    try {
        const { rut, nombre, apellidoPaterno, apellidoMaterno, email, fichaMedica } = req.body;

        // Verificar si el RUT ya existe en la base de datos
        const existingPaciente = await Paciente.findOne({ rut });
        if (existingPaciente) {
            return res.status(400).json({ message: 'Ya existe un paciente con este RUT' });
        }

        // Crear un nuevo paciente con los datos recibidos
        const newPaciente = new Paciente({
            rut,
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            email,
            fichaMedica
        });

        // Guardar el nuevo paciente en la base de datos
        const savedPaciente = await newPaciente.save();

        res.status(200).json(savedPaciente);
    } catch (error) {
        console.error('Error al crear paciente:', error.message);
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

const updatePaciente = async (req, res) => {
    try {
        // Obtener el ID del paciente desde los parámetros de consulta (?id=...)
        const id = req.query.id;

        // Verificar si se proporcionó un ID válido
        if (!id) {
            return res.status(400).json({ message: 'Se requiere proporcionar un ID válido en los parámetros de consulta' });
        }

        // Crear el objeto de actualización basado en los parámetros de consulta
        const updateParams = { ...req.query };

        // Eliminar el ID de los parámetros de actualización para evitar actualizar el ID
        delete updateParams.id;

        // Realizar la actualización en la base de datos
        const updatedPaciente = await Paciente.findByIdAndUpdate(id, updateParams, { new: true });

        // Verificar si se encontró y actualizó al paciente
        if (!updatedPaciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Devolver al paciente actualizado
        res.json(updatedPaciente);
    } catch (error) {
        // Manejar errores de manera adecuada
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


const deletePaciente = (req, res) => {
    // Buscar y eliminar al paciente
    Paciente.findByIdAndDelete(req.params.id, (err, deletedPaciente) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (!deletedPaciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Buscar y eliminar la ficha del paciente
        FichaPaciente.deleteMany({ paciente: req.params.id }, (err, deletedFicha) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            // Buscar y eliminar las citas médicas del paciente
            MedicalAppointment.deleteMany({ paciente: req.params.id }, (err, deletedAppointments) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }

                let responseMessage = 'Paciente eliminado';
                if (deletedFicha) {
                    responseMessage += ', ficha eliminada';
                } else {
                    responseMessage += ', ficha no encontrada';
                }
                if (deletedAppointments.deletedCount > 0) {
                    responseMessage += `, ${deletedAppointments.deletedCount} citas médicas eliminadas`;
                } else {
                    responseMessage += ', no se encontraron citas médicas';
                }

                res.status(200).json({ message: responseMessage });
            });
        });
    });
};

module.exports = {
    createPaciente,
    getAllPacientes,
    getPacienteById,
    updatePaciente,
    deletePaciente
};
