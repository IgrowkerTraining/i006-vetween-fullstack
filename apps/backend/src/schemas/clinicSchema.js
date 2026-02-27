const Joi = require('joi');

const provinciasValidas = [
    'CABA', 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 
    'Cordoba', 'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy', 
    'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquen', 
    'Rio Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 
    'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucuman'
];

const updateClinicSchema = Joi.object({
    nombre: Joi.string().trim().max(150).messages({
        'string.empty': 'El nombre no puede estar vacío',
        'string.max': 'El nombre del consultorio no puede tener más de 150 caracteres'
    }),
    
    direccion_calle: Joi.string().trim().min(2).max(150).messages({
        'string.empty': 'La calle no puede estar vacía',
        'string.min': 'La calle debe tener al menos 2 caracteres',
        'string.max': 'La calle no puede tener más de 150 caracteres'
    }),

    direccion_numero: Joi.string().trim().max(10).messages({
        'string.empty': 'El número de dirección no puede estar vacío',
        'string.max': 'El número no puede tener más de 10 caracteres'
    }),

    direccion_localidad: Joi.string().trim().min(2).max(100).messages({
        'string.empty': 'La ciudad / localidad no puede estar vacía',
        'string.min': 'La ciudad / localidad debe tener al menos 2 caracteres',
        'string.max': 'La ciudad no puede tener más de 100 caracteres'
    }),

    provincia: Joi.string().valid(...provinciasValidas).messages({
        'any.only': 'Debes seleccionar una provincia válida',
        'any.required': 'La provincia es obligatoria'
    }),

    telefono: Joi.string().trim().max(20).messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
    })
    
}).min(1).messages({
    'object.min': 'Se debe proporcionar al menos un campo para hacer la actualización de la clínica'
});

module.exports = { updateClinicSchema };