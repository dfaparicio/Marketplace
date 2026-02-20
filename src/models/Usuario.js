import mongoose from "mongoose";

const usuario = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, unique: true, required: true, unique: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    required: true,
    default: "comprador",
    enum: ["comprador", "vendedor", "admin"],
    index: true,
  },
  timestamps: {
    createdAt: "fecha_registro",
    updatedAt: false,
  },
});

export default mongoose.model("Usuario", usuario);
