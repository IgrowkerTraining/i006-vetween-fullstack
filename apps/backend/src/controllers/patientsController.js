const patientsService = require("../services/patientsService");

//Obtener todos los pacientes
const getAll = async (req, res) => {
    try {

        const id_clinica = req.user.id_clinica;
        const patients = await patientsService.getAllPatients(id_clinica);

        return ResponseHelper.success(
            res,
            patients,
            'Pacientes obtenidos exitosamente'
        );
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
};

//Obtener paciente por ID
const getById = async (req, res) => {

    const id = parseInt(req.params.id);
    const id_clinica = req.user.id_clinica;

    try {
        const patient = await patientsService.getPatientById(id, id_clinica);

        if(!patient){
            return ResponseHelper.notFound(res, "Paciente no encontrado");
        }

        return ResponseHelper.success(
            res,
            patient,
            "Paciente obtenido exitosamente"
        );
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
};

//Crear paciente
const create = async (req, res) => {
    try{

        if (req.body.id_clinica !== req.user.id_clinica) {
            return ResponseHelper.forbidden(
                res,
                'No puedes crear pacientes en otra clínica'
            );
        }

        const newPatient = await patientsService.createPatient(req.body);

        return ResponseHelper.created(
            res,
            newPatient,
            'Paciente creado exitosamente'
        );
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
};

//Actualizar un paciente por ID
const update = async (req, res) => {    
    const id = parseInt(req.params.id);
    const id_clinica_token = req.user.id_clinica;

    try {

        if (
            req.body.id_clinica &&
            req.body.id_clinica !== id_clinica_token
        ) {
            return ResponseHelper.forbidden(
                res,
                'No puedes modificar pacientes de otra clínica'
            );
        }

        const updatedPatient = await patientsService.updatePatient(id, req.body, id_clinica_token);

        return ResponseHelper.success(
            res,
            updatedPatient,
            'Paciente actualizado correctamente'
        );
    } catch (error) {
        if (error.message === "PACIENTE_NO_ENCONTRADO") {
            return ResponseHelper.notFound(res, 'Paciente no encontrado');
        }

        if (error.message === "ACCESO_DENEGADO") {
            return ResponseHelper.forbidden(res, 'No autorizado');
        }

        if (error.message === "NO_SE_PUEDE_ACTIVAR_SIN_VISITAS") {
            return ResponseHelper.conflict(res, 'No se puede activar sin visitas');
        }

        if (error.message === "LIMITE_PACIENTES_ACTIVOS") {
            return ResponseHelper.conflict(res, 'Se alcanzó el límite de pacientes activos');
        }

        return ResponseHelper.error(res, error.message);
    }
};

//Eliminar un paciente por ID
const remove = async (req, res) => {
    const id = parseInt(req.params.id);
    const id_clinica = req.user.id_clinica;

    try {
        const deletedPatient = await patientsService.deletePatient(id, id_clinica);

        return ResponseHelper.success(
            res,
            null,
            'Paciente eliminado correctamente'
        );
    } catch (error) {
        if (error.message === "PACIENTE_NO_ENCONTRADO") {
            return ResponseHelper.notFound(res, 'Paciente no encontrado');
        }

        if (error.message === "ACCESO_DENEGADO") {
            return ResponseHelper.forbidden(res, 'No autorizado');
        }

        if (error.message === "NO_SE_PUEDE_ELIMINAR_CON_VISITAS") {
            return ResponseHelper.conflict(res, 'No se puede eliminar un paciente con visitas');
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