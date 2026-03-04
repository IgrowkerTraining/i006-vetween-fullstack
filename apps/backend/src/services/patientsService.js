const supabase = require('../config/supabaseClient');

// Función auxiliar para validar que el paciente pertenece a la clínica
const validarPacienteClinica = async (id_paciente, id_clinica) => {
    const { data: paciente, error } = await supabase
        .from('pacientes')
        .select('id_clinica')
        .eq('id_pacientes', id_paciente)
        .maybeSingle();

    if (error) throw error;
    
    if (!paciente) {
        throw new Error("PACIENTE_NO_ENCONTRADO");
    }
    
    if (paciente.id_clinica !== id_clinica) {
        throw new Error("ACCESO_DENEGADO");
    }

    return paciente;
};

// Obtener todos los pacientes de la clinica
const getAllPatients = async (id_clinica) => {
    const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id_clinica', id_clinica)
    .order("fecha", { ascending: false });

    if(error) throw error;

    return data;
};

// Obtener paciente por ID
const getPatientById = async (id, id_clinica) => {

    await validarPacienteClinica(id, id_clinica);

    const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id_pacientes', id)
    .maybeSingle();

    if(error) throw error;

    return data;
};

// Crear paciente
const createPatient = async (patientData, id_clinica) => {
    const {
        nombre, especie, edad, color, senia, sexo, raza, 
        peso, esterilizado, tiene_microchip, num_microchip, 
        id_responsable
    } = patientData;

    // Inserción directa. JOI ya valido la estructura y tipos
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

    // Manejo de errores de base de datos
    if (error) {
        // Código 23505 en PostgreSQL es "unique_violation"
        if (error.code === '23505' && error.message.includes('num_microchip')) {
            throw new Error("MICROCHIP_DUPLICADO");
        }

        // El código 23503 en PostgreSQL es "foreign_key_violation"
        if (error.code === '23503') {
            if (error.message.includes('id_responsable')) {
                throw new Error("ID_RESPONSABLE_NO_EXISTE");
            }
            if (error.message.includes('id_clinica')) {
                throw new Error("ID_CLINICA_NO_EXISTE");
            }
        }
        throw error;
    }

    return data;
};

// Actualizar paciente
const updatePatient = async (id, updateData, id_clinica) => {

    const paciente = await validarPacienteClinica(id, id_clinica);

    if(updateData.activo === true && paciente.activo === false){

        //Verificar que tenga visitas
        const { count: visitCount, error: visitError } = await supabase
        .from('visitas')
        .select('*', { count: 'exact', head: true})
        .eq('id_paciente', id);

        if(visitError) throw visitError;

        if(visitCount === 0){
            throw new Error("NO_SE_PUEDE_ACTIVAR");
        }

        //Verificar limite de pacientes activos por clinica
        const { count: activeCount, error: countError } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true})
        .eq('activo', true)
        .eq('id_clinica', id_clinica);

        if(countError) throw countError;

        if(activeCount >= 3){
            throw new Error("LIMITE_ALCANZADO");
        }
    }

    const { data, error } = await supabase
    .from('pacientes')
    .update(updateData)
    .eq('id_pacientes', id)
    .select()
    .maybeSingle();


    if(error) {
        // Código 23505 en PostgreSQL es "unique_violation"
        if (error.code === '23505' && error.message.includes('num_microchip')) {
            throw new Error("MICROCHIP_DUPLICADO");
        }
        throw error;
    }

    return data;
};

//Eliminar paciente
const deletePatient = async (id, id_clinica) => {

    await validarPacienteClinica(id, id_clinica);

    //Verificar si tiene visitas registradas
    const { count, error: visitError } = await supabase
    .from('visitas')
    .select('*', { count: 'exact', head: true})
    .eq('id_paciente', id);

    if(visitError) throw visitError;

    if(count > 0){
        throw new Error("NO_SE_PUEDE_ELIMINAR");
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