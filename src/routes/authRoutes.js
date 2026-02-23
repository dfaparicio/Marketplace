import express from "express";
import { registro, login, perfil } from "../controllers/authController.js";
import {
  validacionCrearUsuario,
  validacionLogin,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/auth/registro - Registrar nuevo usuario (Público)
router.post("/registro", validacionCrearUsuario, validarCampos, registro);

// POST /api/auth/login - Iniciar sesión (Público)
router.post("/login", validacionLogin, validarCampos, login);

// GET /api/auth/perfil - Ver el perfil del usuario (Requiere token)
router.get("/perfil", autenticar, validarCampos, perfil);

export default router;
