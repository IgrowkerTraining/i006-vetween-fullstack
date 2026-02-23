const express = require('express');

const router = express.Router();

let responsibles = [];
let idCounter = 1;

//GET todos los responsables
router.get("/", (req, res) => {
    res.json({success: true, data: responsibles});
});

//POST crear responsable
router.post("/", (req, res) => {
    const {nombre, apellido, email, telefono, direccion, relacion } = req.body;

    if(nombre === undefined || apellido === undefined || email === undefined || telefono === undefined || direccion === undefined || relacion === undefined){
        return res.status(400).json({
            message: "Faltan campos requeridos"
        });
    }

    const newResponsible = {
        id_responsable: idCounter++,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        relacion,
        activo: true
    };

    responsibles.push(newResponsible);

    res.status(201).json({success: true, data: newResponsible});
})

//GET responsables por ID
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const responsible = responsibles.find(r => r.id_responsable === id);

    if(!responsible){
        return res.status(404).json({message: "Responsable no encontrado"});
    }

    res.json({success: true, data: responsible});
});

//PUT actualizar responsable por ID
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = responsibles.findIndex(r => r.id_responsable === id);

    if(index === -1){
        return res.status(404).json({message: "Responsable no encontrado"});
    }

    const {nombre, apellido, email, telefono, direccion, relacion, activo } = req.body;

    responsibles[index] = {
        ...responsibles[index],
        nombre: nombre ?? responsibles[index].nombre,
        apellido: apellido ?? responsibles[index].apellido,
        email: email ?? responsibles[index].email,
        telefono: telefono ?? responsibles[index].telefono,
        direccion: direccion ?? responsibles[index].direccion,
        relacion: relacion ?? responsibles[index].relacion,
        activo: activo ?? responsibles[index].activo
    };

    res.json({success: true, data: responsibles[index]});
});

module.exports = router;