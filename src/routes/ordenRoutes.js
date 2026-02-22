import express from "express";
import { crear, listar, obtener } from "../controllers/ordenController.js";
import {
  validacionCrearUsuario,
  validacionParametroId,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";

const router = express.Router();


router.get("/");

router.get("/:id");

router.post("/");

export default router;
