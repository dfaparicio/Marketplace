import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";
import { generarToken } from "../utils/jwt.js";
import { validationResult } from 'express-validator';
import { correoRecuperacion } from "../utils/mailer.js";

// Registro de un usuario
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
    const nuevoUsuario = await Usuario.create({
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

// Login general para todos los usuarios 
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

// Consulta de perfil autenticado
export const perfil = async (req, res, next) => {
  try {
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

// Solicitud de codigo para recuperar contraseña
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({
        error: true,
        mensaje: "Si el correo existe, se ha enviado un código de recuperación.", 
      });
    }

    // Genera un codigo random
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Configurar tiempo de espera del codigo
    usuario.resetPasswordCode = codigo;
    usuario.resetPasswordExpires = Date.now() + 3600000;
    await usuario.save();

    // Envio de correo al email 
    const correoEnviado = await correoRecuperacion(usuario.email, codigo);

    // Si falla el correo, limpia todo
    if (!correoEnviado) {
      usuario.resetPasswordCode = null;
      usuario.resetPasswordExpires = null;
      await usuario.save();
      
      return res.status(500).json({
        error: true,
        mensaje: "Error al enviar el correo. Intenta nuevamente.",
      });
    }

    res.json({
      error: false,
      mensaje: "Código de recuperación enviado al correo exitosamente.",
    });
  } catch (error) {
    next(error);
  }
};

// Reseteo y actualizacion de contrseña 
export const resetPassword = async (req, res, next) => {
  try {
    const { email, codigo, nuevaPassword } = req.body;

    // Email, codigo y que no haya expirado 
    const usuario = await Usuario.findOne({
      email,
      resetPasswordCode: codigo,
      resetPasswordExpires: { $gt: Date.now() } // $gt significa "mayor que" la fecha actual
    });

    if (!usuario) {
      return res.status(400).json({
        error: true,
        mensaje: "El código es inválido o ha expirado.",
      });
    }

    const passwordHash = await bcrypt.hash(nuevaPassword, 12);

    usuario.password = passwordHash;
    usuario.resetPasswordCode = null;
    usuario.resetPasswordExpires = null;
    await usuario.save();

    res.json({
      error: false,
      mensaje: "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
    });
  } catch (error) {
    next(error);
  }
};