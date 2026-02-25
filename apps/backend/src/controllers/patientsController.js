const patientsService = require("../services/patientsService");

//Obtener todos los pacientes
const getAll = async (req, res) => {
    try {
        const patients = await patientsService.getAllPatients();

        res.json({success: true, data: patients});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

//Obtener paciente por ID
const getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const patient = await patientsService.getPatientById(id);

        if(!patient){
            return res.status(404).json({message: "Paciente no encontrado"})
        }

        res.json({success: true, data: patient});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

//Crear paciente
const create = async (req, res) => {
    try{
        const newPatient = await patientsService.createPatient(req.body);

        res.status(201).json({success: true, data: newPatient});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

//Actualizar un paciente por ID
const update = async (req, res) => {    
    try {
        const id = parseInt(req.params.id);
        const updatedPatient = await patientsService.updatePatient(id, req.body);

        if(!updatedPatient){
            return res.status(404).json({message: "Paciente no encontrado"})
        }

        res.json({success: true, data: updatedPatient});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

//Eliminar un paciente por ID
const remove = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedPatient = await patientsService.deletePatient(id);

        return res.status(200).json(deletedPatient);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};