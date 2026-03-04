const Joi = require('joi');

const sexosValidos = ['Macho', 'Hembra'];

const especiesValidas = ['Caninos', 'Felinos', 'Aves', 'Peces', 'Roedores', 'Otro'];

const patientSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),
    
    especie: Joi.string().valid(...especiesValidas).required().messages({
        'any.only': 'Especie no válida'
    }),
    
    edad: Joi.number().integer().positive().required().messages({
        'number.base': 'La edad debe ser un número',
        'number.positive': 'La edad no puede ser negativa'
    }),
    
    color: Joi.string().trim().min(2).max(30).required().messages({
        'string.empty': 'El color es obligatorio',
        'string.min': 'El color debe tener al menos 2 caracteres',
        'string.max': 'El color no puede tener más de 30 caracteres'
    }),

    senia: Joi.string().trim().max(255).allow(null, '').messages({
        'string.max': 'Las señas / caracteristicas no puede tener más de 255 caracteres'
    }),

    sexo: Joi.string().valid(...sexosValidos).required().messages({
        'any.only': 'Selecciona un sexo válido'
    }),
    
    raza: Joi.string().trim().max(150).required().messages({
        'string.empty': 'El nombre de la raza es obligatorio',
        'string.max': 'El nombre de la raza no puede tener más de 150 caracteres'
    }),

    peso: Joi.number().positive().precision(2).required().messages({
        'number.base': 'El peso debe ser un número entero',
        'number.positive': 'El peso debe ser un número positivo',
        'any.required': 'El peso es requerido para registrar al paciente'
    }),

    esterilizado: Joi.boolean().required().messages({
        'boolean.base': 'El esterilizado debe ser un valor booleano',
        'any.required': 'El esterilizado es requerido para registrar al paciente'
    }),

    tiene_microchip: Joi.boolean().required().messages({
        'boolean.base': 'El campo de microchip debe ser un valor booleano',
        'any.required': 'El campo de microchip es requerido para registrar al paciente'
    }),

    num_microchip: Joi.string().trim().when('tiene_microchip', {
        is: true,
        then: Joi.string().max(30).required().messages({
            'string.empty': 'El número de microchip es obligatorio cuando el paciente tiene microchip',
            'string.max': 'El número de microchip no puede tener más de 30 caracteres'
        })
    }),

    activo: Joi.boolean().required().messages({
        'boolean.base': 'El campo activo debe ser un valor booleano',
        'any.required': 'El campo activo es requerido para registrar al paciente'
    }),

    id_responsable: Joi.number().integer().positive().required().messages({
        'number.base': 'El ID del responsable debe ser un número',
        'number.positive': 'El ID del responsable debe ser un número positivo',
        'any.required': 'El ID del responsable es obligatorio para registrar al paciente'
    })
});

const updatePatientSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).messages({
        'string.empty': 'El nombre no puede estar vacío',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),

    especie: Joi.string().valid(...especiesValidas).messages({
        'any.only': 'Especie no válida'
    }),

    edad: Joi.number().integer().positive().messages({
        'number.base': 'La edad debe ser un número',
        'number.positive': 'La edad no puede ser negativa'
    }),

    color: Joi.string().trim().min(2).max(30).messages({
        'string.empty': 'El color no puede estar vacío',
        'string.min': 'El color debe tener al menos 2 caracteres',
        'string.max': 'El color no puede tener más de 30 caracteres'
    }),

    senia: Joi.string().trim().max(255).allow(null, '').messages({
        'string.max': 'Las señas/caracteristicas no puede tener más de 255 caracteres'
    }),

    sexo: Joi.string().valid(...sexosValidos).messages({
        'any.only': 'Selecciona un sexo válido'
    }),

    raza: Joi.string().trim().max(150).messages({
        'string.empty': 'El nombre de la raza no puede estar vacío',
        'string.max': 'El nombre de la raza no puede tener más de 150 caracteres'
    }),

    peso: Joi.number().positive().precision(2).messages({
        'number.base': 'El peso debe ser un número',
        'number.positive': 'El peso debe ser un número positivo'
    }),

    esterilizado: Joi.boolean().messages({
        'boolean.base': 'El esterilizado debe ser un valor booleano'
    }),

    tiene_microchip: Joi.boolean().messages({
        'boolean.base': 'El campo de microchip debe ser un valor booleano'
    }),

    num_microchip: Joi.string().trim().when('tiene_microchip', {
        is: true,
        then: Joi.string().max(30).required().messages({
            'string.empty': 'El número de microchip es obligatorio si tiene microchip',
            'string.max': 'El número de microchip no puede tener más de 30 caracteres'
        })
    }),
    
    activo: Joi.boolean().messages({
        'boolean.base': 'El campo activo debe ser un valor booleano'
    })

}).min(1).messages({
    'object.min': 'Debes enviar al menos un campo para actualizar al paciente'
});

module.exports = { patientSchema, updatePatientSchema };