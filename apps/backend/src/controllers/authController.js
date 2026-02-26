const userService = require('../services/userService');
const ResponseHelper = require('../utils/responseHelper');

const register = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);

        return ResponseHelper.created(res, result, 'Clínica y Veterinario registrados exitosamente');

    } catch (error) {
        if (error.message.includes('ya están registrados') || error.message.includes('Ya existe una clínica con ese número de habilitación')) {
            return ResponseHelper.conflict(res, error.message);
        }

        return ResponseHelper.error(res, error.message, error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { user, token } = await userService.loginUser(email, password);

        return ResponseHelper.success(res, { token, user }, 'Login exitoso');

    } catch (error) {
        return ResponseHelper.unauthorized(res, error.message);
    }
};

module.exports = { register, login };