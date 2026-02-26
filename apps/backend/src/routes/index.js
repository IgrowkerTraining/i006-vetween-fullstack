const express = require("express");
const authRoutes = require("./auth");
const healthRoutes = require("./health");
const patientsRoutes = require("./patients");
const responsibleRoutes = require("./responsibles");
const clinicRoutes = require("./clinic");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/pacientes", patientsRoutes);
router.use("/responsables", responsibleRoutes);
router.use("/clinica", clinicRoutes);

module.exports = router;
