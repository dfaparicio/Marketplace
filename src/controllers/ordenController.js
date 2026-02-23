import Orden from "../models/Orden.js";

export const crear = async (req, res, next) => {
  try {
    const { total, estado, direccion_envio, notas } = req.body;

    const nuevaOrden = await Orden.create({
      total,
      estado,
      direccion_envio,
      notas,
    });

    res.status(201).json({
      error: false,
      mensaje: "Orden creada exitosamente",
      orden: nuevaOrden,
    });
  } catch (error) {
    next(error);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orden = await Orden.findById(id);

    if (!orden) {
      return res.status(404).json({
        error: true,
        mensaje: "Orden no encontrada",
      });
    }

    res.json({
      error: false,
      orden,
    });
  } catch (error) {
    next(error);
  }
};

export const listar = async (req, res, next) => {
  try {
    const filtros = {
      comprador_id: req.query.comprador,
      estado: req.query.estado,
      total_min: req.query.min,
      total_max: req.query.max,
      pagina: req.query.pagina,
      limite: req.query.limite,
    };

    const orden = await Orden.find(filtros);

    res.json({
      error: false,
      orden,
      filtros_aplicados: orden,
    });
  } catch (error) {
    next(error);
  }
};
