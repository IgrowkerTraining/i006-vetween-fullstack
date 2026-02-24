let responsibles = [];
let idCounter = 1;

const getAll = () => {
    return responsibles;
};

const getById = (id) => {
    return responsibles.find(r => r.id_responsable === id);
};

const create = (body) => {
    const {nombre, apellido, email, telefono, direccion, relacion } = body;


    if(nombre === undefined || apellido === undefined || email === undefined || telefono === undefined || direccion === undefined || relacion === undefined){
        return {message: "Faltan campos requeridos"};
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

    return newResponsible;
};

const update = (id, body) => {
    const index = responsibles.findIndex(r => r.id_responsable === id);

    if(index === -1){
        return null;
    }

    responsibles[index] = {
        ...responsibles[index],
        ...body
    };

    return responsibles[index];
};

module.exports = {
    getAll,
    getById,
    create,
    update
};