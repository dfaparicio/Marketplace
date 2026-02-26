import Categorias from "../models/Categoria.js";

export const crear = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;

    let imagen_icono = null;

    if (req.file) {
      imagen_icono = `/uploads/categorias/${req.file.filename}`;
    }

    const nuevaCategoria = await Categorias.create({
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
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categorias = await Categorias.findById(id);

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
    const categorias = await Categorias.find();

    res.json({
      error: false,
      total: categorias.length,
      categorias,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, imagen_icono } = req.body;

    const categoriaExistente = await Categorias.findById(id);
    if (!categoriaExistente) {
      return res.status(404).json({
        error: true,
        mensaje: "Categoria no encontrada",
      });
    }

    const datosActualizar = { nombre, descripcion, imagen_icono };

    const categoriaActualizada = await Categorias.findByIdAndUpdate(
      id,
      datosActualizar,
      { new: true },
    );

    res.json({
      error: false,
      mensaje: "Categoria actualizada correctamente",
      categoria: categoriaActualizada,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoriaExistente = await Categorias.findById(id);
    if (!categoriaExistente) {
      return res.status(404).json({
        error: true,
        mensaje: "Categoria no encontrada",
      });
    }

    await Categorias.findByIdAndDelete(id);

    res.json({
      error: false,
      mensaje: "Categoria eliminada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};
