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
const generateSummary = async (body, id_clinica) => {
    const { id_paciente } = body;

    if (!id_paciente) {
        throw new Error("El ID del paciente es requerido");
    }

    // Validar asociación paciente-clínica
    await validarPacienteClinica(id_paciente, id_clinica);

    try {
        // Solicitar resumen a la IA
        const { data: resumen } = await axios.post(
            `${AI_URL}/api/v1/informes/resumenia`,
            body
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

// GET resúmenes
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