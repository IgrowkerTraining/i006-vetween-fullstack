const iaService = require("../services/AIReportService");

const generarResumen = async (req, res) => {
    try {
        const { id_paciente, datos_clinicos } = req.body;

        if (!id_paciente || !datos_clinicos) {
            return res.status(400).json({
                success: false,
                message:
                "El paciente no posee información clínica suficiente para generar resumen",
            });
        }

        const resumen = await iaService.generarResumen(
            id_paciente,
            datos_clinicos
        );

        return res.status(200).json(resumen);
    } catch (error) {
        if (error.message === "PATIENT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Paciente no encontrado",
            });
        }

        if (error.message === "IA_ERROR") {
        return res.status(500).json({
            success: false,
            message: "Error al generar resumen con el servicio de IA",
        });
}

        return res.status(500).json({
            success: false,
            message: "Error al generar resumen con el servicio de IA",
        });
    }
};

const obtenerResumenesPorPaciente = async (req, res) => {
    try {
        const { id } = req.params;

        const resumenes = await iaService.obtenerResumenesPorPaciente(id);

        return res.status(200).json(resumenes);
    } catch (error) {
        if (error.message === "PATIENT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Paciente no encontrado",
            });
        }

        if (error.message === "IA_ERROR") {
            return res.status(500).json({
                success: false,
                message: "Error al generar resumen con el servicio de IA",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error al generar resumen con el servicio de IA",
        });
    }
};

module.exports = {
    generarResumen,
    obtenerResumenesPorPaciente,
};