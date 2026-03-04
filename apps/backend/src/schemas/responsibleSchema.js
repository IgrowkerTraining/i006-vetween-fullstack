const Joi = require('joi');

const provinciasValidas = [
    'CABA', 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 
    'Cordoba', 'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy', 
    'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquen', 
    'Rio Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 
    'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucuman'
];

const relacionValida = ['Dueño/a', 'Tutor/a', 'Cuidador/a']

const responsibleSchema = Joi.object({
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

    telefono: Joi.string().trim().max(20).required().messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
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
    
    relacion: Joi.string().valid(...relacionValida).required().messages({
        'any.only': 'Debes seleccionar una relación válida',
        'any.required': 'La relación es obligatoria'
    })
});

const updateResponsibleSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).messages({
        'string.empty': 'El nombre no puede estar vacío',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),
    
    apellido: Joi.string().trim().min(2).max(100).messages({
        'string.empty': 'El apellido no puede estar vacío',
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 100 caracteres'
    }),

    telefono: Joi.string().trim().max(20).messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
    }),

    email: Joi.string().trim().lowercase().email().required().messages({
        'string.email': 'Debes ingresar un formato de email válido',
        'string.empty': 'El email es obligatorio'
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
    }),
    
    relacion: Joi.string().valid(...relacionValida).messages({
        'any.only': 'Debes seleccionar una relación válida',
    })
}).min(1).messages({
    'object.min': 'Debes enviar al menos un campo para actualizar al responsable'
});

module.exports = { responsibleSchema, updateResponsibleSchema };