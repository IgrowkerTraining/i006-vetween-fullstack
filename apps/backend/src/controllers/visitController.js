const visitService = require('../services/visitService');
const ResponseHelper = require('../utils/responseHelper');

const createVisit = async (req, res) => {
    try {
        const visitData = req.body;
        const id_clinica = req.user.id_clinica;

        const nuevaVisita = await visitService.createVisit(visitData, id_clinica);
        
        return ResponseHelper.created(res, nuevaVisita, 'Visita clínica registrada con éxito');
    } catch (error) {
        if (error.message === 'PACIENTE_NO_ENCONTRADO') {
            return ResponseHelper.notFound(res, 'El paciente no existe');
        }

        if (error.message === 'ACCESO_DENEGADO') {
            return ResponseHelper.forbidden(res, 'El paciente no pertenece a su clínica');
        }

        if (error.message === 'LIMITE_PACIENTES_ACTIVOS') {
            return ResponseHelper.conflict(res, 'Se alcanzó el límite de 50 pacientes activos');
        }

        return ResponseHelper.error(res, error.message);
    }
};

const inactivateVisit = async (req, res) => {
    try {
        const idVisita = req.params.id;
        const id_clinica = req.user.id_clinica;

        const visitaInactivada = await visitService.inactivateVisit(idVisita, id_clinica);
        
        return ResponseHelper.success(res, visitaInactivada, 'Visita marcada como inactiva');
    } catch (error) {
        if (error.message === 'VISITA_NO_ENCONTRADA') {
            return ResponseHelper.notFound(res, 'No se encontró la visita');
        }

        if (error.message === 'PACIENTE_NO_ENCONTRADO') {
            return ResponseHelper.notFound(res, 'Paciente no encontrado');
        }

        if (error.message === 'ACCESO_DENEGADO') {
            return ResponseHelper.forbidden(
                res,
                'No autorizado para modificar esta visita'
            );
        }
        
        return ResponseHelper.error(res, error.message);
    }
};

const getPatientVisits = async (req, res) => {
    try {
        // el parámetro "id" en la URL del swagger corresponde al paciente
        const idPaciente = req.params.id;
        const id_clinica = req.user.id_clinica;
        
        const visitas = await visitService.getVisitsByPatientId(idPaciente, id_clinica);
        
        return ResponseHelper.success(res, visitas, 'Historial de visitas obtenido');
    } catch (error) {
        if (error.message === 'PACIENTE_NO_ENCONTRADO') {
            return ResponseHelper.notFound(res, 'No se encontró el paciente con el ID proporcionado');
        }

        if (error.message === 'ACCESO_DENEGADO') {
            return ResponseHelper.forbidden(res, 'El paciente no pertenece a su clínica');
        }

        return ResponseHelper.error(res, error.message);
    }
};

module.exports = {
    createVisit,
    inactivateVisit,
    getPatientVisits
};