const patientAndResponsibleService = require('../services/patientAndResponsible');
const ResponseHelper = require('../utils/responseHelper');

const createPatientAndResponsible = async (req, res) => {
    try {
        const id_clinica = req.user.id_clinica; // Viene del token JWT gracias al middleware de autenticación
        const result = await patientAndResponsibleService.createPatientAndResponsible(req.body, id_clinica);
        
        ResponseHelper.created(res, 'Paciente y responsable registrados exitosamente', result);
    } catch (error) {
        ResponseHelper.badRequest(res, "Error al crear paciente: " + error.message);
    }
};

const getAllPatient = async (req, res) => {
    try {
        const id_clinica = req.user.id_clinica;
        const pacientes = await patientAndResponsibleService.getAllPatientsByClinic(id_clinica);
        
        ResponseHelper.success(res, pacientes);
    } catch (error) {
        ResponseHelper.error(res, "Error al obtener todos los pacientes", error);
    }
};

const getPatientById = async (req, res) => {
    try {
        const id_paciente = req.params.id;
        const id_clinica = req.user.id_clinica;
        
        const paciente = await patientAndResponsibleService.getPatientById(id_paciente, id_clinica);
        
        ResponseHelper.success(res, paciente, "Paciente obtenido exitosamente");
    } catch (error) {
        ResponseHelper.notFound(res, error.message);
    }
};

const updatePatient = async (req, res) => {
    try {
        const id_paciente = req.params.id;
        const id_clinica = req.user.id_clinica;
        const updateData = req.body;
        
        const pacienteActualizado = await patientAndResponsibleService.updatePatientById(id_paciente, id_clinica, updateData);
        
        ResponseHelper.success(res, pacienteActualizado, 'Paciente actualizado exitosamente');
    } catch (error) {
        ResponseHelper.badRequest(res, "Error al actualizar paciente: " + error.message);
    }
};

const removePatient = async (req, res) => {
    try {
        const id_paciente = req.params.id;
        const id_clinica = req.user.id_clinica;
        
        await patientAndResponsibleService.deletePatient(id_paciente, id_clinica);
        
        res.status(200).json({
            success: true,
            message: 'Paciente eliminado exitosamente del sistema'
        });
    } catch (error) {
        // Si el error es por las visitas, devolverá el mensaje sugerido de pasarlo a inactivo
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Controladores para responsables

const getAllResponsibles = async (req, res) => {
    try {
        const id_clinica = req.user.id_clinica;
        const responsables = await patientAndResponsibleService.getAllResponsiblesByClinic(id_clinica);
        
        ResponseHelper.success(res, responsables);
    } catch (error) {
        ResponseHelper.error(res, "Error al obtener responsables", error);
    }
};

const getResponsibleById = async (req, res) => {
    try {
        const id_responsable = req.params.id;
        const id_clinica = req.user.id_clinica;
        
        const responsable = await patientAndResponsibleService.getResponsibleById(id_responsable, id_clinica);
        
        ResponseHelper.success(res, responsable, "Responsable obtenido exitosamente");
    } catch (error) {
        ResponseHelper.notFound(res, error.message);
    }
};

const updateResponsible = async (req, res) => {
    try {
        const id_responsable = req.params.id;
        const id_clinica = req.user.id_clinica;
        const updateData = req.body;
        
        const responsableActualizado = await patientAndResponsibleService.updateResponsibleById(id_responsable, id_clinica, updateData);
        
        ResponseHelper.success(res, responsableActualizado, 'Responsable actualizado exitosamente');
    } catch (error) {
        ResponseHelper.badRequest(res, "Error al actualizar responsable: " + error.message);
    }
};

module.exports = {
    createPatientAndResponsible,
    getAllPatient,
    getPatientById,
    updatePatient,
    removePatient,
    getAllResponsibles,
    getResponsibleById,
    updateResponsible
};