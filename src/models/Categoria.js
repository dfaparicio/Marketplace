import mongoose from "mongoose";

const categorias = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagen_icono: { type: String, required: false },
  },

  {
    timestamps: {
      createdAt: "fecha_creacion",
      updatedAt: false,
    },
  },
);

export default mongoose.model("Categoria", categorias);
