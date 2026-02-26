class ResponseHelper {
  // ------------------------------------------------------------------
  // RESPUESTAS DE ÉXITO (2xx)
  // ------------------------------------------------------------------

  // 200 OK - Para GET, PUT, PATCH
  static success(res, data, message = 'Operación exitosa') {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  // 201 Created - Exclusivo para POST
  static created(res, data, message = 'Recurso creado exitosamente') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  // 204 No Content - Para DELETE
  static noContent(res) {
    return res.status(204).send();
  }

  // ------------------------------------------------------------------
  // RESPUESTAS DE ERROR DEL CLIENTE (4xx)
  // ------------------------------------------------------------------

  // 400 Bad Request - Errores generales de la petición
  static badRequest(res, message = 'Petición inválida') {
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // 400 Validation Error - Específico para el middleware validateData
  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación en los datos ingresados',
      errors,
    });
  }

  // 401 Unauthorized - Falla en login o token faltante/inválido
  static unauthorized(res, message = 'No autorizado para acceder a este recurso') {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  // 403 Forbidden - El token es válido, pero el usuario no tiene permisos
  static forbidden(res, message = 'Acceso denegado') {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  // 404 Not Found - El recurso buscado no existe en la base de datos
  static notFound(res, message = 'Recurso no encontrado') {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  // 409 Conflict - Ya existe un recurso con el mismo identificador 
  static conflict(res, message = 'Conflicto con un recurso existente') {
    return res.status(409).json({
      success: false,
      message,
    });
  }

  // ------------------------------------------------------------------
  // RESPUESTAS DE ERROR DEL SERVIDOR (5xx)
  // ------------------------------------------------------------------

  // 500 Internal Server Error - Errores internos
  static error(res, message = 'Error interno del servidor', error = null) {
    console.error('[Error del Servidor]:', error || message);
    
    return res.status(500).json({
      success: false,
      message,
      ...(error && { error: error.message || error }),
    });
  }
}

module.exports = ResponseHelper;