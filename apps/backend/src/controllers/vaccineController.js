const vaccineService = require('../services/vaccineService');
const ResponseHelper = require('../utils/responseHelper');

const registerVaccine = async (req, res) => {
    try {

        const idClinica = req.user.id_clinica; // viene del JWT

        const nuevaVacuna = await vaccineService.registerVaccine(req.body, idClinica);
        
        return ResponseHelper.created(res, nuevaVacuna, 'Vacuna aplicada registrada con éxito');
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
};

const inactivateVaccine = async (req, res) => {
    try {
        const idVacuna = req.params.id;
        const idClinica = req.user.id_clinica;

        const vacunaInactivada = await vaccineService.inactivateVaccine(idVacuna, idClinica);
        
        return ResponseHelper.success(res, vacunaInactivada, 'Vacuna marcada como inactiva');
    } catch (error) {
        if (error.message === 'VACUNA_NO_ENCONTRADA') {
            return ResponseHelper.notFound(res, 'Vacuna no encontrada');
        }

        if (error.message === 'NO_AUTORIZADO_CLINICA') {
            return ResponseHelper.unauthorized(
                res,
                'No autorizado para modificar esta vacuna'
            );
        }

        return ResponseHelper.error(res, error.message);
    }
};

const getPatientVaccines = async (req, res) => {
    try {
        // el parámetro "id" en la URL del swagger corresponde al paciente
        const idPaciente = req.params.id; 
        const idClinica = req.user.id_clinica; // viene del JWT
        const { page, limit } = req.query;

        const vacunas = await vaccineService.getVaccineByPatientId(idPaciente, idClinica, parseInt(page) || 1, parseInt(limit) || 4);
        
        return ResponseHelper.success(res, vacunas, 'Historial de vacunas obtenido');
    } catch (error) {
        if (error.message === 'PACIENTE_NO_ENCONTRADO') {
            return ResponseHelper.notFound(
                res,
                'No se encontró el paciente con el ID proporcionado'
            );
        }

        if (error.message === 'PACIENTE_NO_PERTENECE_A_LA_CLINICA') {
            return ResponseHelper.unauthorized(
                res,
                'No autorizado para acceder a este paciente'
            );
        }

        return ResponseHelper.error(res, error.message);
    }
};

module.exports = {
    registerVaccine,
    inactivateVaccine,
    getPatientVaccines
};