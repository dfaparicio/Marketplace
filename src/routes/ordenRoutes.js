import express from "express";
import { crear, listar, obtener, actualizar, anular } from "../controllers/ordenController.js";
import {
  validacionCrearOrden,
  validacionParametroId,
  validacionActualizarOrden,
  validacionAnularOrden
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
 *               total:
 *                 type: number
 *               estado:
 *                 type: string
 *               direccion_envio:
 *                 type: string
 *               notas:
 *                 type: string
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
export default router;
