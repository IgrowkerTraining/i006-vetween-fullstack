const express = require("express");
const router = express.Router();

const {
    createSummary,
    getSummariesByPatient
} = require("../controllers/AIReportController");

const validateData = require("../middleware/validateData");
const { protect } = require("../middleware/authMiddleware");
const { generarResumenSchema } = require("../schemas/AIReportSchema");

router.use(protect);

router.post("/ia/generar-resumen", validateData(generarResumenSchema), createSummary);

router.get("/pacientes/:id/ia", getSummariesByPatient);

module.exports = router;