const express = require('express');
const router = express.Router();
const vaccineController = require('../controllers/vaccineController');
const validateData = require('../middleware/validateData');
const { protect } = require('../middleware/authMiddleware');
const { vaccineSchema } = require('../schemas/vaccineSchema');

router.post('/', 
    protect,
    validateData(vaccineSchema), 
    vaccineController.registerVaccine
);

router.patch('/:id/inactivar', 
    protect,
    vaccineController.inactivateVaccine
);

module.exports = router;