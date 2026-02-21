const visitService = require('../services/visitService');
const ResponseHelper = require('../utils/responseHelper');

const createVisit = async (req, res) => {
    try {
        const visitData = req.body;
        const nuevaVisita = await visitService.createVisit(visitData);
        
        return ResponseHelper.created(res, nuevaVisita, 'Visita clínica registrada con éxito');
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
};

const inactivateVisit = async (req, res) => {
    try {
        const idVisita = req.params.id;
        const visitaInactivada = await visitService.inactivateVisit(idVisita);
        
        return ResponseHelper.success(res, visitaInactivada, 'Visita marcada como inactiva');
    } catch (error) {
        if (error.message === 'ERROR_INACTIVAR_VISITA') {
            return ResponseHelper.notFound(res, 'No se encontró la visita para inactivar');
        }
        
        return ResponseHelper.error(res, error.message);
    }
};

const getPatientVisits = async (req, res) => {
    try {
        // el parámetro "id" en la URL del swagger corresponde al paciente
        const idPaciente = req.params.id; 
        const visitas = await visitService.getVisitsByPatientId(idPaciente);
        
        return ResponseHelper.success(res, visitas, 'Historial de visitas obtenido');
    } catch (error) {
        if (error.message === 'PACIENTE_NO_ENCONTRADO') {
            return ResponseHelper.notFound(res, 'No se encontró el paciente con el ID proporcionado');
        }

        return ResponseHelper.error(res, error.message);
    }
};

module.exports = {
    createVisit,
    inactivateVisit,
    getPatientVisits
};