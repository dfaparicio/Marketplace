import express from "express";
import { registro, login, perfil, forgotPassword, resetPassword } from "../controllers/authController.js";
import {
  validacionCrearUsuario,
  validacionLogin,
  validacionforgotPassword,
  validacionresetPassword
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
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre completo del usuario
 *                 example: "Diego"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico único
 *                 example: "admin@correo.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *                 example: "Api123456789"
 *               rol:
 *                 type: string
 *                 enum: [comprador, vendedor, admin]
 *                 default: comprador
 *                 description: Rol del usuario en el marketplace
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       409:
 *         description: El email ya está registrado
 */
router.post(
  "/registro",
  validacionCrearUsuario,
  validarCampos,
  registro
);

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


/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicita un código de recuperación de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@correo.com
 *     responses:
 *       200:
 *         description: Código de recuperación enviado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor al enviar el correo
 */
router.post(
  '/forgot-password',
  validacionforgotPassword,
  validarCampos,
  forgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablece la contraseña usando el código del correo
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - codigo
 *               - nuevaPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@correo.com
 *               codigo:
 *                 type: string
 *                 example: "123456"
 *               nuevaPassword:
 *                 type: string
 *                 format: password
 *                 example: "NuevaClaveSegura123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Código inválido, expirado o datos incorrectos
 */
router.post(
  '/reset-password',
  validacionresetPassword,
  validarCampos,
  resetPassword
);

export default router;
