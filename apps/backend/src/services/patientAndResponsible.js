const supabase = require('../config/supabaseClient');

const createPatientAndResponsible = async (data, id_clinica) => {
    // Validar límite de 50 pacientes activos por clínica antes de crear un nuevo paciente
    const { count, error: countError } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true }) // head: true cuenta los registros sin descargar los datos
        .eq('id_clinica', id_clinica)
        .eq('activo', true); // Solo contamos los activos

    if (countError) {
        throw new Error('Error al verificar el límite de pacientes activos de la clínica');
    }

    if (count >= 50) {
        throw new Error('Has alcanzado el límite máximo de 50 pacientes activos. Debes pasar a "inactivo" a un paciente antiguo para poder registrar uno nuevo.');
    }

    let id_responsable_db = null;
    let isNewResponsable = false;

    // 1. Verificar si el responsable ya existe (por email)
    const { data: existingResponsable, error: searchError } = await supabase
        .from('responsables')
        .select('id_responsables')
        .eq('email', data.email)
        .maybeSingle(); // maybeSingle evita errores si no encuentra a nadie

    if (searchError) {
        throw new Error('Error al verificar el responsable en la base de datos');
    }

    if (existingResponsable) {
        // Si ya existe, usamos su ID para no duplicarlo
        id_responsable_db = existingResponsable.id_responsables;
    } else {
        // 2. Si no existe, creamos el responsable primero
        const nuevoResponsable = {
            nombre: data.nombre_responsable,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono,
            direccion_calle: data.direccion_calle,
            direccion_numero: data.direccion_numero,
            direccion_localidad: data.direccion_localidad,
            provincia: data.provincia,
            relacion: data.relacion
        };

        const { data: respData, error: respError } = await supabase
            .from('responsables')
            .insert([nuevoResponsable])
            .select()
            .single();

        if (respError) {
            throw new Error('Error al registrar el responsable: ' + respError.message);
        }

        id_responsable_db = respData.id_responsables;
        isNewResponsable = true; // Marca que se acaba de crear para un posible rollback
    }

    // 3. Crear el paciente asociado al responsable y a la clínica
    const nuevoPaciente = {
        nombre: data.nombre_paciente,
        edad: data.edad,
        color: data.color,
        senia: data.senia || null, // Opcional
        sexo: data.sexo,
        raza: data.raza,
        peso: data.peso,
        esterilizado: data.esterilizado,
        tiene_microchip: data.tiene_microchip,
        num_microchip: data.tiene_microchip ? data.num_microchip : null,
        activo: false, // Empieza en false por defecto
        especie: data.especie,
        id_responsable: id_responsable_db,
        id_clinica: id_clinica // Se inyecta desde el controlador (viene del token JWT)
    };

    const { data: pacData, error: pacError } = await supabase
        .from('pacientes')
        .insert([nuevoPaciente])
        .select()
        .single();

    // 4. Lógica de Rollback si falla el paciente
    if (pacError) {
        // SOLO borrar al responsable si lo se acaba de crear en esta misma petición
        // No se puede borrar a un dueño que ya existía si falla la carga de su 2da mascota
        if (isNewResponsable) {
            await supabase
                .from('responsables')
                .delete()
                .eq('id_responsables', id_responsable_db);
        }
        throw new Error('Error al registrar el paciente: ' + pacError.message);
    }

    return {
        responsable_id: id_responsable_db,
        paciente: pacData
    };
};

// Obtener todos los pacientes de una clínica 
const getAllPatientsByClinic = async (id_clinica) => {
    const { data, error } = await supabase
        .from('pacientes')
        .select(`
            *,
            responsables (*) 
        `) // El (*) trae todos los datos de la tabla relacionada "responsables"
        .eq('id_clinica', id_clinica)
        .order('id_pacientes', { ascending: false }) // Ordenar del más nuevo al más viejo

    if (error) {
        throw new Error('Error al obtener los pacientes: ' + error.message);
    }

    return data;
};

// Obtener un paciente específico asegurando que pertenezca a la clínica
const getPatientById = async (id_paciente, id_clinica) => {
    const { data, error } = await supabase
        .from('pacientes')
        .select(`
            *,
            responsables (*)
        `)
        .eq('id_pacientes', id_paciente)
        .eq('id_clinica', id_clinica)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // Código de Supabase para "No se encontraron filas"
            throw new Error('Paciente no encontrado o no tienes permisos para verlo');
        }
        throw new Error('Error al obtener el paciente: ' + error.message);
    }

    return data;
};

