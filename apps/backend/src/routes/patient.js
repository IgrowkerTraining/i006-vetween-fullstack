const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const vaccineController = require('../controllers/vaccineController');
const { protect } = require('../middleware/authMiddleware');


// GET /api/pacientes/:id/visitas
router.get('/:id/visitas', protect, visitController.getPatientVisits);

// GET /api/pacientes/:id/vacunas
router.get('/:id/vacunas', protect, vaccineController.getPatientVaccines);

module.exports = router;