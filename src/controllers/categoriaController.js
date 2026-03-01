import Categoria from "../models/Categoria.js";
import { construirFiltrosMongo, parsearOrdenamiento } from '../utils/filtros.js';

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

export const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Categoria = await Categoria.findById(id);

    if (!Categoria) {
      return res.status(404).json({
        error: true,
        mensaje: "Categoria no encontrada",
      });
    }

    res.json({
      error: false,
      Categoria,
    });
  } catch (error) {
    next(error);
  }
};

export const listar = async (req, res, next) => {
  try {
    const rawFiltros = { busqueda: req.query.q };
    
    const queryMongo = construirFiltrosMongo(rawFiltros, ["nombre", "descripcion"]);
    const sortMongo = parsearOrdenamiento(req.query.orden);

    const limite = parseInt(req.query.limite) || 10;
    const pagina = parseInt(req.query.pagina) || 1;
    const skip = (pagina - 1) * limite;

    const [Categoria, total] = await Promise.all([
      Categoria.find(queryMongo).sort(sortMongo).skip(skip).limit(limite),
      Categoria.countDocuments(queryMongo)
    ]);

    res.json({
      error: false,
      metadata: { 
        total, 
        pagina_actual: pagina, 
        paginas_totales: Math.ceil(total / limite),
        limite 
      },
      Categoria
    });
  } catch (error) {
    next(error);
  }
};

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
