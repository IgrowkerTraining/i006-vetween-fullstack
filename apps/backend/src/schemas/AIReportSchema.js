const Joi = require('joi');

const generarResumenSchema = Joi.object({
    id_paciente: Joi.number().integer().positive().required().messages({
        'number.base': 'El ID del paciente debe ser un número',
        'any.required': 'El ID del paciente es obligatorio'
    }),

    datos_clinicos: Joi.object({
        paciente: Joi.object().required().messages({
            'any.required': 'Los datos del paciente son obligatorios'
        }),
        
        // Joi.array() valida que se envie una lista de visitas (puede estar vacía)
        visitas: Joi.array().required().messages({
            'array.base': 'Las visitas deben enviarse en formato de lista',
            'any.required': 'El historial de visitas es obligatorio'
        }),

        vacunas: Joi.array().required().messages({
            'array.base': 'Las vacunas deben enviarse en formato de lista',
            'any.required': 'El historial de vacunas es obligatorio'
        })
    }).required().messages({
        'object.base': 'Los datos clínicos deben tener un formato válido',
        'any.required': 'Se requieren los datos clínicos para generar el resumen'
    })
});

module.exports = { generarResumenSchema };