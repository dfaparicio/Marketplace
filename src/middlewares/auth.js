import { verificarToken, extraerTokenDeHeader } from "../utils/jwt.js";
import { Usuario } from "../models/Usuario.js";


// Middleware para autenticar el JWT

export const autenticar = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Validación preventiva: si no hay header, no intentamos extraer nada
    if (!authHeader) {
      return res.status(401).json({
        error: true,
        mensaje: "No se proporcionó un token de autenticación",
      });
    }

    const token = extraerTokenDeHeader(authHeader);
    const payload = verificarToken(token);

    const usuario = await Usuario.buscarPorId(payload.id);

    if (!usuario) {
      return res.status(401).json({
        error: true,
        mensaje: "Usuario no válido o ya no existe",
      });
    }

    // Inyectamos el usuario en la request para los siguientes middlewares
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      mensaje: "Token inválido o expirado",
      detalles: error.message, // Opcional, según qué tanto quieras mostrar al cliente
    });
  }
};

/**
 * Middleware para control de acceso por roles
 * @param {string|string[]} rolesPermitidos
 */
export const requiereRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // Si req.usuario no existe (porque olvidaste poner 'autenticar' antes)
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
