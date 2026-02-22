import mongoose from "mongoose";
import Usuario from "./Usuario";

const orden = new mongoose.Schema(
  {
    comprador_id: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      index: true,
    },
    total: { type: Number, required: true },
    estado: {
      type: String,
      default: "pendiente",
      enum: ["pendiente", "confirmada", "enviada", "entregada", "cancelada"],
    },
    direccion_envio: { type: String },
    notas: { type: String },
  },
  {
    timestamps: {
      createdAt: "fecha_orden",
      updatedAt: false,
    },
  },
);

export default mongoose.model("Orden", orden);
