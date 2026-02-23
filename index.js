import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import "dotenv/config";
import { specs, swaggerUi, swaggerOptions } from "./src/config/swagger.js";
import { conectarMongo } from "./src/config/database.js";

// Aquí irían tus imports de rutas, por ejemplo:
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import productoRoutes from "./src/routes/productoRoutes.js";
import ordenRoutes from "./src/routes/ordenRoutes.js";
import categoriaRoutes from "./src/routes/categoriaRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a Base de Datos
conectarMongo();


// Middlewares globales
app.use(helmet()); // Protege encabezados HTTP
app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Montamos la interfaz gráfica de Swagger en la ruta /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Middleware para archivos estáticos
app.use("/uploads", express.static(path.resolve("uploads")));

// Rutas
app.get("/", (req, res) => {
  res.json({
    mensaje: "Marketplace Inteligente API",
    version: "1.0.0",
    documentacion: "/api-docs",
  });
});

// app.use("/api/auth", authRoutes); // Ejemplo de uso de rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/ordenes", ordenRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/auth", authRoutes);

// Manejo de rutas no encontradas (404)
// Debe ir ANTES del manejador de errores global
app.use((req, res) => {
  res.status(404).json({
    error: true,
    mensaje: "Endpoint no encontrado",
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  // En producción no queremos mostrar todo el stack de error al cliente
  const mensajeError =
    process.env.NODE_ENV === "production"
      ? "Error interno del servidor"
      : err.message;

  console.error("❌ Error Stack:", err.stack);

  res.status(err.status || 500).json({
    error: true,
    mensaje: mensajeError,
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `📚 Documentación disponible en http://localhost:${PORT}/api-docs`,
  );
});
