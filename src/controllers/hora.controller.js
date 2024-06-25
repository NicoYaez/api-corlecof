const express = require('express');
const mongoose = require('mongoose');
const HoraMedica = require('../models/horamedica');
const User = require('../models/user'); // Importa el modelo de User
const Paciente = require('../models/paciente'); // Importa el modelo de User

const agregarHoraMedica = async (req, res) => {
    try {
        const { profesionalId, pacienteId, status, asistencia, fecha, hora } = req.body;

        // Validar campos requeridos
        if (!profesionalId || !pacienteId || !fecha || !hora) {
            return res.status(400).json({ message: "Todos los campos requeridos deben ser proporcionados" });
        }

        // Verificar si el profesional existe y es de rol 'Profesional'
        const profesional = await User.findOne({ _id: profesionalId, role: 'Profesional' });
        if (!profesional) {
            return res.status(400).json({ message: "El ID de profesional proporcionado no corresponde a un profesional" });
        }

        // Verificar si el paciente existe y es de rol 'Paciente'
        const paciente = await Paciente.findOne({ _id: pacienteId, role: 'Paciente' });
        if (!paciente) {
            return res.status(400).json({ message: "El ID de paciente proporcionado no corresponde a un paciente" });
        }

        // Crear una nueva instancia de la cita médica
        const newAppointment = new HoraMedica({
            profesional: profesionalId,
            paciente: pacienteId,
            status: status || 'Programada', // Valor por defecto 'Programada' si no se proporciona
            asistancia: asistencia || false, // Valor por defecto 'false' si no se proporciona
            fecha,
            hora
        });

        // Guardar la nueva cita médica en la base de datos
        const savedAppointment = await newAppointment.save();

        res.status(201).json(savedAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener todas las citas médicas
const obtenerHorasMedicas = async (req, res) => {
    try {
        const citas = await HoraMedica.find();
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener una cita médica por ID
const obtenerHoraMedicaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el ID proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID de cita médica no válido" });
        }

        const cita = await HoraMedica.findById(id);
        if (!cita) {
            return res.status(404).json({ message: "Cita médica no encontrada" });
        }

        res.status(200).json(cita);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para actualizar una cita médica
const actualizarHoraMedica = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Verificar si el ID proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID de cita médica no válido" });
        }

        const updatedAppointment = await HoraMedica.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedAppointment) {
            return res.status(404).json({ message: "Cita médica no encontrada" });
        }

        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para eliminar una cita médica
const eliminarHoraMedica = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el ID proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID de cita médica no válido" });
        }

        const deletedAppointment = await HoraMedica.findByIdAndDelete(id);
        if (!deletedAppointment) {
            return res.status(404).json({ message: "Cita médica no encontrada" });
        }

        res.status(200).json({ message: "Cita médica eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerHorasMedicasFiltradas = async (req, res) => {
    try {
        const { profesionalId, fecha } = req.query;
        let citas;

        if (profesionalId && fecha) {
            // Filtrar citas por profesionalId y fecha
            citas = await HoraMedica.find({ profesionalId, fecha });
        } else if (profesionalId) {
            // Filtrar solo por profesionalId
            citas = await HoraMedica.find({ profesionalId });
        } else {
            // Obtener todas las citas si no se proporciona profesionalId
            citas = await HoraMedica.find();
        }

        res.status(200).json({ horasOcupadas: citas.map(cita => cita.hora) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    agregarHoraMedica,
    obtenerHorasMedicas,
    obtenerHoraMedicaPorId,
    actualizarHoraMedica,
    obtenerHorasMedicasFiltradas,
    eliminarHoraMedica,
};
