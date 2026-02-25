const express = require('express');
const authRoutes = require('./auth');
const healthRoutes = require('./health');
const clinicRoutes = require('./clinic');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);

router.use('/clinica', clinicRoutes);

module.exports = router;
