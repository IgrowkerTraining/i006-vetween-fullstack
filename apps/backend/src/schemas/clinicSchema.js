const Joi = require('joi');

const updateClinicSchema = Joi.object({
    nombre: Joi.string().trim().max(150).messages({
        'string.empty': 'El nombre no puede estar vacío'
    }),
    direccion: Joi.string().trim().max(150).allow('').optional().messages({
        'string.empty': 'La dirección no puede estar vacía',
        'string.max': 'La dirección no puede tener más de 150 caracteres'
    }),
    telefono: Joi.string().trim().max(20).allow('').optional().messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
    }),
});

module.exports = { updateClinicSchema };