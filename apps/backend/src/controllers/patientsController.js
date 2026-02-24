const patientsService = require("../services/patientsService");

//Obtener todos los pacientes
const getAll = (req, res) => {
    const patients = patientsService.getAllPatients();
    res.json({success: true, data: patients});
};

//Obtener paciente por ID
const getById = (req, res) => {
    const id = parseInt(req.params.id);

    const patient = patientsService.getPatientById(id);

    if(!patient){
        return res.status(404).json({message: "Paciente no encontrado"})
    }

    res.json({success: true, data: patient});
};

//Crear paciente
const create = (req, res) => {
    try{
        const newPatient = patientsService.createPatient(req.body);

        res.status(201).json({success: true, data: newPatient});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

//Actualizar un paciente por ID
const update = (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const updatedPatient = patientsService.updatePatient(id, req.body);

        if(!updatedPatient){
            return res.status(404).json({message: "Paciente no encontrado"})
        }

        res.json({success: true, data: updatedPatient});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

//Eliminar un paciente por ID
const remove = (req, res) => {
    const id = parseInt(req.params.id);

    const deletedPatient = patientsService.deletePatient(id);

    if(!deletedPatient){
        return res.status(404).json({message: "Paciente no encontrado"})
    }

    res.json({
        success: true,
        message: "Paciente eliminado correctamente",
        patient: deletedPatient
    });
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};