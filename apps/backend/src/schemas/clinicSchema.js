const Joi = require('joi');

const provinciasValidas = [
    'CABA', 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 
    'Cordoba', 'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy', 
    'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquen', 
    'Rio Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 
    'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucuman'
];

// Pattern
const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

const updateClinicSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(150).pattern(soloLetras).messages({
        'string.empty': 'El nombre no puede estar vacío',
        'string.min': 'El nombre del consultorio debe tener al menos 2 caracteres',
        'string.max': 'El nombre del consultorio no puede tener más de 150 caracteres',
        'string.pattern.base': 'El nombre solo puede contener letras y espacios'
    }),

    direccion_calle: Joi.string().trim().min(2).max(150).pattern(soloLetras).messages({
        'string.empty': 'La calle no puede estar vacía',
        'string.min': 'La calle debe tener al menos 2 caracteres',
        'string.max': 'La calle no puede tener más de 150 caracteres',
        'string.pattern.base': 'La calle solo puede contener letras y espacios'
    }),

    direccion_numero: Joi.number().integer().positive().max(99999).messages({
        'number.base': 'El número de dirección debe ser numérico',
        'number.positive': 'El número de dirección debe ser mayor a cero',
        'number.max': 'El número de dirección no puede tener más de 5 dígitos'
    }),

    direccion_localidad: Joi.string().trim().min(2).max(100).pattern(soloLetras).messages({
        'string.empty': 'La ciudad / localidad no puede estar vacía',
        'string.min': 'La ciudad / localidad debe tener al menos 2 caracteres',
        'string.max': 'La ciudad no puede tener más de 100 caracteres',
        'string.pattern.base': 'La ciudad / localidad solo puede contener letras y espacios'
    }),

    provincia: Joi.string().valid(...provinciasValidas).messages({
        'any.only': 'Debes seleccionar una provincia válida'
    }),

    telefono: Joi.string().trim().min(8).max(20).pattern(/^[0-9\s]+$/).messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.min': 'El teléfono debe tener al menos 8 caracteres',
        'string.max': 'El teléfono no puede tener más de 20 caracteres',
        'string.pattern.base': 'El teléfono solo puede contener números y espacios'
    })
}).min(1).messages({
    'object.min': 'Se debe proporcionar al menos un campo para hacer la actualización de la clínica'
});

module.exports = { updateClinicSchema };