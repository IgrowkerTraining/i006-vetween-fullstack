const express = require("express");
const authRoutes = require("./auth");
const healthRoutes = require("./health");
const patientsRoutes = require("./patients");
const responsibleRoutes = require("./responsibles");
const clinicRoutes = require("./clinic");
const veterinarianRoutes = require("./veterinarian");
const visitRoutes = require("./visit");
const vaccineRoutes = require("./vaccine");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/pacientes", patientsRoutes);
router.use("/responsables", responsibleRoutes);
router.use("/clinica", clinicRoutes);
router.use("/veterinario", veterinarianRoutes);
router.use("/visitas", visitRoutes);
router.use("/vacunas", vaccineRoutes);

module.exports = router;
