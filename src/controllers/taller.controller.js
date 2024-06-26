const Taller = require('../models/taller');
const User = require('../models/user');
const Paciente = require('../models/paciente');
const mongoose = require('mongoose');

// Función para validar RUTs
function validarRUT(rut) {
    // Eliminar puntos y guión
    const valor = rut.replace(/\./g, '').replace('-', '');
    // Cuerpo y dígito verificador
    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1).toUpperCase();

    // Si no cumple con el mínimo ej. (10.000.000-0)
    if (cuerpo.length < 7) { return false; }

    // Calcular dígito verificador
    let suma = 0;
    let multiplo = 2;

    // Para cada dígito del cuerpo
    for (let i = 1; i <= cuerpo.length; i++) {
        // Obtener su producto con el múltiplo correspondiente
        const index = multiplo * valor.charAt(cuerpo.length - i);

        // Sumar al contador general
        suma = suma + index;

        // Actualizar múltiplo
        if (multiplo < 7) {
            multiplo = multiplo + 1;
        } else {
            multiplo = 2;
        }
    }

    // Calcular dígito verificador en base al módulo 11
    const dvEsperado = 11 - (suma % 11);

    // Casos especiales (0 y K)
    dv = (dv == 'K') ? 10 : dv;
    dv = (dv == 0) ? 11 : dv;

    // Validar el dígito verificador
    return dvEsperado.toString() === dv;
}

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
        const taller = await Taller.findById(id).populate('participants');

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

const addPacientes = async (req, res) => {
    try {
        const { id } = req.params; // Capturar la ID del taller desde la URL
        const { pacientesRUT } = req.body; // RUTs de los pacientes a agregar

        // Verificar si el ID proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID de taller no válido" });
        }

        // Buscar el taller y verificar la capacidad antes de agregar pacientes
        const taller = await Taller.findById(id);
        if (!taller) {
            return res.status(404).json({ message: "Taller no encontrado" });
        }

        // Calcular el espacio disponible
        const espacioDisponible = taller.maxParticipants - taller.participants.length;
        if (espacioDisponible < pacientesRUT.length) {
            return res.status(400).json({ message: "No hay suficiente espacio para agregar a todos los pacientes" });
        }

        // Buscar los ObjectId de los pacientes por sus RUTs
        const pacientesObjectId = await Promise.all(pacientesRUT.map(async (rut) => {
            const paciente = await Paciente.findOne({ rut: rut }); // Usando el modelo Paciente
            if (!paciente) {
                throw new Error(`Paciente no encontrado con RUT: ${rut}`);
            }
            return paciente._id;
        }));

        // Actualizar el taller agregando los ObjectId de los pacientes sin duplicados
        const updatedTaller = await Taller.findByIdAndUpdate(id, {
            $addToSet: { participants: { $each: pacientesObjectId } }
        }, { new: true });

        res.status(200).json(updatedTaller);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar pacientes al taller" });
    }
};

const removePaciente = async (req, res) => {
    try {
        const { id } = req.params; // Capturar la ID del taller desde la URL
        const { pacienteRUT } = req.body; // RUT del paciente a eliminar

        // Verificar si el ID proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "ID de taller no válido" });
        }

        // Buscar el taller
        const taller = await Taller.findById(id);
        if (!taller) {
            return res.status(404).json({ message: "Taller no encontrado" });
        }

        // Buscar el ObjectId del paciente por su RUT
        const paciente = await Paciente.findOne({ rut: pacienteRUT }); // Usando el modelo Paciente
        if (!paciente) {
            return res.status(404).json({ message: `Paciente no encontrado con RUT: ${pacienteRUT}` });
        }

        // Actualizar el taller eliminando el ObjectId del paciente
        const updatedTaller = await Taller.findByIdAndUpdate(id, {
            $pull: { participants: paciente._id }
        }, { new: true });

        res.status(200).json(updatedTaller);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar paciente del taller" });
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
    addPacientes,
    deleteTaller,
    removePaciente
};
