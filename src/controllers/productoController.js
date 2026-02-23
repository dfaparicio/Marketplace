import Producto from "../models/Producto.js";

export const crear = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;

    let imagen_url = null;

    // 2. Verificamos si Multer atrapó un archivo
    if (req.file) {
      // req.file.filename contiene el nombre generado por Multer (ej: 167890-123.jpg)
      // Guardamos la ruta relativa para poder consumirla desde el frontend
      imagen_url = `/uploads/productos/${req.file.filename}`;
    }

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
    const producto = await Producto.findById(id);

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

export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen_url } = req.body;

    const prodcutoExistente = await Usuario.findById(id);
    if (!prodcutoExistente) {
      return res.status(404).json({
        error: true,
        mensaje: "Usuario no encontrado",
      });
    }

    const datosActualizar = { nombre, descripcion, precio, stock, imagen_url };

    const productoActualizado = await Producto.actualizar(id, datosActualizar);

    res.json({
      error: false,
      mensaje: "Producto actualizado correctamente",
      producto: productoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productoExistente = await Usuario.findById(id);
    if (!productoExistente) {
      return res.status(404).json({
        error: true,
        mensaje: "Usuario no encontrado",
      });
    }

    await Producto.eliminar(id);
    res.json({
      error: false,
      mensaje: "Producto eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};
