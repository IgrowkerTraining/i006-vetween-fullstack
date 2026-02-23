const Joi = require('joi');

const aiReportSchema = Joi.object({
    id_paciente: Joi.number().integer().positive().required().messages({
        'number.base': 'El ID del paciente debe ser un número',
        'any.required': 'El reporte debe estar asociado a un paciente'
    }),

    id_request_ia: Joi.number().integer().allow(null).optional(),

    resumen_completo: Joi.string().trim().required().messages({
        'string.empty': 'El resumen completo no puede estar vacío',
        'any.required': 'El contenido del resumen es obligatorio'
    }),

    // JSON ESTRUCTURADO (Para la columna JSONB)
    // Validar que sea un objeto válido con .unknown(true) que permite cualquier clave dentro.
    resumen_estruct: Joi.object().unknown(true).allow(null).optional().messages({
        'object.base': 'El resumen estructurado debe ser un objeto JSON válido'
    }),

    // METADATOS
    modelo: Joi.string().trim().max(100).allow(null, '').optional(),
    
    fecha: Joi.date().iso().max('now').optional()
});

module.exports = { aiReportSchema };