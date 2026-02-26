const responsablesService = require("../services/responsiblesService");

// Obtener todos
const getAll = async (req, res) => {
    try {
        const responsibles = await responsablesService.getAll();
        res.json({ success: true, data: responsibles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener por ID
const getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const responsible = await responsablesService.getById(id);

        res.json({ success: true, data: responsible });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Crear
const create = async (req, res) => {
    try {
        const result = await responsablesService.create(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar
const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updated = await responsablesService.update(id, req.body);

        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update
};