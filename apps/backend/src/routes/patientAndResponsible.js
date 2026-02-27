const express = require('express');
const router = express.Router();
const validateData = require('../middleware/validateData');
const { protect } = require('../middleware/authMiddleware');
const patientAndResponsibleController = require('../controllers/patientAndResponsibleController');
const { patientAndResponsibleSchema, updatePatientSchema, updateResponsibleSchema } = require('../schemas/patientAndResponsibleSchema');

// Ruta para crear paciente y responsable juntos
router.post('/', 
    protect,
    validateData(patientAndResponsibleSchema), 
    patientAndResponsibleController.createPatientAndResponsible
);

// Rutas para pacientes

router.patch('/pacientes/:id', 
    protect,
    validateData(updatePatientSchema), 
    patientAndResponsibleController.updatePatient
);

router.get('/pacientes', 
    protect,
    patientAndResponsibleController.getAllPatient
);

router.get('/pacientes/:id', 
    protect,
    patientAndResponsibleController.getPatientById
);

router.delete('/pacientes/:id', 
    protect, 
    patientAndResponsibleController.removePatient
);

// Rutas para responsables
router.patch('/responsables/:id',
    protect,
    validateData(updateResponsibleSchema), 
    patientAndResponsibleController.updateResponsible
);

router.get('/responsables', 
    protect,
    patientAndResponsibleController.getAllResponsibles
);

router.get('/responsables/:id',
    protect,
    patientAndResponsibleController.getResponsibleById
);



module.exports = router;