import express from "express";
import {
  generarDescripcion,
  sugerirCat,
  analizarCompras, 
  responderPregunta,
} from "../controllers/geminiControllers.js";

import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";
import {
  validacionGenerarDescripcion,
  validacionSugerirCategorias,
  validacionChat,
  validacionParametroId,
} from "../middlewares/validaciones.js";
import { limiterIA } from "../middlewares/rateLimit.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Inteligencia Artificial
 *     description: Funcionalidades de IA con Gemini
 */

/**
 * @swagger
 * /api/ia/descripcion:
 *   post:
 *     summary: Genera una descripción de producto con Gemini
 *     tags:
 *       - Inteligencia Artificial
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProducto
 *             properties:
 *               idProducto:
 *                 type: string
 *                 description: ID del producto en MongoDB
 *                 example: "65d3a2b1c9f8e7d6a5b4c3d2"
 *     responses:
 *       200:
 *         description: Descripción generada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       404:
 *         description: Producto no encontrado
 *       429:
 *         description: Demasiadas solicitudes, intenta más tarde
 */
router.post(
  "/descripcion",
  autenticar,
  limiterIA,
  requiereRol(["vendedor", "admin"]),
  validacionGenerarDescripcion,
  validarCampos,
  generarDescripcion,
);

/**
 * @swagger
 * /api/ia/sugerir:
 *   post:
 *     summary: Sugiere categorías basadas en el producto
 *     tags:
 *       - Inteligencia Artificial
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreProducto
 *               - descripcion
 *             properties:
 *               nombreProducto:
 *                 type: string
 *                 example: "Monitor AOC 27G51F"
 *               descripcion:
 *                 type: string
 *                 example: "Monitor gaming de 27 pulgadas, 165Hz, panel VA, 1ms de respuesta."
 *     responses:
 *       200:
 *         description: Categorías sugeridas exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 */
router.post(
  "/sugerir",
  autenticar,
  requiereRol(["vendedor", "admin"]),
  validacionSugerirCategorias,
  validarCampos,
  sugerirCat,
);

/**
 * @swagger
 * /api/ia/analizar/{id}:
 *   get:
 *     summary: Analiza el patrón de compras de un usuario
 *     tags:
 *       - Inteligencia Artificial
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario en MongoDB
 *     responses:
 *       200:
 *         description: Análisis generado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  "/analizar/:id",
  autenticar,
  requiereRol(["comprador", "admin"]),
  validacionParametroId,
  validarCampos,
  analizarCompras,
);

/**
 * @swagger
 * /api/ia/chat:
 *   post:
 *     summary: Chatbot de soporte del marketplace
 *     tags:
 *       - Inteligencia Artificial
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pregunta
 *             properties:
 *               pregunta:
 *                 type: string
 *                 example: "¿Cuáles son los métodos de pago aceptados?"
 *     responses:
 *       200:
 *         description: Respuesta generada exitosamente
 *       401:
 *         description: No autorizado
 *       429:
 *         description: Demasiadas solicitudes, intenta más tarde
 */
router.post(
  "/chat",
  autenticar,
  limiterIA,
  validacionChat,
  validarCampos,
  responderPregunta,
);

export default router;
