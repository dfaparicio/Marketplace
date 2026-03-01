import mongoose from "mongoose";

const categorias = new mongoose.Schema(
  {
    nombre: { type: String, requiered: true },
    descripcion: { type: String, requiered: true },
    imagen_icono: { type: String, requiered: false },
  },

  {
    timestamps: {
      createdAt: "fecha_creacion",
      updatedAt: false,
    },
  },
);

export default mongoose.model("Categoria", categorias);
