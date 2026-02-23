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
    const {nombre, especie, edad, color, senia, sexo, raza, peso, esterilizado, tiene_microchip, num_microchip, id_responsable} = req.body;

    if(nombre === undefined || especie === undefined || edad === undefined || sexo === undefined || raza === undefined || peso === undefined || esterilizado === undefined || tiene_microchip === undefined || id_responsable === undefined){
        return res.status(400).json({
            message: "Faltan campos requeridos"
        });
    }

    if(tiene_microchip === true && !num_microchip){
        return res.status(400).json({message: "Debe especificar el número de microchip"});
    }

    const activePatients = patients.filter(p => p.activo === true);

    if(activePatients.length >= 3){
        return res.status(400).json({
            message: "No se pueden registrar más de 50 pacientes activos"
        });
    }

    const newPatient = {
        id_paciente: idCounter++,
        nombre,
        especie,
        edad,
        color: color || null,
        senia: senia || null,
        sexo,
        raza,
        peso,
        esterilizado,
        tiene_microchip,
        num_microchip: num_microchip || null,        
        activo: true,
        id_responsable
    };

    patients.push(newPatient);

    res.status(201).json({success: true, data: newPatient});
});

//GET paciente por ID
router.get("/:id", (req,res) => {
    const id = parseInt(req.params.id);

    const patient = patients.find(p => p.id_paciente === id);

    if(!patient){
        return res.status(404).json({message: "Paciente no encontrado"})
    }

    res.json({success: true, data: patient});
});

//PUT actualizar paciente por ID
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const {nombre, especie, edad, color, senia, sexo, raza, peso, esterilizado, tiene_microchip, num_microchip, activo,id_responsable} = req.body;

    const patientIndex = patients.findIndex(p => p.id_paciente === id);

    if(patientIndex === -1){
        return res.status(404).json({message: "Paciente no encontrado"});
    }

    const currentPatient = patients[patientIndex];

    if(activo === true && currentPatient.activo === false){
        const activePatients = patients.filter(p => p.activo === true);

        if(activePatients.length >= 3){
            return res.status(400).json({
                message: "No se pueden activar más de 50 pacientes"
            });
        }
    }

    const updatedPatient = {
        ...currentPatient,
        nombre: nombre ?? currentPatient.nombre,
        especie: especie ?? currentPatient.especie,
        edad: edad ?? currentPatient.edad,
        color: color ?? currentPatient.color,
        senia: senia ?? currentPatient.senia,
        sexo: sexo ?? currentPatient.sexo,
        raza: raza ?? currentPatient.raza,
        peso: peso ?? currentPatient.peso,
        esterilizado: esterilizado ?? currentPatient.esterilizado,
        tiene_microchip: tiene_microchip ?? currentPatient.tiene_microchip,
        num_microchip: num_microchip ?? currentPatient.num_microchip,
        activo: activo ?? currentPatient.activo,
        id_responsable: id_responsable ?? currentPatient.id_responsable
    };

    patients[patientIndex] = updatedPatient;

    res.json({success: true, data: updatedPatient});
});

//DELETE un paciente por ID
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    
    const patientIndex = patients.findIndex(p => p.id_paciente === id);

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