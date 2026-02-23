import express from "express";
import { crear, listar, obtener } from "../controllers/categoriaController.js";
import {
  validacionCrearCategoria,
  validacionParametroId,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";

const router = express.Router();

// GET /api/categorias - Listar categorías (Público)
router.get("/", validarCampos, listar);

// GET /api/categorias/:id - Obtener categoría por ID (Público)
router.get("/:id", validacionParametroId, validarCampos, obtener);

// POST /api/categorias - Crear categoría (Solo Admin)
router.post(
  "/",
  autenticar,
  requiereRol("admin"),
  validacionCrearCategoria,
  validarCampos,
  crear
);

export default router;



// CRUD COMPLETO 