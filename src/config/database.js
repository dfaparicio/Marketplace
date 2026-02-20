import mongoose from "mongoose";

export default async function conectarMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Base de Datos conectada correctamente");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
}

// Función para probar conexión manualmente (opcional)
const testConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB ya está conectado");
  } else {
    console.log("MongoDB no está conectado");
  }
};

export { conectarMongo, testConnection };
