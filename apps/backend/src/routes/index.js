const express = require('express');
const authRoutes = require('./auth');
const healthRoutes = require('./health');
const veterinarianRoutes = require('./veterinarian');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/veterinarian', veterinarianRoutes);

module.exports = router;
