const responsablesService = require("../services/responsiblesService");

const getAll = (req, res) => {
    const responsibles = responsablesService.getAll();
    res.json({success: true, data: responsibles});
};

const getById = (req, res) => {
    const id = parseInt(req.params.id);

    const responsible = responsablesService.getById(id);

    if(!responsible){
        return res.status(404).json({message: "Responsable no encontrado"});
    }

    res.json({success: true, data: responsible});
};

const create = (req, res) => {
    const result = responsablesService.create(req.body);

    if(result.error){
        return res.status(400).json({
            message: result.error
        })
    }

    res.status(201).json({success: true, data: result});
};

const update = (req, res) => {
    const id = parseInt(req.params.id);
    const updated = responsablesService.update(id, req.body);

    if(!updated){
        return res.status(404).json({message: "Responsable no encontrado"});
    }

    res.json({success: true, data: updated});
};

module.exports = {
    getAll,
    getById,
    create,
    update
};