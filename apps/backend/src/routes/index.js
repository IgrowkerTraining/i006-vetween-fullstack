const express = require('express');
const authRoutes = require('./auth');
const healthRoutes = require('./health');
const clinicRoutes = require('./clinic');
const veterinarianRoutes = require('./veterinarian');
const patientRoutes = require('./patient');
const visitRoutes = require('./visit');
const vaccineRoutes = require('./vaccine');

const patientAndResponsibleRoutes = require('./patientAndResponsible');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);


router.use('/clinica', clinicRoutes);
router.use('/veterinario', veterinarianRoutes);
router.use('/pacientes', patientRoutes);

router.use('/pacientes-responsables', patientAndResponsibleRoutes);

router.use('/visitas', visitRoutes);
router.use('/vacunas', vaccineRoutes);

module.exports = router;
