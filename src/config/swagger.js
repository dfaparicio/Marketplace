import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Marketplace Inteligente API",
      version: "1.0.0",
      description: "API completa para marketplace con integración de IA",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Usuario: {
          type: "object",
          required: ["nombre", "email", "password"],
          properties: {
            _id: {
              type: "string",
              description: "ID autogenerado por MongoDB",
              example: "60d0fe4f5311236168a109ca",
            },
            nombre: { type: "string", example: "Juan Pérez" },
            email: {
              type: "string",
              format: "email",
              example: "juan@ejemplo.com",
            },
            password: {
              type: "string",
              description: "Contraseña encriptada",
              example: "********",
            },
            rol: {
              type: "string",
              enum: ["comprador", "vendedor", "admin"],
              default: "comprador",
            },
            fecha_registro: { type: "string", format: "date-time" },
          },
        },
        Producto: {
          type: "object",
          required: [
            "nombre",
            "descripcion",
            "precio",
            "imagen_url",
            "vendedor_id",
            "categoria_id",
          ],
          properties: {
            _id: { type: "string", example: "60d0fe4f5311236168a109cb" },
            nombre: { type: "string", example: "Laptop Gamer" },
            descripcion: {
              type: "string",
              example: "Laptop de alto rendimiento...",
            },
            precio: { type: "number", example: 1500.5 },
            stock: { type: "number", default: 0, example: 10 },
            imagen_url: {
              type: "string",
              example: "https://ejemplo.com/imagen.jpg",
            },
            vendedor_id: {
              type: "string",
              description: "ID del Usuario vendedor",
            },
            categoria_id: { type: "string", description: "ID de la Categoría" },
            fecha_creacion: { type: "string", format: "date-time" },
          },
        },
        Orden: {
          type: "object",
          required: ["comprador_id", "total"],
          properties: {
            _id: { type: "string", example: "60d0fe4f5311236168a109cc" },
            comprador_id: {
              type: "string",
              description: "ID del Usuario comprador",
            },
            total: { type: "number", example: 250.99 },
            estado: {
              type: "string",
              enum: [
                "pendiente",
                "confirmada",
                "enviada",
                "entregada",
                "cancelada",
              ],
              default: "pendiente",
            },
            direccion_envio: { type: "string", example: "Calle Falsa 123" },
            notas: { type: "string", example: "Dejar en portería" },
            fecha_orden: { type: "string", format: "date-time" },
          },
        },
        Categoria: {
          type: "object",
          required: ["nombre", "descripcion", "imagen_icono"],
          properties: {
            _id: { type: "string", example: "60d0fe4f5311236168a109cd" },
            nombre: { type: "string", example: "Tecnología" },
            descripcion: {
              type: "string",
              example: "Artículos electrónicos y gadgets",
            },
            imagen_icono: {
              type: "string",
              example: "https://ejemplo.com/icono_tec.jpg",
            },
            fecha_creacion: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Asegúrate de que esta ruta coincida con tu estructura
};

export const swaggerOptions = {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Marketplace API Docs",
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
