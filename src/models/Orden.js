import mongoose, { Schema } from "mongoose";

const orden = new mongoose.Schema(
  {
    comprador_id: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      index: true,
    },
    productos: [
      {
        producto_id: {
          type: Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
          index: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },
        precio_unitario: {
          type: Number,
          required: true,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    estado: {
      type: String,
      default: "pendiente",
      enum: ["pendiente", "confirmada", "enviada", "entregada", "cancelada"],
      index: true,
    },
    direccion_envio: {
      type: String,
    },
    notas: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "fecha_orden",
      updatedAt: false,
    },
  },
);

orden.index({ fecha_orden: -1 });

export default mongoose.model("Orden", orden);
