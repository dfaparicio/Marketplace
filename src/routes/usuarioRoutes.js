import express from "express";
import {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar,
} from "../controllers/usuarioController.js";
import {
  validacionCrearUsuario,
  validacionParametroId,
  validacionActualizarUsuario,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Gestión de usuarios del marketplace
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos los usuarios
 *     description: Obtiene una lista de todos los usuarios registrados. Requiere autenticación y rol de administrador.
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 *       403:
 *         description: Prohibido (No tiene rol de admin)
 */
// GET /api/usuarios - Listar usuarios
router.get("/", autenticar, requiereRol("admin"), validarCampos, listar);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     description: Busca y retorna los datos de un usuario específico usando su ID de MongoDB. Requiere rol de administrador.
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de Mongoose del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
// GET /api/usuarios/:id - Obtener usuario por ID
router.get(
  "/:id",
  autenticar,
  requiereRol("admin"),
  validacionParametroId,
  validarCampos,
  obtener,
);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Registro público para nuevos usuarios (compradores o vendedores). No requiere autenticación.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en la validación de los campos enviados
 */
// POST /api/usuarios - Crear usuario 
router.post("/", validacionCrearUsuario, validarCampos, crear);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario
 *     description: Modifica los datos de un usuario existente. Requiere autenticación y rol de administrador.
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error en la validación de los campos
 *       404:
 *         description: Usuario no encontrado
 */
// PUT /api/usuarios/:id - Actualizar usuario
router.put(
  "/:id",
  autenticar,
  requiereRol("admin"),
  validacionParametroId,
  validacionActualizarUsuario,
  validarCampos,
  actualizar,
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     description: Borra un usuario de la base de datos por su ID. Requiere autenticación y rol de administrador.
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
// DELETE /api/usuarios/:id - Eliminar usuario
router.delete(
  "/:id",
  autenticar,
  requiereRol("admin"),
  validacionParametroId,
  validarCampos,
  eliminar,
);

export default router;
