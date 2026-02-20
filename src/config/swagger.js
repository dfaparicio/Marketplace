import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Marketplace Inteligente API",
      version: "1.0.0",
      description: "API completa para marketplace con integración de IA",
      contact: {
        name: "Equipo de Desarrollo",
        email: "dev@marketplace.com",
      },
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
            id: {
              type: "integer",
              description: "ID único del usuario",
              example: 1,
            },
            nombre: {
              type: "string",
              description: "Nombre completo del usuario",
              example: "Juan Pérez",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email único del usuario",
              example: "juan@ejemplo.com",
            },
            rol: {
              type: "string",
              enum: ["comprador", "vendedor", "admin"],
              description: "Rol del usuario en el sistema",
              example: "comprador",
            },
            fecha_registro: {
              type: "string",
              format: "date-time",
              description: "Fecha de registro del usuario",
            },
          },
        },
        Producto: {
          type: "object",
          required: ["nombre", "precio", "categoria_id"],
          properties: {
            id: {
              type: "integer",
              description: "ID único del producto",
            },
            nombre: {
              type: "string",
              description: "Nombre del producto",
              example: "iPhone 15 Pro",
            },
            descripcion: {
              type: "string",
              description: "Descripción detallada del producto",
            },
            precio: {
              type: "number",
              format: "float",
              description: "Precio del producto",
              example: 999.99,
            },
            stock: {
              type: "integer",
              description: "Cantidad disponible",
              example: 50,
            },
            imagen_url: {
              type: "string",
              description: "URL de la imagen del producto",
            },
            categoria_id: {
              type: "integer",
              description: "ID de la categoría",
            },
            vendedor_id: {
              type: "integer",
              description: "ID del vendedor",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "boolean",
              example: true,
            },
            mensaje: {
              type: "string",
              example: "Mensaje de error descriptivo",
            },
            errores: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  campo: { type: "string" },
                  mensaje: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Rutas donde están las anotaciones Swagger
};
const specs = swaggerJsdoc(options);
const swaggerOptions = {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Marketplace API Docs",
};
module.exports = {
  specs,
  swaggerUi,
  swaggerOptions,
};
