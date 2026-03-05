const Joi = require('joi');

// Definimos ENUMS para validarlos con Joi
const especialidadesValidas = [
    'Clinica general', 'Medicina preventiva', 'Dermatología', 'Diagnóstico',
    'Urgencias', 'Otra', 'Compania', 'Produccion', 'Silvestres', 'Exoticos', 'Acuaticos'
];

const tiposAnimalesValidos = [
    'Perros', 'Gatos', 'Conejos', 'Aves', 'Bovinos', 'Porcinos', 'Caprinos', 
    'Ovinos', 'Aves de corral', 'Mamiferos silvestres', 'Aves silvestres', 
    'Reptiles silvestres', 'Reptiles exoticos', 'Roedores exoticos', 'Aves exoticas', 
    'Peces', 'Crustaceos'
];

// Esquema de validación para el register (registro)
const registerSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),
    
    apellido: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'El apellido es obligatorio',
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 100 caracteres'
    }),
    
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.email': 'Debes ingresar un formato de email válido',
        'string.empty': 'El email es obligatorio'
    }),
    
    // Regex para password: Mínimo 8 chars, 1 mayúscula, 1 minúscula, 1 número
    password: Joi.string().min(8).pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)).required().messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.pattern.base': 'La contraseña debe contener 1 letra mayúscula, 1 minúscula y minimo un número'
    }),
    
    matricula: Joi.number().integer().positive().required().messages({
        'number.base': 'La matrícula debe ser un número',
        'number.positive': 'La matrícula no puede ser negativa'
    }),
    
    especialidad: Joi.array().items(
        Joi.string().valid(...especialidadesValidas)).min(1).required().messages({
        'array.min': 'Debes seleccionar al menos una especialidad'
    }),
    
    tipos_animales: Joi.array().items(
        Joi.string().valid(...tiposAnimalesValidos)).min(1).required().messages({
        'array.min': 'Debes seleccionar al menos un tipo de animal'
    }),

    costo_consulta: Joi.number().precision(2).positive().required().messages({
        'number.base': 'El costo de consulta debe ser un número',
        'number.positive': 'El costo de consulta no puede ser negativo'
    }),

    nombre_consultorio: Joi.string().trim().max(150).required().messages({
        'string.empty': 'El nombre del consultorio es obligatorio',
        'string.max': 'El nombre del consultorio no puede tener más de 150 caracteres'
    }),

    // hacer UNIQUE a la clínica
    num_habilitacion: Joi.string().trim().required().messages({
        'string.empty': 'El número de habilitación municipal/sanitaria es obligatorio',
        'any.required': 'El número de habilitación es requerido para registrar la clínica'
    }),

    direccion_calle: Joi.string().trim().max(150).allow('').optional(),
    direccion_numero: Joi.string().trim().max(20).allow('').optional(),
    direccion_localidad: Joi.string().trim().max(100).allow('').optional(),
    provincia: Joi.string().trim().max(100).allow('').optional(),
    telefono: Joi.string().trim().max(20).allow('').required().messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.email': 'Email inválido',
        'string.empty': 'El email es requerido'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'La contraseña es requerida'
    })
});

module.exports = {
    registerSchema,
    loginSchema
};