const supabase = require('../config/supabaseClient');

// Verificar que el paciente exista y pertenezca a la clínica
const validarPacienteClinica = async (id_paciente, id_clinica) => {
    const { data: paciente, error } = await supabase
        .from('pacientes')
        .select('id_clinica')
        .eq('id_pacientes', id_paciente)
        .maybeSingle();

    if (error) throw error;

    if (!paciente) {
        throw new Error("PACIENTE_NO_ENCONTRADO");
    }

    if (paciente.id_clinica !== id_clinica) {
        throw new Error("ACCESO_DENEGADO");
    }

    return true;
};

// Verificar límite de pacientes activos
const validarLimitePacientesActivos = async (id_clinica) => {
    const { count, error } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true })
        .eq('id_clinica', id_clinica)
        .eq('activo', true);

    if (error) throw error;

    if (count >= 50) {
        throw new Error("LIMITE_PACIENTES_ACTIVOS");
    }
};

const createVisit = async (visitData, id_clinica) => {
    const { id_paciente } = visitData;

    // Validar paciente + clínica
    await validarPacienteClinica(id_paciente, id_clinica);

    // Validar límite de pacientes activos
    await validarLimitePacientesActivos(id_clinica);

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
        console.error(`Error al intentar activar al paciente ${id_paciente}:`, patientError.message);
    }

    return nuevaVisita;
};

const inactivateVisit = async (idVisita, id_clinica) => {

    // Buscar la visita
    const { data: visita, error: visitError } = await supabase
        .from('visitas')
        .select('id_visitas, id_paciente')
        .eq('id_visitas', idVisita)
        .single();

    if (visitError || !visita) {
        throw new Error('VISITA_NO_ENCONTRADA');
    }

    // Validar que el paciente pertenezca a la clínica
    await validarPacienteClinica(visita.id_paciente, id_clinica);

    const { data, error } = await supabase
        .from('visitas')
        // estado: false = activa | true = inactiva
        .update({ estado: true })
        .eq('id_visitas', idVisita)
        .select()
        .single();

    if (error || !data ) throw new Error(`ERROR_INACTIVAR_VISITA`);

    return data;
};

const getVisitsByPatientId = async (idPaciente, id_clinica, pagina = 1, limitePagina = 4) => {

    await validarPacienteClinica(idPaciente, id_clinica);

    const from = (pagina - 1) * limitePagina;
    const to = from + limitePagina - 1;

    const { data, error, count } = await supabase
        .from('visitas')
        .select('*', { count: 'exact' })
        .eq('id_paciente', idPaciente)
        .order('fecha', { ascending: false }) // Ordena de la mas reciente a la mas antigua
        .range(from, to);

    if (error) throw new Error(`Error al obtener las visitas: ${error.message}`);

    return {
        data,
        total: count,
        pagina: parseInt(pagina),
        ultimaPagina: Math.ceil(count / limitePagina)
    };
};

module.exports = {
    createVisit,
    inactivateVisit,
    getVisitsByPatientId
};