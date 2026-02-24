//Array en memoria
let patients = [];
let idCounter = 1;


//Obtener todos los pacientes
const getAllPatients = () => {
    return patients;
};

//Obtener paciente por ID
const getPatientById = (id) => {
    return patients.find(p => p.id_paciente === id);
};

//Crear paciente
const createPatient = (data) => {
    const {
        nombre, 
        especie, 
        edad, 
        color, 
        senia, 
        sexo, 
        raza, 
        peso, 
        esterilizado, 
        tiene_microchip, 
        num_microchip, 
        id_responsable,
        id_clinica
    } = data;

    //Validacion de campos requeridos
    if(
        nombre === undefined || 
        especie === undefined || 
        edad === undefined ||
        color === undefined ||
        senia === undefined || 
        sexo === undefined || 
        raza === undefined || 
        peso === undefined || 
        esterilizado === undefined || 
        tiene_microchip === undefined || 
        id_responsable === undefined ||
        id_clinica === undefined
    ) {
        throw new Error("Faltan campos requeridos")
    }

    //Validacion de microchip
    if(tiene_microchip === true && !num_microchip){
        throw new Error("Debe especificar el número de microchip");
    }

    //Límite de pacientes activos
    const activePatients = patients.filter(p => p.activo === true);

    if(activePatients.length >= 3){
        throw new Error("No se pueden registrar más de 50 pacientes activos");
    }

    const newPatient = {
        id_paciente: idCounter++,
        nombre,
        especie,
        edad,
        color,
        senia,
        sexo,
        raza,
        peso,
        esterilizado,
        tiene_microchip,
        num_microchip: num_microchip || null,        
        activo: true,
        id_responsable,
        id_clinica
    };

    patients.push(newPatient);

    return newPatient;
};

//Actualizar paciente
const updatePatient = (id, data) => {
    const patientIndex = patients.findIndex(p => p.id_paciente === id);

    if(patientIndex === -1){
        return null;
    }

    const currentPatient = patients[patientIndex];

    const {
        nombre,
        especie,
        edad,
        color,
        senia,
        sexo,
        raza,
        peso,
        esterilizado,
        tiene_microchip,
        num_microchip,
        activo,
        id_responsable,
        id_clinica
    } = data;

    //Validacion limite si se activa manualmente
    if(activo === true && currentPatient.activo === false){
        const activePatients = patients.filter(p => p.activo === true);

        if(activePatients.length >= 3){            
            throw new Error("No se pueden activar más de 50 pacientes")
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
        id_responsable: id_responsable ?? currentPatient.id_responsable,
        id_clinica: id_clinica ?? currentPatient.id_clinica
    };

    patients[patientIndex] = updatedPatient;

    return updatedPatient;
};

//Eliminar paciente
const deletePatient = (id) => {
    const patientIndex = patients.findIndex(p => p.id_paciente === id);

    if(patientIndex === -1){
        return null;
    }

    const deletedPatient = patients.splice(patientIndex, 1);

    return deletedPatient[0];
};

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
};