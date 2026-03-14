const Joi = require('joi');

// Pattern
const alMenosUnaLetra = /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;

const vaccineSchema = Joi.object({
    tipo: Joi.string().trim().min(2).max(100).pattern(alMenosUnaLetra).required().messages({
        'string.empty': 'El tipo de vacuna es obligatorio',
        'string.min': 'El tipo de vacuna debe tener al menos 2 caracteres',
        'string.max': 'El tipo de vacuna no puede superar los 100 caracteres',
        'string.pattern.base': 'La observación solo puede contener letras, espacios y números (pero debe contener al menos una letra)',
        'any.required': 'Debes indicar el tipo de vacuna'
    }),

    nombre_cientifico: Joi.string().trim().min(2).max(150).required().messages({
        'string.empty': 'El nombre científico es obligatorio',
        'string.min': 'El nombre científico debe tener al menos 2 caracteres',
        'string.max': 'El nombre científico no puede superar los 150 caracteres',
        'any.required': 'Debes indicar el nombre científico de la vacuna'
    }),
    
    fecha_aplicacion: Joi.date().iso().max('now').required().messages({
        'date.base': 'Fecha inválida',
        'date.format': 'La fecha debe tener el formato ISO (YYYY-MM-DD)',
        'date.max': 'La fecha no puede ser futura',
        'any.required': 'La fecha de aplicación es obligatoria'
    }),

    observacion: Joi.string().trim().max(200).allow('', null).pattern(alMenosUnaLetra).optional().messages({
        'string.max': 'La observación no puede superar los 200 caracteres',
        'string.pattern.base': 'La observación solo puede contener letras, espacios y números (pero debe contener al menos una letra)'
    }),

    estado: Joi.boolean().default(false).optional().messages({
        'boolean.base': 'El estado debe ser un valor booleano'
    }),

    id_paciente: Joi.number().integer().positive().required().messages({
        'number.base': 'El ID del paciente debe ser un número',
        'any.required': 'El ID del paciente es obligatorio'
    }),
});

module.exports = { vaccineSchema };