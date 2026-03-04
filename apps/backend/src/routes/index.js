const express = require("express");
const authRoutes = require("./auth");
const healthRoutes = require("./health");
const patientsRoutes = require("./patients");
const responsibleRoutes = require("./responsibles");
const clinicRoutes = require("./clinic");
const veterinarianRoutes = require("./veterinarian");
const visitRoutes = require("./visit");
const vaccineRoutes = require("./vaccine");
const aiReportRoutes = require("./AIReport");

const router = express.Router();
router.use("/health", healthRoutes);

router.use("/auth", authRoutes);
router.use("/clinica", clinicRoutes);
router.use("/veterinario", veterinarianRoutes);

router.use("/responsables", responsibleRoutes);
router.use("/pacientes", patientsRoutes);

router.use("/visitas", visitRoutes);
router.use("/vacunas", vaccineRoutes);
router.use("/ia", aiReportRoutes);

module.exports = router;
