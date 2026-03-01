import express from "express";
import {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar,
  cambiarContraseña,
} from "../controllers/usuarioController.js";

import {
  validacionCrearUsuario,
  validacionParametroId,
  validacionActualizarUsuario,
  validacioncambioContraseña,
  validacionesFiltros,
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

/* =====================================================
   1️⃣ RUTAS ESTÁTICAS
===================================================== */

/**
 * @swagger
 * /api/usuarios/update-password:
 *   put:
 *     summary: Cambia la contraseña del usuario autenticado
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passwordActual
 *               - nuevaPassword
 *             properties:
 *               passwordActual:
 *                 type: string
 *                 format: password
 *                 example: MiClaveActual123
 *               nuevaPassword:
 *                 type: string
 *                 format: password
 *                 example: MiNuevaClave456
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       401:
 *         description: No autorizado o contraseña actual incorrecta
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
  "/update-password",
  autenticar,
  validacioncambioContraseña,
  validarCampos,
  cambiarContraseña
);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos los usuarios con filtros y paginación
 *     description: Obtiene todos los usuarios registrados. Requiere rol administrador.
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rol
 *         schema:
 *           type: string
 *           enum: [comprador, vendedor, admin]
 *         description: Filtrar por rol de usuario
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre o email
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           example: "nombre:asc,fecha_registro:desc"
 *         description: Ordenamiento dinámico
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 */
router.get(
  "/",
  autenticar,
  requiereRol("admin"),
  validacionesFiltros,
  validarCampos,
  listar
);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Registro público para compradores o vendedores.
 *     tags:
 *       - Usuarios
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
 *         description: Error en validación de datos
 */
router.post(
  "/",
  validacionCrearUsuario,
  validarCampos,
  crear
);


/* =====================================================
   2️⃣ RUTAS DINÁMICAS
===================================================== */

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     description: Retorna un usuario específico por su ID. Requiere rol administrador.
 *     tags:
 *       - Usuarios
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
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  "/:id",
  autenticar,
  requiereRol("admin"),
  validacionParametroId,
  validarCampos,
  obtener
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario
 *     description: Modifica los datos de un usuario existente. Requiere rol administrador.
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Error en validación
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
  "/:id",
  autenticar,
  requiereRol("admin"),
  validacionParametroId,
  validacionActualizarUsuario,
  validarCampos,
  actualizar
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     description: Elimina un usuario por su ID. Requiere rol administrador.
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
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