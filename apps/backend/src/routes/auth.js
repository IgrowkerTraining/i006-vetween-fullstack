const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const validateData = require('../middleware/validateData');
const { registerSchema, loginSchema } = require('../schemas/authSchema');

router.post(
    '/register', 
    validateData(registerSchema),
    authController.register
);

router.post(
    '/login', 
    validateData(loginSchema), 
    authController.login
);

module.exports = router;
