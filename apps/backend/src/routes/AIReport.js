const express = require("express");
const router = express.Router();

const iaController = require("../controllers/AIReportController");
const validateData = require("../middleware/validateData");
const { protect } = require("../middleware/authMiddleware");
const { generarResumenSchema } = require("../schemas/AIReportSchema");

router.use(protect);

router.post(
    "/ia/generar-resumen",
    validateData(generarResumenSchema),
    iaController.generarResumen
);

router.get(
    "/pacientes/:id/ia",
    iaController.obtenerResumenesPorPaciente
);

module.exports = router;