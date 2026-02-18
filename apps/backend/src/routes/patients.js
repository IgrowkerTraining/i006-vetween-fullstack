const express = require("express");

const router = express.Router();

//Array en memoria
let patients = [];
let idCounter = 1;

//GET todos los pacientes
router.get("/", (req, res) => {
    res.json(patients);
});

//POST crear paciente
router.post("/", (req, res) => {
    const {name, species, age} = req.body;

    if(!name || !species || !age ){
        return res.status(400).json({
            error: "Name, species and age are required"
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

    res.status(201).json(newPatient);
});

module.exports = router;