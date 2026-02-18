const clinicService = require('../services/clinicService');
const { updateClinicSchema } = require('../schemas/clinicSchema');

const update = async (req, res) => {
    try {
        // Validar datos
        const { error, value } = updateClinicSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        // Obtener el ID de la clínica del token
        const { id_clinica } = req.user; 

        const updatedClinic = await clinicService.updateClinic(id_clinica, value);

        res.json({
            success: true,
            message: 'Datos de la clínica actualizados',
            data: updatedClinic
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOne = async (req, res) => {
    try {
        const { id_clinica } = req.user;
        const clinic = await clinicService.getMyClinic(id_clinica);
        res.json({ success: true, data: clinic });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { update, getOne };