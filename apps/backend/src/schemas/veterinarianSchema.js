const Joi = require('joi');

// ENUMS
const especialidadesValidas = [
    'Clinica general', 
    'Medicina preventiva', 
    'Dermatologia', 
    'Diagnostico', 
    'Urgencias', 
    'Otra'
];

const tiposAnimalesValidos = ['Caninos', 'Felinos', 'Aves', 'Peces', 'Roedores', 'Otro'];

const updateVeterinarianSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).messages({
        'string.base': 'El nombre debe ser texto',
        'string.empty': 'El nombre no puede estar vacío',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),
    
    apellido: Joi.string().trim().min(2).max(100).messages({
        'string.base': 'El apellido debe ser texto',
        'string.empty': 'El apellido no puede estar vacío',
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 100 caracteres'
    }),
    
    especialidad: Joi.string().valid(...especialidadesValidas).messages({
        'any.only': 'Selecciona una especialidad válida'
    }),
    
    tipos_animales: Joi.array().items(
        Joi.string().valid(...tiposAnimalesValidos)
    ).min(1).messages({
        'array.base': 'Tipos de animales debe ser un arreglo (lista)',
        'array.min': 'Seleccionar al menos un tipo de animal',
        'any.only': 'Uno o más tipos de animales ingresados no son válidos'
    }),

    costo_consulta: Joi.number().precision(2).positive().max(999999).messages({
        'number.base': 'El costo de consulta debe ser un número',
        'number.positive': 'El costo de consulta no puede ser negativo',
        'number.max': 'El costo de consulta no puede exceder de 999999',
    })
})
// Asegurar que el cliente envíe al menos un campo en el JSON para actualizar
.min(1).messages({
    'object.min': 'Se debe proporcionar al menos un campo para hacer la actualización'
});

module.exports = {
    updateVeterinarianSchema
};