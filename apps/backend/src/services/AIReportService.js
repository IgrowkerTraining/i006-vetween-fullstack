const supabase = require("../config/supabaseClient");
const axios = require("axios");

const AI_URL = "https://ivetween-ai.onrender.com";

// POST a la IA
const generateSummary = async (body) => {
    try {
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
        .select();

        if (error) {
        throw new Error("Error al guardar en la base de datos: " + error.message);
        }

        return data;

    } catch (error) {
        throw new Error(error.message);
    }
};

const getSummariesByPatientFromDB = async (id_paciente) => {

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