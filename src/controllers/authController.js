import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";
import { generarToken } from "../utils/jwt.js";
import { validationResult } from 'express-validator';
import { correoRecuperacion } from "../utils/mailer.js";

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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Por seguridad, es mejor no revelar si el correo existe o no a un atacante.
      return res.status(404).json({
        error: true,
        mensaje: "Si el correo existe, se ha enviado un código de recuperación.", 
      });
    }

    // 1. Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Configurar expiración (ej. 1 hora = 3600000 ms)
    usuario.resetPasswordCode = codigo;
    usuario.resetPasswordExpires = Date.now() + 3600000;
    await usuario.save();

    // 3. Enviar correo
    const correoEnviado = await correoRecuperacion(usuario.email, codigo);

    if (!correoEnviado) {
      // Si falla el correo, limpiamos la DB para evitar tokens huérfanos
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

export const resetPassword = async (req, res, next) => {
  try {
    const { email, codigo, nuevaPassword } = req.body;

    // Buscamos al usuario que coincida con email, código y que el token NO haya expirado
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

    // Hashear la nueva contraseña
    const passwordHash = await bcrypt.hash(nuevaPassword, 12);

    // Actualizar usuario y limpiar los campos de recuperación
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