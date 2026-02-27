const supabase = require("../config/supabaseClient");

const generarResumen = async (id_paciente, datos_clinicos) => {
    //Verificar que el paciente exista
    const { data: paciente, error: pacienteError } = await supabase
        .from("pacientes")
        .select("id_pacientes")
        .eq("id_pacientes", id_paciente)
        .single();

    if (pacienteError || !paciente) {
        throw new Error("PATIENT_NOT_FOUND");
    }

    //Construir resumen estructurado
    const resumenEstructurado = {
        estado_general: "estable",
        tipo_paciente:
        datos_clinicos.visitas.length > 1 ? "recurrente" : "nuevo",
        sintesis_visitas: datos_clinicos.visitas.map((v) => ({
        fecha: v.fecha,
        motivo: v.motivo_consulta,
        diagnostico: v.diagnostico,
        tratamiento: v.tratamiento,
        })),
        historial_vacunas:
        datos_clinicos.vacunas?.map((vacuna) => ({
            nombre: vacuna.tipo,
            fecha_aplicacion: vacuna.fecha_aplicacion,
            estado: "aplicada",
        })) || [],
        descripcion_clinica: "Paciente con historial clínico documentado.",
        tratamiento_indicado: "Seguir indicaciones médicas.",
        factores_riesgo: ["control periódico recomendado"],
        puntos_clave_proximas_consultas: ["Revisar evolución clínica"],
    };

    const resumenCompleto = `
    Resumen clínico generado por IA:
    Paciente: ${datos_clinicos.paciente.nombre}
    Especie: ${datos_clinicos.paciente.especie}
    Edad: ${datos_clinicos.paciente.edad}
    Estado general: estable
    `;

    //Insertar en Supabase
    const { data, error } = await supabase
        .from("resumen_ia")
        .insert([
        {
            id_paciente,
            resumen_completo: resumenCompleto,
            resumen_estructurado: resumenEstructurado,
            fecha_generacion: new Date(),
        },
        ])
        .select()
        .single();

    if (error) {
        throw new Error("IA_ERROR");
    }

    return data;
};

const obtenerResumenesPorPaciente = async (id) => {
    // Verificar que exista paciente
    const { data: paciente, error: pacienteError } = await supabase
        .from("pacientes")
        .select("id_pacientes")
        .eq("id_pacientes", id)
        .single();

    if (pacienteError || !paciente) {
        throw new Error("PATIENT_NOT_FOUND");
    }

    const { data, error } = await supabase
        .from("resumen_ia")
        .select("*")
        .eq("id_paciente", id)
        .order("fecha_generacion", { ascending: false });

    if (error) {
        throw new Error("IA_ERROR");
    }

    return data;
};

module.exports = {
    generarResumen,
    obtenerResumenesPorPaciente,
};