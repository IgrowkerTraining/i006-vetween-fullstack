const Joi = require('joi');

const generarResumenSchema = Joi.object({
    id_paciente: Joi.number().integer().positive().required().messages({
        "number.base": "El ID del paciente debe ser un número",
        "number.positive": "El ID del paciente debe ser un número positivo",
        "any.required": "El ID del paciente es obligatorio"
})
})
.unknown(false) // NO permite otros campos
.messages({
    "object.unknown": "El body solo debe contener el campo id_paciente"
});

module.exports = { generarResumenSchema };