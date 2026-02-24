import express from "express";
import { registro, login, perfil } from "../controllers/authController.js";
import {
  validacionCrearUsuario,
  validacionLogin,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y gestión de usuarios
 */

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la validación de datos
 */
// POST /api/auth/registro - Registrar nuevo usuario (Público)
router.post("/registro", validacionCrearUsuario, validarCampos, registro);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token JWT
 *       401:
 *         description: Credenciales incorrectas
 */
// POST /api/auth/login - Iniciar sesión (Público)
router.post("/login", validacionLogin, validarCampos, login);

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil del usuario
 *       401:
 *         description: No autorizado, token faltante o inválido
 */
// GET /api/auth/perfil - Ver el perfil del usuario (Requiere token)
router.get("/perfil", autenticar, validarCampos, perfil);

export default router;
