const aiReportService = require("../services/AIReportService");
const ResponseHelper = require("../utils/responseHelper");

const createSummary = async (req, res) => {
    try {
        const id_clinica = req.user.id_clinica;
        const { id_paciente } = req.body;

        const data = await aiReportService.generateSummary(id_paciente, id_clinica);
        
        return ResponseHelper.created(res, data, "Resumen de IA generado y guardado correctamente");

    } catch (error) {
        if (error.message.includes("Request failed with status code 422")) {
            return ResponseHelper.unprocessableEntity(res, "La IA no pudo procesar la solicitud. Verifique los datos enviados y vuelva a intentarlo.");
        }
        
        return ResponseHelper.error(res, error.message);
    }
};

const getSummariesByPatient = async (req, res) => {
    try {
        const id_paciente = parseInt(req.params.id);
        const id_clinica = req.user.id_clinica;

        const data = await aiReportService.getSummariesByPatientFromDB(id_paciente, id_clinica);

        return ResponseHelper.success(res, data, "Resúmenes obtenidos correctamente");

    } catch (error) {
        if (error.message.includes("Paciente no encontrado")) {
            return ResponseHelper.notFound(res, "Paciente no encontrado");
        }
        if (error.message.includes("Acceso denegado: El paciente no pertenece a su clínica")) {
            return ResponseHelper.forbidden(res, "Acceso denegado. El paciente no pertenece a su clínica");
        }

        return ResponseHelper.error(res, error.message);
    }
};

module.exports = {
    createSummary,
    getSummariesByPatient
};