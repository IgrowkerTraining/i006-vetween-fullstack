const supabase = require("../config/supabaseClient");
const axios = require("axios");

const AI_URL = process.env.AI_URL;

// Función auxiliar para validar que el paciente pertenece a la clínica que hace la petición
const validarPacienteClinica = async (id_paciente, id_clinica) => {
    const { data: paciente, error } = await supabase
        .from('pacientes')
        .select('id_clinica')
        .eq('id_pacientes', id_paciente)
        .maybeSingle();

    if (error) throw error;
    
    if (!paciente) {
        throw new Error("Paciente no encontrado");
    }
    
    if (paciente.id_clinica !== id_clinica) {
        throw new Error("Acceso denegado: El paciente no pertenece a su clínica");
    }

    return true;
};

// POST a la IA
const generateSummary = async (id_paciente, id_clinica) => {

    if (!id_paciente) {
        throw new Error("El ID del paciente es requerido");
    }

    // Validar asociación paciente-clínica
    await validarPacienteClinica(id_paciente, id_clinica);

    // Obtener paciente
    const { data: paciente, error: pacienteError } = await supabase
        .from("pacientes")
        .select("*")
        .eq("id_pacientes", id_paciente)
        .maybeSingle();

    if (pacienteError) throw pacienteError;

    if (!paciente) {
        throw new Error("Paciente no encontrado");
    }

    // Validación de paciente activo
    if (paciente.activo === false) {
        throw new Error("Paciente inactivo");
    }

    // Obtener visitas
    const { data: visitas, error: visitasError } = await supabase
        .from("visitas")
        .select("*")
        .eq("id_paciente", id_paciente);

    if (visitasError) throw visitasError;

    // Obtener vacunas
    const { data: vacunas, error: vacunasError } = await supabase
        .from("vacunas")
        .select("*")
        .eq("id_paciente", id_paciente);

    if (vacunasError) throw vacunasError;

    const { data: resumenExistente } = await supabase
        .from("resumen_ia")
        .select("id_resumenia")
        .eq("id_paciente", id_paciente)
        .maybeSingle();

    if (resumenExistente) {
        throw new Error("Resumen ya existe para este paciente");
    }
    
    try {

	const bodyIA ={ 
        id_paciente,
        datos_clinicos: {
            paciente,
            visitas,
            vacunas
        }
    };	

        // Solicitar resumen a la IA
        const { data: resumen } = await axios.post(
            `${AI_URL}/api/v1/informes/resumenia`,
            bodyIA
        );        
        
        // Guardar en Supabase
        const { data, error } = await supabase
            .from("resumen_ia")
            .insert([{
                id_resumenia: resumen.id_resumenia,
                id_paciente: resumen.id_paciente,
                resumen_completo: resumen.resumen_completo,
                resumen_estructurado: resumen.resumen_estructurado,
                modelo: resumen.modelo,
                fecha_generacion: resumen.fecha_generacion
            }])
            .select()
            .maybeSingle();

        if (error) {
            throw new Error("Error al guardar en la base de datos: " + error.message);
        }

        return data;

    } catch (error) {
        throw new Error(error.message);
    }
};

// GET resúmenes por paciente
const getSummariesByPatientFromDB = async (id_paciente, id_clinica) => {

    // Validar asociación paciente-clínica
    await validarPacienteClinica(id_paciente, id_clinica);

    const { data, error } = await supabase
        .from("resumen_ia")
        .select("*")
        .eq("id_paciente", id_paciente)
        .order("fecha_generacion", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

module.exports = {
    generateSummary,
    getSummariesByPatientFromDB
};