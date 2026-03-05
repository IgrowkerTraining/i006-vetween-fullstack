const responsablesService = require("../services/responsiblesService");

// Obtener todos
const getAll = async (req, res) => {
    try {
        const responsibles = await responsablesService.getAll();
        res.json({ success: true, message: "Datos de los responsables obtenidos exitosamente", data: responsibles });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error interno del servidor", errors: error.message });
    }
};

// Obtener por ID
const getById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const responsible = await responsablesService.getById(id);

        res.json({ success: true, message: `Datos del responsable con ID ${id} obtenidos exitosamente`, data: responsible });
    } catch (error) {
        res.status(404).json({ success: false, message: `Error al obtener el responsable con ID ${id}`, errors: error.message });
    }
};

// Crear
const create = async (req, res) => {
    try {
        const result = await responsablesService.create(req.body);
        res.status(201).json({ success: true, message: "Responsable creado exitosamente", data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error al crear el responsable", errors: error.message });
    }
};

// Actualizar
const update = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const updated = await responsablesService.update(id, req.body);

        res.json({ success: true, message: `Responsable con ID ${id} actualizado exitosamente`, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: `Error al actualizar el responsable con ID ${id}`, errors: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update
};