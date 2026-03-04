const express = require("express");
const router = express.Router();
const aiReportController = require("../controllers/AIReportController");
const validateData = require("../middleware/validateData");
const { protect } = require("../middleware/authMiddleware");
const { generarResumenSchema } = require("../schemas/AIReportSchema");

router.use(protect);

router.post("/generar-resumen", 
    validateData(generarResumenSchema), 
    aiReportController.createSummary
);

router.get("/pacientes/:id/ia", 
    aiReportController.getSummariesByPatient);

module.exports = router;