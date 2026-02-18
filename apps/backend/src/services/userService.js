const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
    try {
        const { data: existingUser } = await supabase
            .from('veterinario')
            .select('email, matricula')
            .or(`email.eq.${userData.email}`)
            .single();

        if (existingUser) {
            throw new Error('El email o la matrícula ya están registrados');
        }

        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Crear la clínica primero para obtener su ID y vincularla al veterinario
        const nuevaClinica = {
            nombre: userData.nombre_consultorio,
            num_habilitacion: userData.num_habilitacion
        };

        const { data: clinicaCreada, error: errorClinica } = await supabase
            .from('clinica')
            .insert([nuevaClinica])
            .select()
            .single();

        if (errorClinica) {
            // Manejo específico si la clínica ya existe (por el UNIQUE del num_habilitacion)
            if (errorClinica.code === '23505') { 
                throw new Error('Ya existe una clínica registrada con ese número de habilitación.');
            }
            throw new Error('Error al registrar la clínica: ' + errorClinica.message);
        }

        const nuevoVeterinario = {
            nombre: userData.nombre,
            apellido: userData.apellido,
            email: userData.email,
            contraseña: hashedPassword,
            matricula: userData.matricula,
            especialidad: userData.especialidad,
            tipos_animales: userData.tipos_animales,
            costo_consulta: userData.costo_consulta,
            
            id_clinica: clinicaCreada.id_clinica
        };

        const { data: veterinarioCreado, error: errorVet } = await supabase
            .from('veterinario')
            .insert([nuevoVeterinario])
            .select()
            .single();

        if (errorVet) {
            // Rollback manual: Si falla crear el veterinario, borramos la clínica creada
            await supabase.from('clinica').delete().eq('id_clinica', clinicaCreada.id_clinica);
            throw new Error('Error al registrar al veterinario: ' + errorVet.message);
        }

        return { veterinario: veterinarioCreado, clinica: clinicaCreada };

    } catch (error) {
        throw error;
    }
};

const loginUser = async (email, password) => {
    try {
        const { data: user, error } = await supabase
            .from('veterinario')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            throw new Error('Credenciales inválidas'); 
        }

        const validPassword = await bcrypt.compare(password, user.contraseña);
        if (!validPassword) {
            throw new Error('Credenciales inválidas');
        }

        // Generar Token JWT 
        const token = jwt.sign(
            { 
                id: user.id_veterinario, 
                email: user.email,
                id_clinica: user.id_clinica 
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Quita la contraseña del objeto a devolver
        const { contraseña, ...userWithoutPassword } = user;
        
        return { user: userWithoutPassword, token };

    } catch (error) {
        throw error;
    }
};

module.exports = {
    registerUser,
    loginUser
};