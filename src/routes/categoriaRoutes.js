import express from "express";
import {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar,
} from "../controllers/categoriaController.js";
import {
  validacionCrearCategoria,
  validacionParametroId,
  validacionActualizarCategoria,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";
import { subirIconoCategoria } from "../config/multer.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Gestión de categorías de productos
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 */
// GET /api/categorias - Listar categorías (Público)
router.get("/", validarCampos, listar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
// GET /api/categorias/:id - Obtener categoría por ID (Público)
router.get("/:id", validacionParametroId, validarCampos, obtener);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crear una nueva categoría (Solo Admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               icono:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido (No es admin)
 */
// POST /api/categorias - Crear categoría (Solo Admin)
router.post(
  "/",
  autenticar,
  requiereRol("admin"),
  validacionCrearCategoria,
  subirIconoCategoria,
  validarCampos,
  crear,
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría (Solo Admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Categoría actualizada
 */
// PUT /api/categorias/:id - Actualizar categoría
router.put(
  "/:id",
  autenticar,
  requiereRol("admin"),
  validacionParametroId,
  validacionActualizarCategoria,
  validarCampos,
  actualizar,
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría (Solo Admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada
 */
// DELETE /api/categorias/:id - Eliminar categoría
router.delete(
  "/:id",
  autenticar,
  requiereRol("admin"),
  validacionParametroId,
  validarCampos,
  eliminar,
);

export default router;
