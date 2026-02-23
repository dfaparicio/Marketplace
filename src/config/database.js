import mongoose from "mongoose";

mongoose.set('debug', true);

async function conectarMongo() {
  if (mongoose.connection.readyState === 1) {
    console.log("⏭️ MongoDB ya estaba conectado");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Base de Datos conectada correctamente");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    throw error;
  }
}

export { conectarMongo };
