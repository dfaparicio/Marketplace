import { verificarToken, extraerTokenDeHeader } from "../utils/jwt.js";
import Usuario from "../models/Usuario.js";


export const autenticar = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: true,
        mensaje: "No se proporcionó un token de autenticación",
      });
    }

    const token = extraerTokenDeHeader(authHeader);
    const payload = verificarToken(token);

    const usuario = await Usuario.findById(payload.id);

    if (!usuario) {
      return res.status(401).json({
        error: true,
        mensaje: "Usuario no válido o ya no existe",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      mensaje: "Token inválido o expirado",
      detalles: error.message,
    });
  }
};

export const requiereRol = (rolesPermitidos) => {
  return (req, res, next) => {
    
    if (!req.usuario) {
      return res.status(500).json({
        error: true,
        mensaje: "Error interno: El usuario no ha sido autenticado",
      });
    }

    const roles = Array.isArray(rolesPermitidos)
      ? rolesPermitidos
      : [rolesPermitidos];

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: true,
        mensaje: "No tienes permisos para realizar esta acción",
        rolRequerido: roles,
        tuRol: req.usuario.rol,
      });
    }

    next();
  };
};
