const express = require('express');
const mongoose = require('mongoose');
const HoraMedica = require('../models/horamedica');

// Controlador para agregar una nueva cita médica
const agregarHoraMedica = async (req, res) => {
    try {
        const { profesional, pacient, status, assistance, appointmentDate, appointmentTime } = req.body;

        // Validar campos requeridos
        if (!profesional || !pacient || !appointmentDate || !appointmentTime) {
            return res.status(400).json({ message: "Todos los campos requeridos deben ser proporcionados" });
        }

        // Crear una nueva instancia de la cita médica
        const newAppointment = new HoraMedica({
            profesional,
            pacient,
            status: status || 'Scheduled', // Valor por defecto 'Scheduled' si no se proporciona
            assistance: assistance || false, // Valor por defecto 'false' si no se proporciona
            appointmentDate,
            appointmentTime
        });

        // Guardar la nueva cita médica en la base de datos
        const savedAppointment = await newAppointment.save();

        res.status(201).json(savedAppointment);
    } catch (error) {
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

module.exports = {
    agregarHoraMedica,
    obtenerHorasMedicas,
    obtenerHoraMedicaPorId,
    actualizarHoraMedica,
    eliminarHoraMedica
};
