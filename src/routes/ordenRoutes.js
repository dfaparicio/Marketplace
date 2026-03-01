import express from "express";
import { crear, listar, obtener, actualizar, anular } from "../controllers/ordenController.js";
import {
  validacionCrearOrden,
  validacionParametroId,
  validacionActualizarOrden,
  validacionAnularOrden,
  validacionesFiltros
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Ordenes
 *     description: Gestión de órdenes de compra
 */

/**
 * @swagger
 * /api/ordenes:
 *   get:
 *     summary: Listar las órdenes del usuario autenticado
 *     tags:
 *       - Ordenes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, confirmada, enviada, entregada, cancelada]
 *         description: Filtrar órdenes por estado
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           example: "fecha_orden:desc,total:asc"
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
 *         description: Lista de órdenes obtenida
 */
router.get("/", autenticar, validacionesFiltros, validarCampos, listar);

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
 *             required:
 *               - productos
 *               - total
 *             properties:
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - producto_id
 *                     - cantidad
 *                     - precio_unitario
 *                     - subtotal
 *                   properties:
 *                     producto_id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109cb"
 *                     cantidad:
 *                       type: number
 *                       example: 2
 *                     precio_unitario:
 *                       type: number
 *                       example: 50.50
 *                     subtotal:
 *                       type: number
 *                       example: 101.00
 *               total:
 *                 type: number
 *                 example: 101.00
 *               direccion_envio:
 *                 type: string
 *                 example: "Calle Principal 123, Ciudad"
 *               notas:
 *                 type: string
 *                 example: "Dejar en recepción"
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post(
  "/",
  autenticar,
  requiereRol("comprador"),
  validacionCrearOrden,
  validarCampos,
  crear
);

/**
 * @swagger
 * /api/ordenes/anular/{id}:
 *   patch:
 *     summary: Anular una orden (Solo si está pendiente)
 *     tags: [Ordenes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden a anular
 *     responses:
 *       200:
 *         description: Orden anulada correctamente
 *       400:
 *         description: La orden no se puede anular porque ya no está en estado pendiente
 *       404:
 *         description: Orden no encontrada
 */
router.patch(
  "/anular/:id",
  autenticar,
  validacionAnularOrden,
  validarCampos,
  anular
);

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
 * /api/ordenes/{id}:
 *   put:
 *     summary: Actualizar una orden (Solo si está pendiente)
 *     tags: [Ordenes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "confirmada"
 *               direccion_envio:
 *                 type: string
 *                 example: "Nueva Calle 456"
 *               notas:
 *                 type: string
 *                 example: "Timbrar dos veces"
 *     responses:
 *       200:
 *         description: Orden actualizada correctamente
 *       400:
 *         description: Error de validación o la orden no está en estado pendiente
 *       404:
 *         description: Orden no encontrada
 */
router.put(
  "/:id",
  autenticar,
  validacionActualizarOrden,
  validarCampos,
  actualizar
);


export default router