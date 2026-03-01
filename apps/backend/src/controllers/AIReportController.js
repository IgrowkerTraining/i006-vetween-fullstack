const {
    generateSummary,
    getSummariesByPatientFromDB
} = require("../services/AIReportService");

const createSummary = async (req, res) => {
    try {
        const data = await generateSummary(req.body);
        return res.status(201).json({
        success: true,
        message: "Resumen de IA generado y guardado correctamente",
        data
        });

    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message
        });
    }
};

const getSummariesByPatient = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await getSummariesByPatientFromDB(id);

        return res.status(200).json({
        success: true,
        data
        });

    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message
        });
    }
};

module.exports = {
    createSummary,
    getSummariesByPatient
};