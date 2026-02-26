const supabase = require('../config/supabaseClient');

const registerVaccine = async (vaccineData) => {
    const { data: nuevaVacuna, error: vaccineError } = await supabase
        .from('vacunas')
        .insert([vaccineData])
        .select()
        .single();

    if (vaccineError) {
        throw new Error(`Error al registrar la vacuna: ${vaccineError.message}`);
    }

    return nuevaVacuna;
};

const inactivateVaccine = async (idVacuna) => {
    const { data, error } = await supabase
        .from('vacunas')
        .update({ estado: true })
        .eq('id_vacunas', idVacuna)
        .select()
        .single();

    if (error) throw new Error(`ERROR_INACTIVAR_VACUNA`);
    
    return data;
};

const getVaccineByPatientId = async (idPaciente) => {
    // Primero verificar que el paciente exista
    const { error: patientError } = await supabase
        .from('pacientes')
        .select('id_pacientes')
        .eq('id_pacientes', idPaciente)
        .single(); 

    if (patientError) {
        throw new Error('PACIENTE_NO_ENCONTRADO');
    }

    // Luego obtener las vacunas del paciente
    const { data, error } = await supabase
        .from('vacunas')
        .select('*')
        .eq('id_paciente', idPaciente)
        .order('fecha_aplicacion', { ascending: false }) // Ordena de la mas reciente a la mas antigua

    if (error) throw new Error(`Error al obtener las vacunas del paciente: ${error.message}`);

    return data;
};

module.exports = {
    registerVaccine,
    inactivateVaccine,
    getVaccineByPatientId
};