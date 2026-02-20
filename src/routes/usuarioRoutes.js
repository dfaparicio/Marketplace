import express from "express";
import { crear, listar, obtener } from "../controllers/usuarioController.js";
import {
  validacionCrearUsuario,
  validacionParametroId,
} from "../middlewares/validaciones.js";

const router = express.Router();

// GET /api/usuarios - Listar usuarios
router.get("/", listar);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get("/:id", validacionParametroId, obtener);

// POST /api/usuarios - Crear usuario
router.post("/", validacionCrearUsuario, crear);

export default router;