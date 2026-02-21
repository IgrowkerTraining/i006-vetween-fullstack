const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const validateData = require('../middleware/validateData');
const { protect } = require('../middleware/authMiddleware');
const { visitSchema } = require('../schemas/visitSchema');

router.post('/', 
    protect,
    validateData(visitSchema), 
    visitController.createVisit
);

router.patch('/:id/inactivar', 
    protect,
    visitController.inactivateVisit
);

module.exports = router;