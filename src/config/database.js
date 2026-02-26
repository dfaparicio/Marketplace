import mongoose from "mongoose";

mongoose.set('debug', (collectionName, method, query, doc) => {
  console.log(`\x1b[36m%s\x1b[0m`, `\n===== MONGOOSE DEBUG =====`);
  console.log(`📂 Colección: ${collectionName}`);
  console.log(`🔧 Método: ${method}`);
  console.log(`🔍 Query:`, JSON.stringify(query, null, 2));
  console.log(`\x1b[36m%s\x1b[0m`, `==========================\n`);
});

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
