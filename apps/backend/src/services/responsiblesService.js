const supabase = require("../config/supabaseClient");
const { encriptarDato, desencriptarDato } = require("../utils/encryption");

/*
    Función auxiliar para limpiar (desencriptar) los datos sensibles de un responsable antes de enviarlos al frontend. 
    Esto se puede usar en cualquier endpoint que devuelva datos del responsable, para asegurarnos de que el frontend 
    siempre reciba los datos desencriptados y listos para mostrar.
*/
const descifrarResponsable = (responsable) => {
    if (!responsable) return responsable;
    return {
        ...responsable,
        telefono: desencriptarDato(responsable.telefono),
        direccion_calle: desencriptarDato(responsable.direccion_calle),
        direccion_localidad: desencriptarDato(responsable.direccion_localidad)
    };
};

// Obtener todos
const getAll = async (id_clinica, pagina = 1, limitePagina = 10) => {
    const from = (pagina - 1) * limitePagina;
    const to = from + limitePagina - 1;

    const { data, error, count } = await supabase
        .from('responsables')
        .select('*', { count: 'exact' })
        .eq('id_clinica', id_clinica)
        .order("fecha", { ascending: false })
        .range(from, to);

    if (error) throw error;

    return {
        data: data.map(descifrarResponsable),
        total: count,
        pagina: parseInt(pagina),
        ultimaPagina: Math.ceil(count / limitePagina)
    };
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

    return descifrarResponsable(data);
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
            telefono: encriptarDato(telefono),
            direccion_calle: encriptarDato(direccion_calle),
            direccion_numero,
            direccion_localidad: encriptarDato(direccion_localidad),
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

    return descifrarResponsable(data);
};

// Actualizar responsable
const update = async (id, body, id_clinica) => {

    // Crear una copia del body para no alterar el original y encriptar si vienen estos campos
    const datosActualizados = { ...body };

    if (datosActualizados.telefono) datosActualizados.telefono = encriptarDato(datosActualizados.telefono);
    if (datosActualizados.direccion_calle) datosActualizados.direccion_calle = encriptarDato(datosActualizados.direccion_calle);
    if (datosActualizados.direccion_localidad) datosActualizados.direccion_localidad = encriptarDato(datosActualizados.direccion_localidad);

    const { data, error } = await supabase
        .from('responsables')
        .update(datosActualizados)
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

    return descifrarResponsable(data);
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