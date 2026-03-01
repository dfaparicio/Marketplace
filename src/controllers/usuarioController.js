import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";
import { construirFiltrosMongo, parsearOrdenamiento } from '../utils/filtros.js';

export const crear = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({
        error: true,
        mensaje: "El email ya está registrado",
      });
    }

    const passwordEncriptada = await bcrypt.hash(password, 12);

    const nuevoUsuario = await Usuario.create({
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
    const usuario = await Usuario.findById(id);

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
    const rawFiltros = {
      rol: req.query.rol,
      busqueda: req.query.q,
    };

    // Que busque por nombre o email
    const queryMongo = construirFiltrosMongo(rawFiltros, ["nombre", "email"]);
    const sortMongo = parsearOrdenamiento(req.query.orden);

    const limite = parseInt(req.query.limite) || 10;
    const pagina = parseInt(req.query.pagina) || 1;
    const skip = (pagina - 1) * limite;

    const [usuarios, total] = await Promise.all([
      Usuario.find(queryMongo).select('-password').lean().sort(sortMongo).skip(skip).limit(limite),
      Usuario.countDocuments(queryMongo)
    ]);

    res.json({
      error: false,
      metadata: { total, pagina_actual: pagina, paginas_totales: Math.ceil(total / limite) },
      usuarios
    });
  } catch (error) {
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({
        error: true,
        mensaje: "Usuario no encontrado",
      });
    }

    const datosActualizar = { nombre, email, rol };

    if (password) {
      datosActualizar.password = await bcrypt.hash(password, 12);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      datosActualizar,
      { new: true },
    );

    res.json({
      error: false,
      mensaje: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({
        error: true,
        mensaje: "Usuario no encontrado",
      });
    }

    await Usuario.findByIdAndDelete(id);

    res.json({
      error: false,
      mensaje: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

export const cambiarContraseña = async (req, res, next) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;
    
    // El id viene del token JWT que valida la ruta (asumiendo que tu middleware lo inyecta ahí)
    const usuarioId = req.usuario.id; 

    const usuario = await Usuario.findById(usuarioId).select('+password');

    if (!usuario) {
      return res.status(404).json({
        error: true,
        mensaje: "Usuario no encontrado.",
      });
    }

    // 1. Verificar que la contraseña actual ingresada coincida con la de la DB
    const passwordValida = await bcrypt.compare(passwordActual, usuario.password);
    
    if (!passwordValida) {
      return res.status(401).json({
        error: true,
        mensaje: "La contraseña actual es incorrecta.",
      });
    }

    // 2. Hashear y guardar la nueva contraseña
    usuario.password = await bcrypt.hash(nuevaPassword, 12);
    await usuario.save();

    res.json({
      error: false,
      mensaje: "Contraseña actualizada exitosamente.",
    });
  } catch (error) {
    next(error);
  }
};
