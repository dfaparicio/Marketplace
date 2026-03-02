import Categoria from "../models/Categoria.js";
import fs from "fs";
import {
  construirFiltrosMongo,
  parsearOrdenamiento,
} from "../utils/filtros.js";

// Crear categoria
export const crear = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;

    let imagen_icono = null;

    if (req.file) {
      imagen_icono = `/uploads/Categorias/${req.file.filename}`;
    }

    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion,
      imagen_icono,
    });

    res.status(201).json({
      error: false,
      memsaje: "Categoria creada exitosamente",
      Categoria: nuevaCategoria,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// Buscar categoria por id
export const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({
        error: true,
        mensaje: "Categoria no encontrada",
      });
    }

    res.json({
      error: false,
      categoria,
    });
  } catch (error) {
    next(error);
  }
};

// Listar categorias degun filtros 
export const listar = async (req, res, next) => {
  try {
    const { q, orden, limite = 10, pagina = 1 } = req.query;

    // Si no hay busqueda, nos trae todos
    const rawFiltros = q ? { busqueda: q } : {};

    const queryMongo = q
      ? construirFiltrosMongo(rawFiltros, ["nombre", "descripcion"])
      : {};

    const sortMongo = parsearOrdenamiento(orden);

    const limitInt = parseInt(limite);
    const pageInt = parseInt(pagina);
    const skip = (pageInt - 1) * limitInt;

    const [categorias, total] = await Promise.all([
      Categoria.find(queryMongo).sort(sortMongo).skip(skip).limit(limitInt),
      Categoria.countDocuments(queryMongo),
    ]);

    res.json({
      error: false,
      metadata: {
        total,
        pagina_actual: pageInt,
        paginas_totales: Math.ceil(total / limitInt),
        limite: limitInt,
      },
      categorias,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar una categoria
export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, imagen_icono } = req.body;

    const CategoriaExistente = await Categoria.findById(id);
    if (!CategoriaExistente) {
      return res.status(404).json({
        error: true,
        mensaje: "Categoria no encontrada",
      });
    }

    const datosActualizar = { nombre, descripcion, imagen_icono };

    const CategoriaActualizada = await Categoria.findByIdAndUpdate(
      id,
      datosActualizar,
      { new: true },
    );

    res.json({
      error: false,
      mensaje: "Categoria actualizada correctamente",
      Categoria: CategoriaActualizada,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una categoria
export const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const CategoriaExistente = await Categoria.findById(id);
    if (!CategoriaExistente) {
      return res.status(404).json({
        error: true,
        mensaje: "Categoria no encontrada",
      });
    }

    await Categoria.findByIdAndDelete(id);

    res.json({
      error: false,
      mensaje: "Categoria eliminada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};
