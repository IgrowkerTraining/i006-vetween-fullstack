const supabase = require("../config/supabaseClient");
const axios = require("axios");
const cripto = require("crypto");

const AI_URL = process.env.AI_URL;

// Función auxiliar para generar un hash de los datos clínicos del paciente, para evitar generar resúmenes duplicados si los datos no han cambiado
const generarHashDatos = (datos) => {
    return cripto.createHash('sha256').update(JSON.stringify(datos)).digest('hex');
};

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
    
    // Prepara los datos actuales
    const datosClinicos = {
        paciente,
        visitas,
        vacunas
    };

    // Genera el Hash de la información actual
    const hashActual = generarHashDatos(datosClinicos);

    // Busca el ultimo resumen generado para este paciente
    const { data: ultimoResumen, error: resumenError } = await supabase
        .from("resumen_ia")
        .select("*")
        .eq("id_paciente", id_paciente)
        .order("fecha_generacion", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (resumenError) throw resumenError;

    // Valida si los datos han cambiado
    if (ultimoResumen && ultimoResumen.hash_datos === hashActual) {
        return {
            isCached: true, 
            data: ultimoResumen // Devuelve el resumen existente sin llamar a la IA
        };
    }

	try {
        const bodyIA = { 
            id_paciente,
            datos_clinicos: datosClinicos
        };  

        const { data: resumen } = await axios.post(
            `${AI_URL}/api/v1/informes/resumenia`,
            bodyIA
        );        
        
        const { data, error } = await supabase
            .from("resumen_ia")
            .insert([{
                id_resumenia: resumen.id_resumenia,
                id_paciente: resumen.id_paciente,
                resumen_completo: resumen.resumen_completo,
                resumen_estructurado: resumen.resumen_estructurado,
                modelo: resumen.modelo,
                fecha_generacion: resumen.fecha_generacion,
                hash_datos: hashActual // Guarda el hash de los datos clínicos en la base de datos para hacer comparaciones
            }])
            .select()
            .maybeSingle();

        if (error) {
            throw new Error("Error al guardar en la base de datos: " + error.message);
        }

        return {
            isCached: false, // Indica que este resumen fue generado por la IA y no es un resultado cacheado
            data: data
        };

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