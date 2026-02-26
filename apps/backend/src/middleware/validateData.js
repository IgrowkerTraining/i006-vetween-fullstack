const validateData = (schema) => {
    return (req, res, next) => {
        // abortEarly: false permite mostrar TODOS los errores juntos, no solo el primero
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
        // Extraemos los mensajes de error de Joi
        const errorMessages = error.details.map((detail) => detail.message);
        
        return res.status(400).json({
            ok: false,
            message: 'Error de validación',
            errors: errorMessages
        });
        }

        // Si no hay error, pasamos al controlador
        next();
    };
};

module.exports = validateData;