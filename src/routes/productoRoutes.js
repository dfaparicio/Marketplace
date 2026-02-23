import express from "express";
import { crear, listar, obtener } from "../controllers/productoController.js";
import {
  validacionCrearProducto,
  validacionParametroId,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";

const router = express.Router();

// GET /api/productos - Listar productos (Público)
router.get("/", validarCampos, listar);

// GET /api/productos/:id - Obtener producto por ID (Público)
router.get("/:id", validacionParametroId, validarCampos, obtener);

// POST /api/productos - Crear producto (Solo Vendedores)
router.post(
  "/",
  autenticar,
  requiereRol("vendedor"),
  validacionCrearProducto,
  validarCampos,
  crear,
);

export default router;



// CRUD COMPLETO 