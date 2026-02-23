const Joi = require('joi');

const visitSchema = Joi.object({
    fecha: Joi.date().iso().max('now').required().messages({
        'date.base': 'La fecha debe tener un formato válido (YYYY-MM-DD)',
        'date.max': 'La fecha de la visita no puede ser futura',
        'any.required': 'La fecha es obligatoria'
    }),

    motivo_consulta: Joi.string().trim().min(2).max(200).required().messages({
        'string.empty': 'El motivo de consulta es obligatorio',
        'string.max': 'El motivo no puede superar los 200 caracteres',
        'any.required': 'Debes indicar el motivo de la consulta'
    }),

    diagnostico: Joi.string().trim().allow(null, '').optional(),
    
    tratamiento: Joi.string().trim().allow(null, '').optional(),
    
    observaciones: Joi.string().trim().allow(null, '').optional(),

    estado: Joi.boolean().default(true).optional().messages({
        'boolean.base': 'El estado debe ser un valor booleano'
    }),

    id_paciente: Joi.number().integer().positive().required().messages({
        'number.base': 'El ID del paciente debe ser un número',
        'any.required': 'El ID del paciente es obligatorio para registrar la visita'
    }),
});

module.exports = { visitSchema };