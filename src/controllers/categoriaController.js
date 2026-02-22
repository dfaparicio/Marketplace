import Categorias from "../models/Categoria.js";

export const crear = async (req, res, next) => {
  try {

    const { nombre, descripcion, imagen_icono } = req.body;

    const nuevaCategoria = await Categorias.crear({
      nombre,
      descripcion,
      imagen_icono,
    });

    res.status(201).json({
      error: false,
      memsaje: "Categoria creada exitosamente",
      categoria: nuevaCategoria,
    });
  } catch (error) {
    next(error);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categorias = await Categorias.buscarPorId(id);

    if (!categorias) {
      return res.status(404).json({
        error: true,
        mensaje: "Categoria no encontrada",
      });
    }

    res.json({
      error: false,
      categorias,
    });
  } catch (error) {
    next(error);
  }
};

export const listar = async (req, res, next) => {
  try {
    const filtros = {
      nombre: req.query.nombre,
      busqueda: req.query.q,
      pagina: req.query.pagina,
      limite: req.query.limite,
    };

    const categoria = await Categorias.obtenerTodos(filtros);

    res.json({
      error: false,
      categoria,
      filtros_aplicados: categoria,
    });
  } catch (error) {
    next(error);
  }
};
