const supabase = require('../config/supabaseClient');

// Obtener todos los pacientes de la clinica
const getAllPatients = async (id_clinica, pagina = 1, limitePagina = 10) => {
    const from = (pagina - 1) * limitePagina;
    const to = from + limitePagina - 1;

    const { data, error, count } = await supabase
    .from('pacientes')
    .select('*', { count: 'exact' })
    .eq('id_clinica', id_clinica)
    .order("fecha", { ascending: false })
    .range(from, to);

    if(error) throw error;

    return {
        data,
        total: count,
        pagina: parseInt(pagina),
        ultimaPagina: Math.ceil(count / limitePagina)
    };
};

// Obtener paciente por ID
const getPatientById = async (id, id_clinica) => {

    const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id_pacientes', id)
    .eq('id_clinica', id_clinica)
    .maybeSingle();

    if(error) throw error;

    if (!data) {
        throw new Error("PACIENTE_NO_ENCONTRADO");
    }

    return data;
};

// Crear paciente
const createPatient = async (patientData, id_clinica) => {
    const {
        nombre, especie, edad, color, senia, sexo, raza, 
        peso, esterilizado, tiene_microchip, num_microchip, 
        id_responsable
    } = patientData;

    // Verificar si el responsable ya tiene un paciente igual
    const { data: duplicados, error: searchError } = await supabase
        .from('pacientes')
        .select('id_pacientes')
        .eq('id_clinica', id_clinica)
        .eq('id_responsable', id_responsable)
        .eq('especie', especie)
        .eq('edad', edad)
        .ilike('nombre', nombre) // ignora mayúsculas/minúsculas
        .limit(1);

    if (searchError) throw searchError;

    // Si el array de duplicados tiene al menos un elemento, rechazamos la creación
    if (duplicados && duplicados.length > 0) {
        throw new Error("PACIENTE_DUPLICADO");
    }

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
            if (error.message.includes('fk_responsable')) {
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

    // Validar que el paciente exista y pertenezca a la clínica
    const paciente = await getPatientById(id, id_clinica);

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

        if(activeCount >= 50){
            throw new Error("LIMITE_ALCANZADO");
        }
    }

    const { data, error } = await supabase
    .from('pacientes')
    .update(updateData)
    .eq('id_pacientes', id)
    .eq('id_clinica', id_clinica)
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
    // Validar que el paciente exista y pertenezca a la clínica
    await getPatientById(id, id_clinica);

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
    .eq('id_clinica', id_clinica);

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