// Actualizar un paciente (PATCH) validando la clínica
const updatePatientById = async (id_paciente, id_clinica, updateData) => {
    // 1. Verificar que el paciente exista y pertenezca a una clínica
    const { data: existingPatient, error: searchError } = await supabase
        .from('pacientes')
        .select('id_pacientes')
        .eq('id_pacientes', id_paciente)
        .eq('id_clinica', id_clinica)
        .single();

    if (searchError || !existingPatient) {
        throw new Error('Paciente no encontrado o no tienes permisos para editarlo');
    }

    // 2. Si todo está bien, realizar el update parcial
    const { data, error } = await supabase
        .from('pacientes')
        .update(updateData)
        .eq('id_pacientes', id_paciente)
        .select()
        .single();

    if (error) {
        throw new Error('Error al actualizar el paciente: ' + error.message);
    }

    return data;
};

// Eliminar un paciente (solo si NO tiene visitas)
const deletePatient = async (id_paciente, id_clinica) => {
    // 1. Verificar que el paciente exista y pertenezca a la clínica
    const { data: patient, error: patientError } = await supabase
        .from('pacientes')
        .select('id_pacientes')
        .eq('id_pacientes', id_paciente)
        .eq('id_clinica', id_clinica)
        .single();

    if (patientError || !patient) {
        throw new Error('Paciente no encontrado o no tienes permisos para eliminarlo');
    }

    // 2. Verificar si tiene VISITAS asociadas
    const { data: visitas, error: visitasError } = await supabase
        .from('visitas')
        .select('id_visitas')
        .eq('id_paciente', id_paciente)
        .limit(1); // Con encontrar 1 sola, no se puede borrar

    if (visitasError) {
        throw new Error('Error al verificar el historial del paciente');
    }

    if (visitas && visitas.length > 0) {
        throw new Error('No se puede eliminar el paciente porque tiene consultas médicas asociadas. Te sugerimos cambiar su estado a "inactivo".');
    }

    // 3. Si no tiene visitas, procede a borrarlo
    const { error: deleteError } = await supabase
        .from('pacientes')
        .delete()
        .eq('id_pacientes', id_paciente);

    if (deleteError) {
        // En caso de que el paciente tenga vacunas o resúmenes IA (otras tablas relacionadas)
        // la base de datos bloqueará el borrado automáticamente gracias a las Foreign Keys.
        throw new Error('No se pudo eliminar: asegúrate de que el paciente no tenga vacunas ni reportes IA asociados.');
    }

    return true; // Borrado exitoso
};


// Funciones para responsables

// Obtener todos los responsables que tengan mascotas en una clínica
const getAllResponsiblesByClinic = async (id_clinica) => {
    const { data, error } = await supabase
        .from('responsables')
        .select(`
            *,
            pacientes!inner(id_clinica) 
        `) // El !inner hace un INNER JOIN: solo trae responsables si tienen coincidencias en pacientes
        .eq('pacientes.id_clinica', id_clinica);

    if (error) {
        throw new Error('Error al obtener los responsables: ' + error.message);
    }

    // Como un responsable puede tener 2 mascotas en la misma clínica, la base de datos 
    // podría devolverlo duplicado. Con esta forma se puede limpiar duplicados por ID:
    const uniqueResponsibles = Array.from(new Map(data.map(item => [item.id_responsables, item])).values());

    // Limpiar el array "pacientes" que trajo el join para que la respuesta sea más limpia
    return uniqueResponsibles.map(({ pacientes, ...resto }) => resto);
};

// Obtener un responsable por ID (validando que tenga mascotas en la clínica)
const getResponsibleById = async (id_responsable, id_clinica) => {
    const { data, error } = await supabase
        .from('responsables')
        .select(`
            *,
            pacientes!inner(id_clinica)
        `)
        .eq('id_responsables', id_responsable)
        .eq('pacientes.id_clinica', id_clinica)
        .limit(1)
        .single();

    if (error) {
        throw new Error('Responsable no encontrado o no pertenece a tu clínica');
    }

    const { pacientes, ...responsableLimpio } = data;
    return responsableLimpio;
};

// Actualizar un responsable por ID
const updateResponsibleById = async (id_responsable, id_clinica, updateData) => {
    // 1. Verificar si existe y pertenece a la clínica usando la función creada anteriormente
    await getResponsibleById(id_responsable, id_clinica);

    // 2. Realizar el update
    const { data, error } = await supabase
        .from('responsables')
        .update(updateData)
        .eq('id_responsables', id_responsable)
        .select()
        .single();

    if (error) {
        // Por si intentan actualizar con un email que ya está en uso por otro usuario
        if (error.code === '23505') throw new Error('El email ingresado ya está registrado a nombre de otro responsable');
        throw new Error('Error al actualizar el responsable: ' + error.message);
    }

    return data;
};

module.exports = {
    createPatientAndResponsible,
    getAllPatientsByClinic,
    getPatientById,
    updatePatientById,
    getAllResponsiblesByClinic,
    getResponsibleById,
    updateResponsibleById,
    deletePatient
};