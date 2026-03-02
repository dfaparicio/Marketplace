import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import "dotenv/config";
import { specs, swaggerUi, swaggerOptions } from "./src/config/swagger.js";
import { conectarMongo } from "./src/config/database.js";
import { limiterGeneral } from "./src/middlewares/rateLimit.js";



// Rutas
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import productoRoutes from "./src/routes/productoRoutes.js";
import ordenRoutes from "./src/routes/ordenRoutes.js";
import categoriaRoutes from "./src/routes/categoriaRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import iaRoutes from "./src/routes/geminiRoutes.js"
import { log } from "console";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para ver los datos de respuesta en la consola
app.use((req, res, next) => {
  const oldJson = res.json;
  const start = Date.now();

  res.json = function (data) {
    const duration = Date.now() - start;

    const methodColors = {
      GET: "\x1b[36m", // Cyan
      POST: "\x1b[32m", // Green
      PUT: "\x1b[33m", // Yellow
      PATCH: "\x1b[35m", // Magenta
      DELETE: "\x1b[31m", // Red
    };

    const reset = "\x1b[0m";
    const methodColor = methodColors[req.method] || "\x1b[37m";

    console.log(
      "\n\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m",
    );
    console.log(`🕒 ${new Date().toISOString()}`);

    console.log(
      `${methodColor}${req.method}${reset} ${req.originalUrl}  ` +
        `\x1b[34m${res.statusCode}\x1b[0m  ` +
        `⏱ ${duration}ms`,
    );

    console.log("\n📦 Response Body:");
    console.log(JSON.stringify(data, null, 2));

    console.log(
      "\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n",
    );

    return oldJson.call(this, data);
  };

  next();
});

// Conexión a Base de Datos
conectarMongo();

// Middlewares globales
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  }),
);
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

app.use("/api", limiterGeneral);

// Uso de rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/ordenes", ordenRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ia", iaRoutes)

// Manejo de rutas no encontradas (404)
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
  console.log(`🛒 Marketplace Inteligente API 🛒`);
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `📚 Documentación disponible en http://localhost:${PORT}/api-docs`,
  );
});
