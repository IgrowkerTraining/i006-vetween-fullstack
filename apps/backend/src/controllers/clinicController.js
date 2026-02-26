const clinicService = require('../services/clinicService');
const { updateClinicSchema } = require('../schemas/clinicSchema');
const ResponseHelper = require('../utils/responseHelper');

const update = async (req, res) => {
    try {
        const { id_clinica } = req.user; 
        
        const updatedClinic = await clinicService.updateClinic(id_clinica, req.body);

        return ResponseHelper.success(res, updatedClinic, "Clínica actualizada exitosamente");
    } catch (error) {
        return ResponseHelper.error(res, 'Error al actualizar clínica', error);
    }
};

const getOne = async (req, res) => {
    try {
        const { id_clinica } = req.user;
        const clinic = await clinicService.getMyClinic(id_clinica);
        return ResponseHelper.success(res, clinic, "Clínica obtenida exitosamente");
    } catch (error) {
        return ResponseHelper.error(res, 'Error al obtener clínica', error);
    }
}

module.exports = { update, getOne };