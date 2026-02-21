const jwt = require('jsonwebtoken');
const ResponseHelper = require('../utils/responseHelper');

const protect = (req, res, next) => {
    let token;

    // 1. Verificar si hay token en los headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Obtener el token del header "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Guardar los datos del usuario en la request
            // Aquí es donde 'req.user' se le asigna el valor de 'decoded', que contiene la información del usuario extraída del token
            req.user = decoded; 

            next(); // Continuar al controlador
        } catch (error) {
            console.error(error);
            ResponseHelper.unauthorized(res, 'No autorizado, token inválido'); 
        }
    }

    if (!token) {
        ResponseHelper.unauthorized(res, 'No autorizado, no hay token');
    }
};

module.exports = { protect };