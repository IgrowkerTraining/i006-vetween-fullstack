const express = require('express');
const authRoutes = require('./auth');
const healthRoutes = require('./health');
const veterinarianRoutes = require('./veterinarian');
const patientsRoutes = require('./patients');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/veterinarian', veterinarianRoutes);
router.use('/patients', patientsRoutes);

module.exports = router;
