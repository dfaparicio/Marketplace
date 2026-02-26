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
 *     summary: Listar todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 */
router.get("/", validarCampos, listar);


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
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoria:
 *                 type: string
 *               imagen_url:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado
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
