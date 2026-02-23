const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');
const validateData = require('../middleware/validateData');
const { protect } = require('../middleware/authMiddleware');
const { updateClinicSchema } = require('../schemas/clinicSchema');


router.put('/', 
    protect,
    validateData(updateClinicSchema), 
    clinicController.update
);

router.get('/', 
    protect,
    clinicController.getOne
);

module.exports = router;