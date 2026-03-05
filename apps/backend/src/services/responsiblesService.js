const supabase = require("../config/supabaseClient");

// Obtener todos
const getAll = async (id_clinica) => {
    const { data, error } = await supabase
        .from('responsables')
        .select('*')
        .eq('id_clinica', id_clinica);

    if (error) throw error;

    return data;
};

// Obtener por ID
const getById = async (id, id_clinica) => {
    const { data, error } = await supabase
        .from('responsables')
        .select('*')
        .eq('id_responsables', id)
        .eq('id_clinica', id_clinica)
        .maybeSingle();

    if (!data) {
        throw new Error("RESPONSABLE_NO_ENCONTRADO");
    }

    if (error) throw error;

    return data;
};

// Crear responsable
const create = async (body, id_clinica) => {
    const { nombre, apellido, email, telefono, direccion_calle, 
        direccion_numero, direccion_localidad, provincia, relacion } = body;

    if (
        nombre === undefined ||
        apellido === undefined ||
        email === undefined ||
        telefono === undefined ||
        direccion_calle === undefined ||
        direccion_numero === undefined ||
        direccion_localidad === undefined ||
        provincia === undefined ||
        relacion === undefined
    ) {
        throw new Error("Faltan campos requeridos");
    }

    //Validacion de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new Error("Email inválido");
    }

    //Verificar que el email no este duplicado
    const { data: existingEmail } = await supabase
    .from('responsables')
    .select('id_responsables')
    .eq('email', email)
    .maybeSingle();

    if (existingEmail) {
        throw new Error("El email ya está registrado");
    }

    const { data, error } = await supabase
        .from('responsables')
        .insert([{
            nombre,
            apellido,
            email,
            telefono,
            direccion_calle,
            direccion_numero,
            direccion_localidad,
            provincia,
            relacion,
            id_clinica
        }])
        .select()
        .maybeSingle();

    // Si hay error en la DB (ej: email duplicado que tiene restricción UNIQUE)
    if (error) {
        if (error.code === '23505' && error.message.includes('email')) {
            throw new Error("EMAIL_DUPLICADO");
        }
        throw error;
    }

    return data;
};

// Actualizar responsable
const update = async (id, body, id_clinica) => {

    const { data, error } = await supabase
        .from('responsables')
        .update(body)
        .eq('id_responsables', id)
        .eq('id_clinica', id_clinica)
        .select()
        .maybeSingle();

    if (!data) {
        throw new Error("RESPONSABLE_NO_ENCONTRADO");
    }

    if (error) {
        if (error.code === '23505' && error.message.includes('email')) {
            throw new Error("EMAIL_DUPLICADO");
        }
        throw error;
    }

    return data;
};

// Eliminar responsable
const deleteResponsible = async (id, id_clinica) => {

    // Verificar que el responsable exista y pertenezca a la clínica
    await getById(id, id_clinica); 

    // Verificar si tiene pacientes asociados a el, si tiene, no se puede eliminar
    const { count, error: patientError } = await supabase
    .from('pacientes')
    .select('*', { count: 'exact', head: true})
    .eq('id_responsable', id);

    if(patientError) throw patientError;

    if(count > 0){
        throw new Error("NO_SE_PUEDE_ELIMINAR");
    }

    const { error } = await supabase
        .from('responsables')
        .delete()
        .eq('id_responsables', id)
        .eq('id_clinica', id_clinica);

    if (error) throw error;

    return {success: true, message: "Responsable eliminado correctamente"};
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteResponsible
};