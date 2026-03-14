const Joi = require('joi');

const provinciasValidas = [
    'CABA', 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 
    'Cordoba', 'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy', 
    'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquen', 
    'Rio Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 
    'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucuman'
];

const relacionValida = ['Dueño/a', 'Tutor/a', 'Cuidador/a'];

// Pattern
const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const alMenosUnaLetra = /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;

const responsibleSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).pattern(soloLetras).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres',
        'string.pattern.base': 'El nombre solo puede contener letras y espacios'
    }), 
    
    apellido: Joi.string().trim().min(2).max(100).pattern(soloLetras).required().messages({
        'string.empty': 'El apellido es obligatorio',
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 100 caracteres',
        'string.pattern.base': 'El apellido solo puede contener letras y espacios'
    }),
    
    email: Joi.string().trim().lowercase().email().max(100).required().messages({
        'string.email': 'Debes ingresar un formato de email válido',
        'string.empty': 'El email es obligatorio',
        'string.max': 'El email no puede tener mas de 100 caracteres'
    }),

    telefono: Joi.string().trim().min(8).max(20).pattern(/^[0-9\s]+$/).required().messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.min': 'El teléfono debe tener al menos 8 caracteres',
        'string.max': 'El teléfono no puede tener más de 20 caracteres',
        'string.pattern.base': 'El teléfono solo puede contener números y espacios'
    }),

    direccion_calle: Joi.string().trim().min(2).max(150).pattern(alMenosUnaLetra).required().messages({
        'string.empty': 'La calle no puede estar vacía',
        'string.min': 'La calle debe tener al menos 2 caracteres',
        'string.max': 'La calle no puede tener más de 150 caracteres',
        'string.pattern.base': 'La calle solo puede contener letras, espacios y números (pero debe contener al menos una letra)'
    }),

    direccion_numero: Joi.number().integer().positive().max(99999).required().messages({
        'number.base': 'El número de dirección debe ser numérico o no se ha ingresado uno',
        'number.positive': 'El número de dirección no puede ser negativo',
        'number.max': 'El número de dirección no puede tener más de 5 dígitos',
        'any.required': 'El número de dirección es obligatorio'
    }),

    direccion_localidad: Joi.string().trim().min(2).max(100).pattern(alMenosUnaLetra).required().messages({
        'string.empty': 'La ciudad / localidad no puede estar vacía',
        'string.min': 'La ciudad / localidad debe tener al menos 2 caracteres',
        'string.max': 'La ciudad no puede tener más de 100 caracteres',
        'string.pattern.base': 'La ciudad / localidad solo puede contener letras, espacios y números (pero debe contener al menos una letra)'
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
    nombre: Joi.string().trim().min(2).max(50).pattern(soloLetras).messages({
        'string.empty': 'El nombre no puede estar vacío',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres',
        'string.pattern.base': 'El nombre solo puede contener letras y espacios'
    }),
    
    apellido: Joi.string().trim().min(2).max(100).pattern(soloLetras).messages({
        'string.empty': 'El apellido no puede estar vacío',
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 100 caracteres',
        'string.pattern.base': 'El apellido solo puede contener letras y espacios'
    }),

    telefono: Joi.string().trim().min(8).max(20).pattern(/^[0-9\s]+$/).messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.min': 'El teléfono debe tener al menos 8 caracteres',
        'string.max': 'El teléfono no puede tener más de 20 caracteres',
        'string.pattern.base': 'El teléfono solo puede contener números y espacios'
    }),

    email: Joi.string().trim().lowercase().email().max(100).messages({
        'string.email': 'Debes ingresar un formato de email válido',
        'string.max': 'El email no puede tener mas de 100 caracteres'
    }),

    direccion_calle: Joi.string().trim().min(2).max(150).pattern(alMenosUnaLetra).messages({
        'string.empty': 'La calle no puede estar vacía',
        'string.min': 'La calle debe tener al menos 2 caracteres',
        'string.max': 'La calle no puede tener más de 150 caracteres',
        'string.pattern.base': 'La calle solo puede contener letras, espacios y números (pero debe contener al menos una letra)'
    }),

    direccion_numero: Joi.number().integer().positive().max(99999).messages({
        'number.base': 'El número de dirección debe ser numérico o no se ha ingresado uno',
        'number.positive': 'El número de dirección debe ser mayor a cero',
        'number.max': 'El número de dirección no puede tener más de 5 dígitos'
    }),

    direccion_localidad: Joi.string().trim().min(2).max(100).pattern(alMenosUnaLetra).messages({
        'string.empty': 'La ciudad / localidad no puede estar vacía',
        'string.min': 'La ciudad / localidad debe tener al menos 2 caracteres',
        'string.max': 'La ciudad no puede tener más de 100 caracteres',
        'string.pattern.base': 'La ciudad / localidad solo puede contener letras, espacios y números (pero debe contener al menos una letra)'
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