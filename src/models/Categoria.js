import mongoose from "mongoose";

const categorias = new mongoose.Schema(
  {
    nombre: { type: String, requiered: true },
    descripcion: { type: String, requiered: true },
    imagen_icono: { type: String, requiered: true },
  },

  {
    timestamps: {
      createdAt: "fecha_creacion",
      updatedAt: false,
    },
  },
);

export default mongoose.model("Categorias", categorias);
