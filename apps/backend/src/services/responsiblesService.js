const supabase = require("../config/supabaseClient");

// Obtener todos
const getAll = async () => {
    const { data, error } = await supabase
        .from('responsables')
        .select('*');

    if (error) throw error;

    return data;
};

// Obtener por ID
const getById = async (id) => {
    const { data, error } = await supabase
        .from('responsables')
        .select('*')
        .eq('id_responsables', id)
        .maybeSingle();

    if (error) throw error;

    if (!data) {
        throw new Error("Responsable no encontrado");
    }

    return data;
};

// Crear responsable
const create = async (body) => {
    const { nombre, apellido, email, telefono, direccion, relacion } = body;

    if (
        nombre === undefined ||
        apellido === undefined ||
        email === undefined ||
        telefono === undefined ||
        direccion === undefined ||
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
            direccion,
            relacion
        }])
        .select()
        .maybeSingle();

    if (error) throw error;

    return data;
};

// Actualizar responsable
const update = async (id, body) => {

    const { data: existing, error: existError } = await supabase
        .from('responsables')
        .select('id_responsables')
        .eq('id_responsables', id)
        .maybeSingle();

    if (existError) throw existError;

    if (!existing) {
        throw new Error("Responsable no encontrado");
    }

    const { data, error } = await supabase
        .from('responsables')
        .update(body)
        .eq('id_responsables', id)
        .select()
        .maybeSingle();

    if (error) throw error;

    return data;
};

module.exports = {
    getAll,
    getById,
    create,
    update
};