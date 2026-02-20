import mongoose from "mongoose";

const usuario = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    required: true,
    default: "COMPRADOR",
    enum: ["COMPRADOR", "VENDEDOR", "ADMIN"],
  },
  timestamps: {
    createdAt: "fecha_registro",
    updateAt: false,
  },
});

export default mongoose.model("Usuario", usuario);
