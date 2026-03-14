const Joi = require('joi');

// Pattern
const alMenosUnaLetra = /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,:]+$/;

const visitSchema = Joi.object({
    fecha: Joi.date().iso().max('now').required().messages({
        'date.base': 'La fecha debe tener un formato válido (YYYY-MM-DD)',
        'date.format': 'La fecha debe tener el formato ISO (YYYY-MM-DD)',
        'date.max': 'La fecha de la visita no puede ser futura',
        'any.required': 'La fecha es obligatoria'
    }),

    motivo_consulta: Joi.string().trim().min(2).max(200).required().messages({
        'string.empty': 'El motivo de consulta es obligatorio',
        'string.min': 'El motivo de consulta debe tener al menos 2 caracteres',
        'string.max': 'El motivo no puede superar los 200 caracteres',
        'any.required': 'Debes indicar el motivo de la consulta'
    }),

    diagnostico: Joi.string().trim().max(2000).allow(null, '').pattern(alMenosUnaLetra).optional().messages({
        'string.max': 'El diagnóstico no puede tener más de 2000 caracteres',
        'string.pattern.base': 'El diagnóstico solo puede contener letras, espacios, números y "." "," o ":" (pero debe contener al menos una letra)'
    }),
    
    tratamiento: Joi.string().trim().max(2000).allow(null, '').pattern(alMenosUnaLetra).optional().messages({
        'string.max': 'El tratamiento no puede tener más de 2000 caracteres',
        'string.pattern.base': 'El tratamiento solo puede contener letras, espacios, números y "." "," o ":" (pero debe contener al menos una letra)'
    }),
    
    observaciones: Joi.string().trim().max(2000).allow(null, '').pattern(alMenosUnaLetra).optional().messages({
        'string.max': 'Las observaciones no pueden tener más de 2000 caracteres',
        'string.pattern.base': 'Las observaciones solo pueden contener letras, espacios, números y "." "," o ":" (pero debe contener al menos una letra)'
    }),

    estado: Joi.boolean().default(false).optional().messages({
        'boolean.base': 'El estado debe ser un valor booleano'
    }),

    historial_previo: Joi.boolean().default(false).optional().messages({
        'boolean.base': 'El campo de historial previo debe ser un valor booleano',
    }),

    id_paciente: Joi.number().integer().positive().required().messages({
        'number.base': 'El ID del paciente debe ser un número',
        'any.required': 'El ID del paciente es obligatorio para registrar la visita'
    }),
});

module.exports = { visitSchema };