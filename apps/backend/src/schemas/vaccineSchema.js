const Joi = require('joi');

const vaccineSchema = Joi.object({
    tipo: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'El tipo de vacuna es obligatorio'
    }),

    nombre_cientifico: Joi.string().trim().min(2).max(150).required().messages({
        'string.empty': 'El nombre científico es obligatorio'
    }),
    
    fecha_aplicacion: Joi.date().iso().max('now').required().messages({
        'date.base': 'Fecha inválida',
        'date.max': 'La fecha no puede ser futura',
        'any.required': 'La fecha de aplicación es obligatoria'
    }),

    observacion: Joi.string().trim().max(200).allow('', null).optional(),

    estado: Joi.boolean().default(false).optional(),

    id_paciente: Joi.number().integer().positive().required().messages({
        'number.base': 'El ID del paciente debe ser un número',
        'any.required': 'El ID del paciente es obligatorio'
    }),
});

module.exports = { vaccineSchema };