const express = require('express');

const router = express.Router();

let responsibles = [];
let idCounter = 1;

//GET todos los responsables
router.get("/", (req, res) => {
    res.json(responsibles);
});

//POST crear responsable
router.post("/", (req, res) => {
    const {name, email, phone } = req.body;

    if(!name || !email || !phone){
        return res.status(400).json({
            error: "Name, email and phone are required"
        });
    }

    const newResponsible = {
        id: idCounter++,
        name,
        email,
        phone,
        active: true
    };

    responsibles.push(newResponsible);

    res.status(201).json(newResponsible);
})

//GET responsables por ID
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const responsible = responsibles.find(r => r.id === id);

    if(!responsible){
        return res.status(404).json({error: "Responsible not found"});
    }

    res.json(responsible);
});

//PUT actualizar responsable por ID
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = responsibles.findIndex(r => r.id === id);

    if(index === -1){
        return res.status(404).json({error: "Responsible not found"});
    }

    const {name, email, phone, active } = req.body;

    responsibles[index] = {
        ...responsibles[index],
        name: name ?? responsibles[index].name,
        email: email ?? responsibles[index].email,
        phone: phone ?? responsibles[index].phone,
        active: active ?? responsibles[index].active
    };

    res.json(responsibles[index]);
});

module.exports = router;