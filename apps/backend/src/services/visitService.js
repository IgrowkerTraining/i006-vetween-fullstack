const supabase = require('../config/supabaseClient');

const createVisit = async (visitData) => {
    const { data: nuevaVisita, error: visitError } = await supabase
        .from('visitas')
        .insert([visitData])
        .select()
        .single();

    if (visitError) {
        throw new Error(`Error al crear la visita: ${visitError.message}`);
    }

    // Activar al paciente SOLO si estaba inactivo
    const { error: patientError } = await supabase
        .from('pacientes')
        .update({ activo: true })
        .eq('id_pacientes', visitData.id_paciente)
        .eq('activo', false); // Solo actualiza si el paciente estaba inactivo

    if (patientError) {
        console.error(`Error al intentar activar al paciente ${visitData.id_paciente}:`, patientError.message);
    }

    return nuevaVisita;
};

const inactivateVisit = async (idVisita) => {
    const { data, error } = await supabase
        .from('visitas')
        .update({ estado: true })
        .eq('id_visitas', idVisita)
        .select()
        .single();

    if (error) throw new Error(`ERROR_INACTIVAR_VISITA`);

    return data;
};

const getVisitsByPatientId = async (idPaciente) => {
    // Primero verificar que el paciente exista
    const { error: patientError } = await supabase
        .from('pacientes')
        .select('id_pacientes')
        .eq('id_pacientes', idPaciente)
        .single(); 

    if (patientError) {
        throw new Error('PACIENTE_NO_ENCONTRADO');
    }

    const { data, error } = await supabase
        .from('visitas')
        .select('*')
        .eq('id_paciente', idPaciente)
        .order('fecha', { ascending: false }) // Ordena de la mas reciente a la mas antigua

    if (error) throw new Error(`Error al obtener las visitas: ${error.message}`);

    return data;
};

module.exports = {
    createVisit,
    inactivateVisit,
    getVisitsByPatientId
};