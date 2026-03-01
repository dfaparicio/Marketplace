import express from "express";
import {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar,
} from "../controllers/productoController.js";
import {
  validacionCrearProducto,
  validacionParametroId,
  validacionActualizarProducto,
  validacionesFiltros,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";
import { subirImagenProducto } from "../config/multer.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Listar todos los productos con filtros avanzados
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Buscar en nombre y descripción
 *       - in: query
 *         name: categorias
 *         schema:
 *           type: string
 *         description: IDs de categorías separados por coma
 *       - in: query
 *         name: precio_min
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: precio_max
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           example: "precio:asc,createdAt:desc"
 *         description: Ordenamiento de los productos
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 */
router.get("/", validacionesFiltros, validarCampos, listar);


/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", validacionParametroId, validarCampos, obtener);


/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto (Solo Vendedor)
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - precio
 *               - vendedor_id
 *               - categoria_id
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Laptop Gamer
 *               descripcion:
 *                 type: string
 *                 example: RTX 4060 8GB 16GB RAM
 *               precio:
 *                 type: number
 *                 example: 4500
 *               stock:
 *                 type: integer
 *                 example: 10
 *               vendedor_id:
 *                 type: string
 *                 example: 65f2a9e5a3c123456789abcd
 *               categoria_id:
 *                 type: string
 *                 example: 65f2a9e5a3c123456789abce
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post(
  "/",
  autenticar,
  requiereRol("vendedor"),
  subirImagenProducto,
  validacionCrearProducto,
  validarCampos,
  crear
);


/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto (Solo Vendedor)
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put(
  "/:id",
  autenticar,
  requiereRol("vendedor"),
  validacionParametroId,
  validacionActualizarProducto,
  validarCampos,
  actualizar
);


/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto (Solo Vendedor)
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 */
router.delete(
  "/:id",
  autenticar,
  requiereRol("vendedor"),
  validacionParametroId,
  validarCampos,
  eliminar
);

export default router;
