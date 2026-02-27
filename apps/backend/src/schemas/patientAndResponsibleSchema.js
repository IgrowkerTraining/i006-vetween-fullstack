const Joi = require('joi');

//ENUMS
const sexosValidos = ['Macho', 'Hembra'];
const especiesValidas = ['Caninos', 'Felinos', 'Aves', 'Peces', 'Roedores', 'Otro'];
const provinciasValidas = [
    'CABA', 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 
    'Cordoba', 'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy', 
    'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquen', 
    'Rio Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 
    'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucuman'
];
const relacionValida = ['Dueño/a', 'Tutor/a', 'Cuidador/a']


const patientAndResponsibleSchema = Joi.object({
    nombre_paciente: Joi.string().trim().min(2).max(50).required().messages({
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
        'string.max': 'Las señas/caracteristicas no puede tener más de 255 caracteres'
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


    // Campos del responsable


    nombre_responsable: Joi.string().trim().min(2).max(50).required().messages({
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

    direccion_calle: Joi.string().trim().min(2).max(150).required().messages({
        'string.empty': 'La calle no puede estar vacía',
        'string.min': 'La calle debe tener al menos 2 caracteres',
        'string.max': 'La calle no puede tener más de 150 caracteres'
    }),

    direccion_numero: Joi.string().trim().max(10).required().messages({
        'string.empty': 'El número de dirección no puede estar vacío',
        'string.max': 'El número no puede tener más de 10 caracteres'
    }),

    direccion_localidad: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'La ciudad / localidad no puede estar vacía',
        'string.min': 'La ciudad / localidad debe tener al menos 2 caracteres',
        'string.max': 'La ciudad no puede tener más de 100 caracteres'
    }),

    provincia: Joi.string().valid(...provinciasValidas).required().messages({
        'any.only': 'Debes seleccionar una provincia válida',
        'any.required': 'La provincia es obligatoria'
    }),
    
    relacion: Joi.string().valid(...relacionValida).required().messages({
        'any.only': 'Debes seleccionar una relación válida',
        'any.required': 'La relación es obligatoria'
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

const updateResponsibleSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).messages({
        'string.empty': 'El nombre no puede estar vacío',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),
    
    apellido: Joi.string().trim().min(2).max(100).messages({
        'string.empty': 'El apellido no puede estar vacío',
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 100 caracteres'
    }),

    telefono: Joi.string().trim().max(20).messages({
        'string.empty': 'El teléfono no puede estar vacío',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
    }),

    direccion_calle: Joi.string().trim().min(2).max(150).messages({
        'string.empty': 'La calle no puede estar vacía',
        'string.min': 'La calle debe tener al menos 2 caracteres',
        'string.max': 'La calle no puede tener más de 150 caracteres'
    }),

    direccion_numero: Joi.string().trim().max(10).messages({
        'string.empty': 'El número de dirección no puede estar vacío',
        'string.max': 'El número no puede tener más de 10 caracteres'
    }),

    direccion_localidad: Joi.string().trim().min(2).max(100).messages({
        'string.empty': 'La ciudad / localidad no puede estar vacía',
        'string.min': 'La ciudad / localidad debe tener al menos 2 caracteres',
        'string.max': 'La ciudad no puede tener más de 100 caracteres'
    }),

    provincia: Joi.string().valid(...provinciasValidas).messages({
        'any.only': 'Debes seleccionar una provincia válida',
    }),
    
    relacion: Joi.string().valid(...relacionValida).messages({
        'any.only': 'Debes seleccionar una relación válida',
    })
}).min(1).messages({
    'object.min': 'Debes enviar al menos un campo para actualizar al responsable'
});

module.exports = { patientAndResponsibleSchema, updatePatientSchema, updateResponsibleSchema };