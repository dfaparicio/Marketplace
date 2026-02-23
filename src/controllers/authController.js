import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";
import { generarToken } from "../utils/jwt.js";
import { validationResult } from 'express-validator';

export const registro = async (req, res, next) => {
  try {

    const { nombre, email, password, rol } = req.body;
    const usuarioExistente = await Usuario.findOne({email});

    if (usuarioExistente) {
      return res.status(409).json({
        error: true,
        mensaje: "El email ya está registrado",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const nuevoUsuario = await Usuario.crear({
      nombre,
      email,
      password: passwordHash,
      rol: rol || "comprador",
    });

    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      error: false,
      mensaje: "Usuario registrado exitosamente",
      usuario: nuevoUsuario,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        error: true,
        mensaje: "Credenciales inválidas",
        errores: errores.array(),
      });
    }

    const { email, password } = req.body;
    const usuario = await Usuario.findOne({email});

    if (!usuario) {
      return res.status(401).json({
        error: true,
        mensaje: "Credenciales incorrectas",
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        error: true,
        mensaje: "Credenciales incorrectas",
      });
    }

    const usuarioLimpio = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    const token = generarToken(usuarioLimpio);

    res.json({
      error: false,
      mensaje: "Inicio de sesión exitoso",
      usuario: usuarioLimpio,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const perfil = async (req, res, next) => {
  try {
    // Asumiendo que el middleware de auth ya inyectó req.usuario
    const usuario = await Usuario.findById(req.usuario.id);

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