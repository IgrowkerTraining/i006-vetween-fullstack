const Joi = require('joi');

const updateClinicSchema = Joi.object({
    nombre: Joi.string().trim().max(150).required().messages({
        'string.empty': 'El nombre no puede estar vacío',
        'string.max': 'El nombre del consultorio no puede tener más de 150 caracteres'
    }),
    direccion_calle: Joi.string().trim().min(6).max(150).required().messages({
        'string.empty': 'La dirección no puede estar vacía',
        'string.min': 'La dirección debe tener al menos 6 caracteres',
        'string.max': 'La dirección no puede tener más de 150 caracteres'
    }),
    direccion_numero: Joi.string().trim().min(3).max(6).required().messages({
        'string.empty': 'El número no puede estar vacío',
        'string.min': 'El número debe tener al menos 3 caracteres',
        'string.max': 'El número no puede tener más de 6 caracteres'
    }),
    direccion_localidad: Joi.string().trim().min(6).max(150).required().messages({
        'string.empty': 'La localidad no puede estar vacía',
        'string.min': 'La localidad debe tener al menos 6 caracteres',
        'string.max': 'La localidad no puede tener más de 150 caracteres'
    }),
    provincia: Joi.string().trim().min(6).max(150).required().messages({
        'string.empty': 'La provinica no puede estar vacía',
        'string.min': 'La provincia debe tener al menos 6 caracteres',
        'string.max': 'La provincia no puede tener más de 150 caracteres'
    }),
    telefono: Joi.string().trim().max(20).required().messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
    }),
});

module.exports = { updateClinicSchema };