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
    
    relacion: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'La relación con el paciente es obligatoria (ej: Dueño, Cuidador)',
        'string.min': 'La relación debe tener al menos 2 caracteres',
        'string.max': 'La relación no puede tener más de 50 caracteres'
    })
});

const updateResponsibleSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),
    
    apellido: Joi.string().trim().min(2).max(100).messages({
        'string.empty': 'El apellido es obligatorio',
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 100 caracteres'
    }),
    
    email: Joi.string().trim().lowercase().email().messages({
        'string.email': 'Debes ingresar un formato de email válido',
        'string.empty': 'El email es obligatorio'
    }),

    telefono: Joi.string().trim().max(20).messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
    }),

    direccion_calle: Joi.string().trim().min(6).max(150).messages({
        'string.empty': 'La dirección no puede estar vacía',
        'string.min': 'La dirección debe tener al menos 6 caracteres',
        'string.max': 'La dirección no puede tener más de 150 caracteres'
    }),

        
    direccion_numero: Joi.string().trim().min(3).max(6).messages({
        'string.empty': 'El número no puede estar vacío',
        'string.min': 'El número debe tener al menos 3 caracteres',
        'string.max': 'El número no puede tener más de 6 caracteres'
    }),

    direccion_localidad: Joi.string().trim().min(6).max(150).messages({
        'string.empty': 'La localidad no puede estar vacía',
        'string.min': 'La localidad debe tener al menos 6 caracteres',
        'string.max': 'La localidad no puede tener más de 150 caracteres'
    }),
    
    provincia: Joi.string().trim().min(6).max(150).messages({
        'string.empty': 'La provinica no puede estar vacía',
        'string.min': 'La provincia debe tener al menos 6 caracteres',
        'string.max': 'La provincia no puede tener más de 150 caracteres'
    }),
    
    relacion: Joi.string().trim().min(2).max(50).messages({
        'string.empty': 'La relación con el paciente es obligatoria (ej: Dueño, Cuidador)',
        'string.min': 'La relación debe tener al menos 2 caracteres',
        'string.max': 'La relación no puede tener más de 50 caracteres'
    })
});

module.exports = { responsibleSchema, updateResponsibleSchema };