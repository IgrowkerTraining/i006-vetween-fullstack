const supabase = require('../config/supabaseClient');

const getVeterinarianById = async (idVeterinario) => {
    const { data, error } = await supabase
        .from('veterinario')
        .select('id_veterinario, nombre, apellido, email, matricula, especialidad, tipos_animales, costo_consulta, id_clinica')
        .eq('id_veterinario', idVeterinario)
        .single();

    if (error) {
        throw new Error(`Error al obtener los datos del veterinario: ${error.message}`);
    }

    return data;
};

const updateVeterinarian = async (idVeterinario, updateData) => {
    const { data, error } = await supabase
        .from('veterinario')
        .update(updateData)
        .eq('id_veterinario', idVeterinario)
        // El select() devuelve el registro actualizado para enviarlo en la respuesta
        .select('id_veterinario, nombre, apellido, email, matricula, especialidad, tipos_animales, costo_consulta, id_clinica')
        .single();

    if (error) {
        throw new Error(`Error al actualizar el veterinario: ${error.message}`);
    }

    return data;
};

module.exports = {
    getVeterinarianById,
    updateVeterinarian
};