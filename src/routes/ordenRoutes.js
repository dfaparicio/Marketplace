import express from "express";
import { crear, listar, obtener } from "../controllers/ordenController.js";
import {
  validacionCrearOrden, 
  validacionParametroId,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";

const router = express.Router();

// GET /api/ordenes - Listar órdenes del usuario autenticado
router.get("/", autenticar, validarCampos, listar);

// GET /api/ordenes/:id - Obtener una orden específica
router.get("/:id", autenticar, validacionParametroId, validarCampos, obtener);

// POST /api/ordenes - Crear una orden (Solo Compradores)
router.post(
  "/",
  autenticar,
  requiereRol("comprador"),
  validacionCrearOrden,
  validarCampos,
  crear,
);

export default router;
