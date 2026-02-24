import express from "express";
import { crear, listar, obtener } from "../controllers/ordenController.js";
import {
  validacionCrearOrden,
  validacionParametroId,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ordenes
 *   description: Gestión de órdenes de compra
 */

/**
 * @swagger
 * /api/ordenes:
 *   get:
 *     summary: Listar las órdenes del usuario autenticado
 *     tags: [Ordenes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes obtenida
 */
router.get("/", autenticar, validarCampos, listar);


/**
 * @swagger
 * /api/ordenes/{id}:
 *   get:
 *     summary: Obtener una orden específica por ID
 *     tags: [Ordenes]
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
 *         description: Detalles de la orden
 *       404:
 *         description: Orden no encontrada
 */
router.get("/:id", autenticar, validacionParametroId, validarCampos, obtener);


/**
 * @swagger
 * /api/ordenes:
 *   post:
 *     summary: Crear una nueva orden (Solo Comprador)
 *     tags: [Ordenes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productoId:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 */
router.post(
  "/",
  autenticar,
  requiereRol("comprador"),
  validacionCrearOrden,
  validarCampos,
  crear
);

export default router;
