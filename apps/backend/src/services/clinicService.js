const supabase = require('../config/supabaseClient');

const updateClinic = async (id_clinica, clinicData) => {
    try {
        const { data, error } = await supabase
            .from('clinica')
            .update(clinicData)
            .eq('id_clinica', id_clinica)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
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
        return data;
    } catch (error) {
        throw error;
    }
}

module.exports = { updateClinic, getMyClinic };