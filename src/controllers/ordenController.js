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

    const ordenes = await Orden.find(filtros);

    res.json({
      error: false,
      total: ordenes.lenght,
      ordenes
    });
  } catch (error) {
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { total, estado, direccion_envio, notas } = req.body;

    const ordenExistente = await Orden.findById(id);
    if (!ordenExistente) {
      return res.status(404).json({
        error: true,
        mensaje: "Orden no encontrada",
      });
    }

    if (ordenExistente.estado !== "pendiente") {
      return res.status(400).json({
        error: true,
        mensaje: "Solo se puede actualizar una orden si su estado es pendiente",
      });
    }

    const datosActualizar = { total, estado, direccion_envio, notas };

    const ordenActualizada = await Orden.findByIdAndUpdate(
      id,
      datosActualizar,
      { new: true },
    );

    res.json({
      error: false,
      mensaje: "Orden actualizada correctamente",
      orden: ordenActualizada,
    });
  } catch (error) {
    next(error);
  }
};

export const anular = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ordenExistente = await Orden.findById(id);
    if (!ordenExistente) {
      return res.status(404).json({
        error: true,
        mensaje: "Orden no encontrada",
      });
    }

    if (ordenExistente.estado !== "pendiente") {
      return res.status(400).json({
        error: true,
        mensaje: "Solo se puede anular una orden si su estado es pendiente",
      });
    }

    const datosActualizar = { estado: "cancelada" };

    const ordenAnulada = await Orden.findByIdAndUpdate(id, datosActualizar, {
      new: true,
    });

    res.json({
      error: false,
      mensaje: "Orden anulada correctamente",
      orden: ordenAnulada,
    });
  } catch (error) {
    next(error);
  }
};
