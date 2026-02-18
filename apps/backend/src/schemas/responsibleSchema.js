const Joi = require('joi');

const responsibleSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),
    
    apellido: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'El apellido es obligatorio',
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 100 caracteres'
    }),
    
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.email': 'Debes ingresar un formato de email válido',
        'string.empty': 'El email es obligatorio'
    }),

    telefono: Joi.string().trim().max(20).required().messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
    }),

    direccion: Joi.string().trim().max(200).required().messages({
        'string.empty': 'La dirección no puede estar vacía',
        'string.max': 'La dirección no puede tener más de 200 caracteres'
    }),
    
    relacion: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'La relación con el paciente es obligatoria (ej: Dueño, Cuidador)',
        'string.min': 'La relación debe tener al menos 2 caracteres',
        'string.max': 'La relación no puede tener más de 50 caracteres'
    })
});

module.exports = { responsibleSchema };