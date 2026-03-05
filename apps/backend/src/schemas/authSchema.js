const Joi = require('joi');

// Definimos ENUMS para validarlos con Joi
const especialidadesValidas = [
    'Clinica general', 
    'Medicina preventiva', 
    'Dermatologia', 
    'Diagnostico', 
    'Urgencias', 
    'Otra'
];

const tiposAnimalesValidos = ['Caninos', 'Felinos', 'Aves', 'Peces', 'Roedores', 'Otro'];

const provinciasValidas = [
    'CABA', 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 
    'Cordoba', 'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy', 
    'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquen', 
    'Rio Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 
    'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucuman'
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
        'string.empty': 'La contraseña es obligatoria',
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.pattern.base': 'La contraseña debe contener 1 letra mayúscula, 1 minúscula y minimo un número'
    }),
    
    matricula: Joi.number().integer().positive().required().messages({
        'number.base': 'La matrícula debe ser un número',
        'number.positive': 'La matrícula no puede ser negativa'
    }),
    
    especialidad: Joi.array().items(
        Joi.string().valid(...especialidadesValidas)).min(1).required().messages({
        'array.base': 'La especialidad debe ser una lista (array) válida',
        'array.min': 'Debes seleccionar al menos una especialidad',
        'any.only': 'Debes seleccionar una especialidad válida',
        'any.required': 'La especialidad es obligatoria'
    }),
    
    tipos_animales: Joi.array().items(
        Joi.string().valid(...tiposAnimalesValidos)).min(1).required().messages({
        'array.min': 'Debes seleccionar al menos un tipo de animal',
        'array.base': 'Los tipos de animales debe ser una lista (array) válida',
        'any.only': 'Debes seleccionar un tipo de animal válido',
        'any.required': 'Los tipos de animales son obligatorios'
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
    num_habilitacion: Joi.string().trim().min(5).max(200).required().messages({
        'string.empty': 'El número de habilitación municipal/sanitaria es obligatorio',
        'string.min': 'El número de habilitación debe tener al menos 5 caracteres',
        'string.max': 'El número de habilitación no puede tener más de 200 caracteres',
        'any.required': 'El número de habilitación es requerido para registrar la clínica'
    }),

    direccion_calle: Joi.string().trim().min(2).max(150).required().messages({
        'string.empty': 'La calle no puede estar vacía',
        'string.min': 'La calle debe tener al menos 2 caracteres',
        'string.max': 'La calle no puede tener más de 150 caracteres'
    }),

    direccion_numero: Joi.string().trim().max(10).required().messages({
        'string.empty': 'El número de dirección no puede estar vacío',
        'string.max': 'El número no puede tener más de 10 caracteres'
    }),

    direccion_localidad: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'La ciudad / localidad no puede estar vacía',
        'string.min': 'La ciudad / localidad debe tener al menos 2 caracteres',
        'string.max': 'La ciudad no puede tener más de 100 caracteres'
    }),

    provincia: Joi.string().valid(...provinciasValidas).required().messages({
        'any.only': 'Debes seleccionar una provincia válida',
        'any.required': 'La provincia es obligatoria'
    }),
    
    telefono: Joi.string().trim().max(20).required().messages({
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