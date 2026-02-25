const supabase = require('../config/supabaseClient');
const { update } = require('../controllers/patientsController');

//Obtener todos los pacientes
const getAllPatients = async () => {
    const { data, error } = await supabase
    .from('pacientes')
    .select('*');

    if(error) throw error;

    return data;
};

//Obtener paciente por ID
const getPatientById = async (id) => {
    const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id_pacientes', id)
    .maybeSingle();

    if(error) throw error;

    return data;
};

//Crear paciente
const createPatient = async (patientData) => {
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
    } = patientData;

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

    //Validar que exista el responsable
    const { data: responsable, error: responsableError } = await supabase
    .from('responsables')
    .select('id_responsables')
    .eq('id_responsables', id_responsable)
    .maybeSingle();

    if(responsableError) throw responsableError;

    if(!responsable){
        throw new Error ("El responsable no existe")
    }

    //Validar que exista la clinica
    const { data: clinica, error: clinicaError } = await supabase
    .from('clinica')
    .select('id_clinica')
    .eq('id_clinica', id_clinica)
    .maybeSingle();

    if(!clinica){
        throw new Error("La clinica no existe")
    }

    const { data, error } = await supabase
    .from('pacientes')
    .insert([{
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
        activo: false,
        id_responsable,
        id_clinica
    }])
    .select()
    .maybeSingle();

    if(error) throw error;

    return data;
};

//Actualizar paciente
const updatePatient = async (id, updateData) => {

    //Verificar que exista el paciente
    const { data: patient, error: patientError } = await supabase
    .from('pacientes')
    .select('id_pacientes, activo')
    .eq('id_pacientes', id)
    .maybeSingle();

    if(patientError) throw patientError;
    if(!patient) throw new Error("Paciente no encontrado");

    if(updateData.activo === true && patient.activo === false){

        //Verificar que tenga visitas
        const { count: visitCount, error: visitError } = await supabase
        .from('visitas')
        .select('*', { count: 'exact', head: true})
        .eq('id_paciente', id);

        if(visitError) throw visitError;

        if(visitCount === 0){
            throw new Error("No se puede activar un paciente sin visitas registradas");
        }

        //Verificar limite de pacientes activos
        const { count: activeCount, error: countError } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true})
        .eq('activo', true)

        if(countError) throw countError;

        if(activeCount >= 3){
            throw new Error("No se pueden registrar más de 50 pacientes activos")
        }
    }

    const { data, error } = await supabase
    .from('pacientes')
    .update(updateData)
    .eq('id_pacientes', id)
    .select()
    .maybeSingle();

    if(error) throw error;

    return data;
};

//Eliminar paciente
const deletePatient = async (id) => {

    //Verificar que el paciente exista
    const { data: paciente, error: pacienteError } = await supabase
    .from('pacientes')
    .select('id_pacientes')
    .eq('id_pacientes', id)
    .maybeSingle();

    if(pacienteError) throw pacienteError;

    if(!paciente){
        throw new Error("El paciente no existe");
    }

    //Verificar si tiene visitas registradas
    const { count, error: visitError } = await supabase
    .from('visitas')
    .select('*', { count: 'exact', head: true})
    .eq('id_paciente', id);

    if(visitError) throw visitError;

    if(count > 0){
        throw new Error("No se puede eliminar un paciente con visitas registradas")
    }

    const { error } = await supabase
    .from('pacientes')
    .delete()
    .eq('id_pacientes', id)

    if(error) throw error;

    return {success: true, message: "Paciente eliminado correctamente"};
};

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
};