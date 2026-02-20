import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { Usuario } from "../models/Usuario.js";

// Crear un nuevo usuario
export const crear = async (req, res, next) => {
  try {
    // Verificar errores de validación
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        error: true,
        mensaje: "Datos inválidos",
        errores: errores.array(),
      });
    }

    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({
        error: true,
        mensaje: "El email ya está registrado",
      });
    }

    // Encriptar contraseña
    const passwordEncriptada = await bcrypt.hash(password, 12);

    // Crear usuario
    const nuevoUsuario = await Usuario.crear({
      nombre,
      email,
      password: passwordEncriptada,
      rol: rol || "comprador",
    });

    res.status(201).json({
      error: false,
      mensaje: "Usuario creado exitosamente",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un usuario por su ID
export const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.buscarPorId(id);

    if (!usuario) {
      return res.status(404).json({
        error: true,
        mensaje: "Usuario no encontrado",
      });
    }

    res.json({
      error: false,
      usuario,
    });
  } catch (error) {
    next(error);
  }
};

// Listar usuarios con filtros
export const listar = async (req, res, next) => {
  try {
    const filtros = {
      rol: req.query.rol,
      busqueda: req.query.q,
      pagina: req.query.pagina,
      limite: req.query.limite,
    };

    const usuarios = await Usuario.obtenerTodos(filtros);

    res.json({
      error: false,
      usuarios,
      filtros_aplicados: filtros,
    });
  } catch (error) {
    next(error);
  }
};
