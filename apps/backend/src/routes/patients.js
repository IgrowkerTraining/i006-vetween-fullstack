const express = require("express");

const router = express.Router();

//Array en memoria
let patients = [];
let idCounter = 1;

//GET todos los pacientes
router.get("/", (req, res) => {
    res.json({success: true, data: patients});
});

//POST crear paciente
router.post("/", (req, res) => {
    const {name, species, age} = req.body;

    if(!name || !species || !age ){
        return res.status(400).json({
            message: "Faltan campos obligatorios"
        });
    }

    const activePatients = patients.filter(p => p.active === true);

    if(activePatients.length >= 3){
        return res.status(400).json({
            message: "No se pueden registrar más de 50 pacientes activos"
        });
    }

    const newPatient = {
        id: idCounter++,
        name,
        species,
        age,
        active: true
    };

    patients.push(newPatient);

    res.status(201).json({success: true, data: newPatient});
});

//GET paciente por ID
router.get("/:id", (req,res) => {
    const id = parseInt(req.params.id);

    const patient = patients.find(p => p.id === id);

    if(!patient){
        return res.status(404).json({message: "Paciente no encontrado"})
    }

    res.json({success: true, data: patient});
});

//PUT actualizar paciente por ID
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const {name, species, age, active} = req.body;

    const patientIndex = patients.findIndex(p => p.id === id);

    if(patientIndex === -1){
        return res.status(404).json({message: "Paciente no encontrado"});
    }

    const currentPatient = patients[patientIndex];

    if(active === true && currentPatient.active === false){
        const activePatients = patients.filter(p => p.active === true);

        if(activePatients.length >= 3){
            return res.status(400).json({
                message: "No se pueden activar más de 50 pacientes"
            });
        }
    }

    const updatedPatient = {
        ...currentPatient,
        name: name ?? currentPatient.name,
        species: species ?? currentPatient.species,
        age: age ?? currentPatient.age,
        active: active ?? currentPatient.active
    };

    patients[patientIndex] = updatedPatient;

    res.json({success: true, data: updatedPatient});
});

//DELETE un paciente por ID
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    
    const patientIndex = patients.findIndex(p => p.id === id);

    if(patientIndex === -1){
        return res.status(404).json({message: "Paciente no encontrado"})
    }

    const deletedPatient = patients.splice(patientIndex, 1);

    res.json({
        success: true,
        message: "Paciente eliminado correctamente",
        patient: deletedPatient[0]
    });
});

module.exports = router;