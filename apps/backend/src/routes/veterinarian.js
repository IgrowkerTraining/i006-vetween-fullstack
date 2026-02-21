const express = require('express');
const router = express.Router();
const veterinarianController = require('../controllers/veterinarianController');
const { protect } = require('../middleware/authMiddleware');
const validateData = require('../middleware/validateData');
const { updateVeterinarianSchema } = require('../schemas/veterinarianSchema');

router.get('/', 
    protect,
    veterinarianController.getVeterinarian
);

router.put('/', 
    protect, 
    validateData(updateVeterinarianSchema), 
    veterinarianController.updateVeterinarian
);

module.exports = router;