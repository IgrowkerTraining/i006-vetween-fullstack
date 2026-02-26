const veterinarioService = require('../services/veterinarianService');
const ResponseHelper = require('../utils/responseHelper');

const getVeterinarian = async (req, res) => {
    try {
        // Obtener el ID del token JWT desencriptado
        const idVeterinario = req.user?.id || req.user?.id_veterinario;

        if (!idVeterinario) {
            return ResponseHelper.unauthorized(res, 'Usuario no autenticado'); 
        }

        const veterinario = await veterinarioService.getVeterinarianById(idVeterinario);

        return ResponseHelper.success(res, veterinario, "Datos del veterinario obtenidos exitosamente");
    } catch (error) {
        return ResponseHelper.error(res, 'Error al obtener veterinario', error);
    }
};

const updateVeterinarian = async (req, res) => {
    try {
        const idVeterinario = req.user?.id || req.user?.id_veterinario;

        if (!idVeterinario) {
            return ResponseHelper.unauthorized(res, 'Usuario no autenticado');
        }

        // req.body ya viene limpio y validado por el middleware validateData
        const updateData = req.body;

        const veterinarioActualizado = await veterinarioService.updateVeterinarian(idVeterinario, updateData);

        return ResponseHelper.success(res, veterinarioActualizado, "Veterinario actualizado exitosamente");
    } catch (error) {
        return ResponseHelper.error(res, 'Error al actualizar veterinario', error);
    }
};

module.exports = {
    getVeterinarian,
    updateVeterinarian
};