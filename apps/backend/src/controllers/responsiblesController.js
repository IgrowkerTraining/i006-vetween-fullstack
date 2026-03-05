const responsablesService = require("../services/responsiblesService");
const ResponseHelper = require("../utils/responseHelper");

// Obtener todos
const getAll = async (req, res) => {
    try {
        const id_clinica = req.user.id_clinica;
        const responsibles = await responsablesService.getAll(id_clinica);
        
        return ResponseHelper.success(res, responsibles, "Responsables obtenidos correctamente");
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
};

// Obtener por ID
const getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const id_clinica = req.user.id_clinica;
        const responsible = await responsablesService.getById(id, id_clinica);

        return ResponseHelper.success(res, responsible, "Responsable obtenido correctamente");
    } catch (error) {
        if (error.message?.includes("RESPONSABLE_NO_ENCONTRADO")) {
            return ResponseHelper.notFound(res, "Responsable no encontrado");
        }
        return ResponseHelper.error(res, error.message);
    }
};

// Crear
const create = async (req, res) => {
    try {
        const id_clinica = req.user.id_clinica;
        const result = await responsablesService.create(req.body, id_clinica);
        
        return ResponseHelper.created(res, result, "Responsable creado correctamente");
    } catch (error) {
        if (error.message?.includes("EMAIL_DUPLICADO")) {
            return ResponseHelper.badRequest(res, "El email ingresado ya se encuentra registrado.");
        }
        return ResponseHelper.error(res, error.message);
    }
};

// Actualizar
const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const id_clinica = req.user.id_clinica;
        const updated = await responsablesService.update(id, req.body, id_clinica);

        return ResponseHelper.success(res, updated, "Responsable actualizado correctamente");
    } catch (error) {
        if (error.message?.includes("RESPONSABLE_NO_ENCONTRADO")) {
            return ResponseHelper.notFound(res, "Responsable no encontrado");
        }
        if (error.message?.includes("EMAIL_DUPLICADO")) {
            return ResponseHelper.badRequest(res, "El email ingresado ya se encuentra registrado.");
        }
        return ResponseHelper.error(res, error.message);
    }
};

// Eliminar un responsable por ID
const remove = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const id_clinica = req.user.id_clinica;
        
        const deletedResponsible = await responsablesService.deleteResponsible(id, id_clinica);

        return ResponseHelper.deleted(res, "Responsable eliminado correctamente");
    } catch (error) {
        if (error.message.includes("RESPONSABLE_NO_ENCONTRADO")) {
            return ResponseHelper.notFound(res, "Responsable no encontrado");
        }
        if (error.message.includes("NO_SE_PUEDE_ELIMINAR")) {
            return ResponseHelper.badRequest(res, "No se puede eliminar un responsable con pacientes asociados");
        }

        return ResponseHelper.error(res, error.message);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};