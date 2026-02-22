import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";

export const crear = async (req, res, next) => {
  try {

    const { nombre, email, password, rol } = req.body;

    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({
        error: true,
        mensaje: "El email ya está registrado",
      });
    }

    const passwordEncriptada = await bcrypt.hash(password, 12);

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