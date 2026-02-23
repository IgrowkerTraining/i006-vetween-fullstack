const { registerSchema, loginSchema } = require('../schemas/authSchema');
const userService = require('../services/userService');

const register = async (req, res) => {
    try {
        // Validar datos con Joi
        // abortEarly: false nos muestra TODOS los errores del formulario, no solo el primero
        const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            // Formatear errores de Joi para que sean fáciles de leer en el front
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Errores de validación',
                errors: errorMessages
            });
        }

        const result = await userService.registerUser(value);

        res.status(201).json({
            success: true,
            message: 'Clínica y Veterinario registrados exitosamente',
            data: result
        });

    } catch (error) {
        console.error("Register Error:", error);
        
        let statusCode = 500;
        if (error.message.includes('ya están registrados') || error.message.includes('Ya existe una clínica con ese número de habilitación')) {
            statusCode = 409;
        }

        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { user, token } = await userService.loginUser(value.email, value.password);

        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            user
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { register, login };