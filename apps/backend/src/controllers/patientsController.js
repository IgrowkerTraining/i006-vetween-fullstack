const patientsService = require("../services/patientsService");
const ResponseHelper = require("../utils/responseHelper");

// Obtener todos los pacientes
const getAll = async (req, res) => {
    try {
        const id_clinica = req.user.id_clinica;
        const { page, limit } = req.query;

        const patients = await patientsService.getAllPatients(id_clinica, parseInt(page) || 1, parseInt(limit) || 10);

        return ResponseHelper.success(res, patients, "Pacientes obtenidos correctamente");
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
};

// Obtener paciente por ID
const getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const id_clinica = req.user.id_clinica;

        const patient = await patientsService.getPatientById(id, id_clinica);

        return ResponseHelper.success(res, patient, "Paciente obtenido correctamente");
    } catch (error) {
        if (error.message.includes("PACIENTE_NO_ENCONTRADO")) {
            return ResponseHelper.notFound(res, "Paciente no encontrado");
        }
        return ResponseHelper.error(res, error.message);
    }
};

// Crear paciente
const create = async (req, res) => {
    try{
        const id_clinica = req.user.id_clinica;
        const newPatient = await patientsService.createPatient(req.body, id_clinica);

        return ResponseHelper.created(res, newPatient, "Paciente creado correctamente");
    } catch (error) {
        if (error.message.includes("PACIENTE_DUPLICADO")) {
            return ResponseHelper.badRequest(res, "El responsable ya tiene un paciente registrado con las mismas características (nombre, especie, edad).");
        }
        if (error.message.includes("ID_RESPONSABLE_NO_EXISTE")) {
            return ResponseHelper.notFound(res, "El responsable indicado no existe");
        }

        if (error.message.includes("ID_CLINICA_NO_EXISTE")) {
            return ResponseHelper.notFound(res, "La clínica indicada no existe");
        }

        if (error.message.includes("MICROCHIP_DUPLICADO")) {
            return ResponseHelper.badRequest(res, "El número de microchip ingresado ya se encuentra registrado en otro paciente.");
        }
        return ResponseHelper.error(res, error.message);
    }
};

// Actualizar un paciente por ID
const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const id_clinica = req.user.id_clinica;
        const updatedPatient = await patientsService.updatePatient(id, req.body, id_clinica);

        return ResponseHelper.success(res, updatedPatient, "Paciente actualizado correctamente");
    } catch (error) {
        if (error.message.includes("MICROCHIP_DUPLICADO")) {
            return ResponseHelper.badRequest(res, "El número de microchip ingresado ya se encuentra registrado en otro paciente.");
        }
        if (error.message.includes("PACIENTE_NO_ENCONTRADO")) {
            return ResponseHelper.notFound(res, "Paciente no encontrado");
        }
        if (error.message.includes("NO_SE_PUEDE_ACTIVAR")) {
            return ResponseHelper.badRequest(res, "No se puede activar un paciente sin visitas registradas");
        }
        if (error.message.includes("LIMITE_ALCANZADO")) {
            return ResponseHelper.badRequest(res, "No se pueden registrar más de 10 pacientes activos por clínica");
        }
        return ResponseHelper.error(res, error.message);
    }
};

// Eliminar un paciente por ID
const remove = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const id_clinica = req.user.id_clinica;
        
        const deletedPatient = await patientsService.deletePatient(id, id_clinica);

        return ResponseHelper.deleted(res, "Paciente eliminado correctamente");
    } catch (error) {
        if (error.message.includes("PACIENTE_NO_ENCONTRADO")) {
            return ResponseHelper.notFound(res, "Paciente no encontrado");
        }
        if (error.message.includes("NO_SE_PUEDE_ELIMINAR")) {
            return ResponseHelper.badRequest(res, "No se puede eliminar un paciente con visitas registradas");
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