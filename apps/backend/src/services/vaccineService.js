const supabase = require('../config/supabaseClient');

const registerVaccine = async (vaccineData, idClinicaFromToken) => {

    const { id_paciente } = vaccineData;

    // Verificar que el paciente exista
    const { data: paciente, error: patientError } = await supabase
        .from('pacientes')
        .select('id_pacientes, id_clinica, activo')
        .eq('id_pacientes', id_paciente)
        .single();

    if (patientError || !paciente) {
        throw new Error('PACIENTE_NO_ENCONTRADO');
    }

    // Verificar que pertenezca a la clínica del veterinario logueado
    if (paciente.id_clinica !== idClinicaFromToken) {
        throw new Error('PACIENTE_NO_PERTENECE_A_LA_CLINICA');
    }

    // Verificar que el paciente esté activo
    // Cuando se crea el paciente, activo: false
    if (paciente.activo === false) {
        throw new Error('NO_SE_PUEDE_REGISTRAR_VACUNA_PACIENTE_INACTIVO');
    }

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

const inactivateVaccine = async (idVacuna, idClinicaFromToken) => {
    
    // Buscar la vacuna
    const { data: vacuna, error: vaccineError } = await supabase
        .from('vacunas')
        .select('id_vacunas, id_paciente')
        .eq('id_vacunas', idVacuna)
        .single();

    if (vaccineError || !vacuna) {
        throw new Error('VACUNA_NO_ENCONTRADA');
    }

    // Buscar el paciente de esa vacuna
    const { data: paciente, error: patientError } = await supabase
        .from('pacientes')
        .select('id_pacientes, id_clinica')
        .eq('id_pacientes', vacuna.id_paciente)
        .single();

    if (patientError || !paciente) {
        throw new Error('PACIENTE_NO_ENCONTRADO');
    }

    // Validar que pertenezca a la misma clínica
    if (paciente.id_clinica !== idClinicaFromToken) {
        throw new Error('NO_AUTORIZADO_CLINICA');
    }

    const { data, error } = await supabase
        .from('vacunas')
        // estado: false = activa | true = inactiva
        .update({ estado: true })
        .eq('id_vacunas', idVacuna)
        .select()
        .single();

    if (error) throw new Error(`ERROR_INACTIVAR_VACUNA`);
    
    return data;
};

const getVaccineByPatientId = async (idPaciente, idClinicaFromToken, pagina = 1, limitePagina = 4) => {

    // Primero verificar que el paciente exista
    const { data: paciente, error: patientError } = await supabase
        .from('pacientes')
        .select('id_pacientes, id_clinica')
        .eq('id_pacientes', idPaciente)
        .single(); 

    if (patientError || !paciente ) {
        throw new Error('PACIENTE_NO_ENCONTRADO');
    }

    if (paciente.id_clinica !== idClinicaFromToken) {
        throw new Error('PACIENTE_NO_PERTENECE_A_LA_CLINICA');
    }

    const from = (pagina - 1) * limitePagina;
    const to = from + limitePagina - 1;

    // Luego obtener las vacunas del paciente
    const { data, error, count } = await supabase
        .from('vacunas')
        .select('*', { count: 'exact' })
        .eq('id_paciente', idPaciente)
        .order('fecha_aplicacion', { ascending: false }) // Ordena de la mas reciente a la mas antigua
        .range(from, to);

    if (error) throw new Error(`Error al obtener las vacunas del paciente: ${error.message}`);

    return {
        data,
        total: count,
        pagina: parseInt(pagina),
        ultimaPagina: Math.ceil(count / limitePagina)
    };
};

module.exports = {
    registerVaccine,
    inactivateVaccine,
    getVaccineByPatientId
};