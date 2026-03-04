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

module.exports = {
    getAll,
    getById,
    create,
    update
};