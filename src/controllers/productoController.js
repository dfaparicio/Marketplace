import Producto from "../models/Producto.js";

export const crear = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, stock, imagen_url } = req.body;

    const nuevoProducto = await Producto.crear({
      nombre,
      descripcion,
      precio,
      stock,
      imagen_url,
    });

    res.status(201).json({
      error: false,
      mensaje: "Producto creada exitosamente",
      producto: nuevoProducto,
    });
  } catch (error) {
    next(error);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const producto = await Producto.buscarPorId(id);

    if (!producto) {
      return res.json(404).json({
        error: true,
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      error: false,
      producto,
    });
  } catch (error) {
    next(error);
  }
};

export const listar = async (req, res, next) => {
  try {
    const filtros = {
      busqueda: req.query.q, 
      categoria_id: req.query.cat,
      precio_min: req.query.min, 
      precio_max: req.query.max, 
      vendedor_id: req.query.vendedor,
      pagina: req.query.pagina,
      limite: req.query.limite,
    };

    const producto = await Producto.obtenerTodos(filtros);

    res.json({
      error: false,
      producto,
      filtros_aplicados: filtros,
    });
  } catch (error) {
    next(error);
  }
};
