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
  validacionesFiltros
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
 *     tags:
 *       - Categorias
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre o descripción de categoría
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           example: "nombre:asc"
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
 *         description: Lista de categorías obtenida exitosamente
 */
router.get(
  "/",
  autenticar,
  validacionesFiltros,
  validarCampos,
  listar
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     tags:
 *       - Categorias
 *     security:
 *       - BearerAuth: []
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
router.get(
  "/:id",
  autenticar,
  validacionParametroId,
  validarCampos,
  obtener
);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crear una nueva categoría (Solo Admin)
 *     tags:
 *       - Categorias
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
 *               descripcion:
 *                 type: string
 *               imagen_icono:
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
router.post(
  "/",
  autenticar,
  requiereRol("admin"),
  subirIconoCategoria,
  validacionCrearCategoria,
  validarCampos,
  crear
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     description: Modifica los datos de una categoría existente. Solo Admin.
 *     tags:
 *       - Categorias
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Laptops"
 *               descripcion:
 *                 type: string
 *                 example: "Equipos portátiles y ultrabooks"
 *               imagen_icono:
 *                 type: string
 *                 example: "https://miapp.com/uploads/categorias/laptop.png"
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       400:
 *         description: Error en validación de datos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Categoría no encontrada
 */
router.put(
  "/:id",
  autenticar,
  requiereRol("admin"),
  validacionParametroId,
  validacionActualizarCategoria,
  validarCampos,
  actualizar
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría (Solo Admin)
 *     tags:
 *       - Categorias
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
 *         description: Categoría eliminada
 */
router.delete(
  "/:id",
  autenticar,
  requiereRol("admin"),
  validacionParametroId,
  validarCampos,
  eliminar
);

export default router;