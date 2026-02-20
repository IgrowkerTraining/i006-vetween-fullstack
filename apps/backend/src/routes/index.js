const express = require('express');
const authRoutes = require('./auth');
const healthRoutes = require('./health');
const patientsRoutes = require('./patients');
const responsibleRoutes = require('./responsibles');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/pacientes', patientsRoutes);
router.use('/responsables', responsibleRoutes);

module.exports = router;
