const vaccineService = require('../services/vaccineService');
const ResponseHelper = require('../utils/responseHelper');

const registerVaccine = async (req, res) => {
    try {
        const vaccineData = req.body;
        const nuevaVacuna = await vaccineService.registerVaccine(vaccineData);
        
        return ResponseHelper.created(res, nuevaVacuna, 'Vacuna aplicada registrada con éxito');
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
};

const inactivateVaccine = async (req, res) => {
    try {
        const idVacuna = req.params.id;
        const vacunaInactivada = await vaccineService.inactivateVaccine(idVacuna);
        
        return ResponseHelper.success(res, vacunaInactivada, 'Vacuna marcada como inactiva');
    } catch (error) {
        if (error.message === 'ERROR_INACTIVAR_VACUNA') {
            return ResponseHelper.notFound(res, 'No se encontró la vacuna para inactivar');
        }

        return ResponseHelper.error(res, error.message);
    }
};

const getPatientVaccines = async (req, res) => {
    try {
        // el parámetro "id" en la URL del swagger corresponde al paciente
        const idPaciente = req.params.id; 
        const vacunas = await vaccineService.getVaccineByPatientId(idPaciente);
        
        return ResponseHelper.success(res, vacunas, 'Historial de vacunas obtenido');
    } catch (error) {
        if (error.message === 'PACIENTE_NO_ENCONTRADO') {
            return ResponseHelper.notFound(res, 'No se encontró el paciente con el ID proporcionado');
        }

        return ResponseHelper.error(res, error.message);
    }
};

module.exports = {
    registerVaccine,
    inactivateVaccine,
    getPatientVaccines
};