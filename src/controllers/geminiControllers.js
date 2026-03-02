import {
  generarDescripcionProducto,
  sugerirCategorias,
  analizarPatronCompras,
  generarContenido,
} from "../config/gemini.js"; 

import Producto from "../models/Producto.js";
import Orden from "../models/Orden.js";
import Usuario from "../models/Usuario.js";

// Generar descripcion del producto
export const generarDescripcion = async (req, res, next) => {
  try {
    const { idProducto } = req.body;
    if (!idProducto) return res.status(400).json({ error: true, mensaje: "idProducto requerido." });

    const existeProducto = await Producto.exists({ _id: idProducto });
    if (!existeProducto) return res.status(404).json({ error: true, mensaje: "Producto no existe." });

    const descripcion = await generarDescripcionProducto(idProducto);
    res.json({ error: false, descripcion });
  } catch (error) {
    next(error);
  }
};

// Sugerir categoria al usuario segun el producto
export const sugerirCat = async (req, res, next) => {
  try {
    const { nombreProducto, descripcion } = req.body;
    if (!nombreProducto || !descripcion) {
      return res.status(400).json({ error: true, mensaje: "Nombre y descripción son obligatorios." });
    }

    const sugerencias = await sugerirCategorias(nombreProducto, descripcion);
    res.status(200).json({ error: false, sugerencias });
  } catch (error) {
    next(error);
  }
};

// Analizar las ordenes de un comprador 
export const analizarCompras = async (req, res, next) => {
  try {
    const { id } = req.params; 

    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ error: true, mensaje: "Usuario no encontrado." });

    const ordenesUsuario = await Orden.find({ comprador_id: id });
    if (!ordenesUsuario.length) {
      return res.status(404).json({ error: true, mensaje: "El usuario no tiene órdenes." });
    }

    const analisis = await analizarPatronCompras(ordenesUsuario, usuario);
    res.status(200).json({ error: false, analisis });
  } catch (error) {
    next(error);
  }
};

// Generar contenido de IA, chat 
export const responderPregunta = async (req, res, next) => {
  try {
    const { pregunta } = req.body;
    if (!pregunta) return res.status(400).json({ error: true, mensaje: "La pregunta es obligatoria." });

    const promptContextual = `
      Eres el asistente virtual de un marketplace. Responde a la siguiente pregunta: ${pregunta}
    `;

    const respuesta = await generarContenido(promptContextual, { temperatura: 0.5, maxTokens: 250 });
    res.status(200).json({ error: false, respuesta: respuesta.contenido.trim() });
  } catch (error) {
    next(error);
  }
};