import express from "express";
import { crear, listar, obtener } from "../controllers/usuarioController.js";
import {
  validacionCrearUsuario,
  validacionParametroId,
} from "../middlewares/validaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", autenticar, requiereRol("admin"), validarCampos, listar);

router.get(
  "/:id",
  autenticar,
  requiereRol("admin"),
  validacionParametroId,
  validarCampos,
  obtener,
);

router.post("/", validacionCrearUsuario, validarCampos, crear);

export default router;
