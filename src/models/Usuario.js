import mongoose from "mongoose";

const usuario = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    rol: {
      type: String,
      required: true,
      default: "comprador",
      enum: ["comprador", "vendedor", "admin"],
      index: true,
    },
    resetPasswordCode: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "fecha_registro",
      updatedAt: "fecha_actualizacion",
    },
  },
);

export default mongoose.model("Usuario", usuario);
