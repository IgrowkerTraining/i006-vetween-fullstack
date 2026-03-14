const supabase = require('../config/supabaseClient');
const { encriptarDato, desencriptarDato } = require("../utils/encryption");

/*
    Función auxiliar para limpiar (desencriptar) los datos sensibles de una clinica antes de enviarlos al frontend. 
    Esto se puede usar en cualquier endpoint que devuelva datos de la clínica, para asegurarnos de que el frontend 
    siempre reciba los datos desencriptados y listos para mostrar.
*/
const descifrarClinica = (clinica) => {
    if (!clinica) return clinica;
    return {
        ...clinica,
        telefono: desencriptarDato(clinica.telefono),
        direccion_calle: desencriptarDato(clinica.direccion_calle),
        direccion_localidad: desencriptarDato(clinica.direccion_localidad)
    };
};

const updateClinic = async (id_clinica, clinicData) => {
    // Crear una copia del body para no alterar el original y encriptar si vienen estos campos
    const datosActualizados = { ...clinicData };

    if (datosActualizados.telefono) datosActualizados.telefono = encriptarDato(datosActualizados.telefono);
    if (datosActualizados.direccion_calle) datosActualizados.direccion_calle = encriptarDato(datosActualizados.direccion_calle);
    if (datosActualizados.direccion_localidad) datosActualizados.direccion_localidad = encriptarDato(datosActualizados.direccion_localidad);

    try {
        const { data, error } = await supabase
            .from('clinica')
            .update(datosActualizados)
            .eq('id_clinica', id_clinica)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return descifrarClinica(data);
    } catch (error) {
        throw error;
    }
};

const getMyClinic = async (id_clinica) => {
    try {
        const { data, error } = await supabase
            .from('clinica')
            .select('*')
            .eq('id_clinica', id_clinica)
            .single();

        if (error) throw new Error(error.message);
        return descifrarClinica(data);
    } catch (error) {
        throw error;
    }
}

module.exports = { updateClinic, getMyClinic };