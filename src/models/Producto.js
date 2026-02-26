import mongoose, { Schema } from "mongoose";

const producto = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true, index: true },
    stock: { type: Number, default: 0 },
    imagen: { type: String, required: false },
    vendedor_id: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      index: true,
    },
    categoria_id: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
      index: true,
    }
  },
  {
    timestamps: {
      createdAt: "fecha_creacion",
      updatedAt: false,
    },
  },
);

export default mongoose.model("Producto", producto);
