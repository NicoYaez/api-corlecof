const Taller = require('../models/taller');
const User = require('../models/user'); // Asegúrate de importar el modelo User correctamente
const mongoose = require('mongoose');

// Controlador para crear un nuevo taller
const createTaller = async (req, res) => {
    try {
        const { profesional, startTime, endTime, duration, participants, name, description, type, maxParticipants } = req.body;

        // Validaciones de los campos requeridos
        if (!profesional || !startTime || !endTime || !duration || !name || !type || !maxParticipants) {
            return res.status(400).json({ message: "Todos los campos requeridos deben ser proporcionados" });
        }

        // Crear el taller
        const newTaller = new Taller({
            profesional,
            startTime,
            endTime,
            duration,
            participants,
            name,
            description,
            type,
            maxParticipants
        });

        // Guardar el taller en la base de datos
        const savedTaller = await newTaller.save();

        res.status(200).json(savedTaller);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para listar todos los talleres
const listTalleres = async (req, res) => {
    try {
        const talleres = await Taller.find().populate('profesional participants');
        res.status(200).json(talleres);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para editar un taller
const updateTaller = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Todos los campos enviados en la solicitud

        // Verificar si el ID proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID de taller no válido" });
        }

        // Construir objeto con los campos que se pueden actualizar
        const allowedUpdates = ['profesional', 'startTime', 'endTime', 'duration', 'participants', 'name', 'description', 'type', 'maxParticipants'];
        const updatesToApply = {};

        allowedUpdates.forEach((field) => {
            if (updates[field] !== undefined) {
                updatesToApply[field] = updates[field];
            }
        });

        // Buscar y actualizar el taller
        const updatedTaller = await Taller.findByIdAndUpdate(
            id,
            updatesToApply,
            { new: true, runValidators: true }
        ).populate('profesional participants');

        // Verificar si se encontró y actualizó correctamente el taller
        if (!updatedTaller) {
            return res.status(404).json({ message: "Taller no encontrado" });
        }

        res.status(200).json(updatedTaller);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

// Controlador para obtener un taller por su ID
const getTallerById = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el ID proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID de taller no válido" });
        }

        // Buscar el taller por ID y poblar los campos de profesional y participantes
        const taller = await Taller.findById(id).populate('profesional participants');

        // Verificar si se encontró el taller
        if (!taller) {
            return res.status(404).json({ message: "Taller no encontrado" });
        }

        res.status(200).json(taller);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para asignar un profesional a un taller por su RUT
const assignProfesionalByRut = async (req, res) => {
    try {
        const { id } = req.params // ID del taller al que se va a asignar el profesional
        const { rut } = req.body; // RUT del profesional seleccionado desde el frontend

        console.log(id, rut);

        // Verificar si el ID proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID de taller no válido" });
        }

        // Buscar al profesional por su RUT
        const profesional = await User.findOne({ rut });
        if (!profesional) {
            return res.status(404).json({ message: "Profesional no encontrado" });
        }

        // Buscar el taller por su ID
        const taller = await Taller.findById(id);
        if (!taller) {
            return res.status(404).json({ message: "Taller no encontrado" });
        }

        // Asignar el ID del profesional al taller
        taller.profesional = profesional.rut;

        // Guardar los cambios en la base de datos
        const savedTaller = await taller.save();

        res.status(200).json(savedTaller);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para agregar participantes a un taller
const addParticipants = async (req, res) => {
    try {
        const { id } = req.params; // Capturar la ID del taller desde la URL
        const { participantIds } = req.body; // IDs de los participantes a agregar

        // Verificar si el ID proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID de taller no válido" });
        }

        // Verificar si los IDs de participantes son válidos
        const invalidParticipantIds = participantIds.filter(participantId => !mongoose.Types.ObjectId.isValid(participantId));
        if (invalidParticipantIds.length > 0) {
            return res.status(404).json({ message: "Uno o más IDs de participantes no son válidos" });
        }

        // Buscar el taller por su ID
        const taller = await Taller.findById(id);
        if (!taller) {
            return res.status(404).json({ message: "Taller no encontrado" });
        }

        // Verificar si hay espacio disponible para los nuevos participantes
        const currentParticipantsCount = taller.participants.length;
        const maxParticipants = taller.maxParticipants;
        const participantsToAdd = participantIds.filter(participantId => !taller.participants.includes(participantId));
        const participantsToAddCount = participantsToAdd.length;
        
        if (currentParticipantsCount + participantsToAddCount > maxParticipants) {
            return res.status(400).json({ message: "No hay suficiente espacio para agregar a todos los participantes" });
        }

        // Agregar los nuevos participantes al taller
        taller.participants.push(...participantsToAdd);

        // Guardar los cambios en la base de datos
        const savedTaller = await taller.save();

        res.status(200).json(savedTaller);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Función para eliminar un taller por su ID
const deleteTaller = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del taller desde los parámetros de la ruta
        const taller = await Taller.findById(id); // Buscar el taller por ID

        if (!taller) {
            return res.status(404).json({ message: "Taller no encontrado" });
        }

        await taller.remove(); // Eliminar el taller encontrado
        res.status(200).json({ message: "Taller eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTaller,
    listTalleres,
    updateTaller,
    getTallerById,
    assignProfesionalByRut,
    addParticipants,
    deleteTaller
};
