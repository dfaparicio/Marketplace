import { validationResult } from 'express-validator';

export const validarCampos = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      mensaje: "Errores de validación",
      errores: errors.array(),
    });
  }
  next();
};
