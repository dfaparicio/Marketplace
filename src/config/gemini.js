import { GoogleGenAI } from '@google/genai';
import Producto from "../models/Producto.js"
import Categoria from "../models/Categoria.js"

const ai = new GoogleGenAI({}); 

// Generar contenido de IA
export const generarContenido = async (prompt, opciones = {}) => {
  try {
    const respuesta = await ai.models.generateContent({

      model: opciones.modelo ?? "gemini-3-flash-preview", 
      contents: prompt,
      config: {
        systemInstruction: "Eres el motor de Inteligencia Artificial de un marketplace profesional. Tu objetivo es dar respuestas concretas, directas y de alto valor comercial. Mantén un tono corporativo, persuasivo y sin rodeos. Sé conciso pero completo, y jamás dejes una oración o idea a medias.",
        
        temperature: opciones.temperatura ?? 0.7, 
        topK: opciones.topK ?? 40,
        topP: opciones.topP ?? 0.95,
        maxOutputTokens: opciones.maxTokens ?? 1024,
      },
    });

    return {
      contenido: respuesta.text,
      metadata: { 
        tokens_utilizados: respuesta.usageMetadata?.totalTokenCount ?? 0 
      },
    };
  } catch (error) {
    console.error("[GenerarContenido] Error interno de Gemini:", error);
  
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    throw new Error(`Error de IA: No se pudo generar el contenido (${mensaje})`);
  }
};

// Generar descripcion del producto
export const generarDescripcionProducto = async (idProducto) => {
  const producto = await Producto.findById(idProducto).populate("categoria_id", "nombre");
  const categoriaNombre = producto.categoria_id ? producto.categoria_id.nombre : "General";

  const prompt = `
    Actúa como un copywriter experto. Genera una descripción atractiva:
    PRODUCTO: ${producto.nombre}
    CATEGORÍA: ${categoriaNombre}
    PRECIO: $${producto.precio}
    STOCK ACTUAL: ${producto.stock} unidades
    DESCRIPCIÓN BASE: ${producto.descripcion}
    
    INSTRUCCIONES: Máximo 200 palabras, estructurado en párrafos cortos, no dejes oraciones a medias.
  `;

  const resultado = await generarContenido(prompt, { temperatura: 0.8, maxTokens: 800 });
  return resultado.contenido.trim();
};

// Sugerir categoria al usuario segun el producto
export const sugerirCategorias = async (nombreproducto, descripcion) => {
  const categoriadb = await Categoria.find().select("nombre");
  const listacategoria = categoriadb.map((cat) => cat.nombre).join(", ");

  const prompt = `
    Sugiere las 3 categorías más apropiadas SOLO de esta lista: [${listacategoria}]
    PRODUCTO: ${nombreproducto}
    DESCRIPCIÓN: ${descripcion}
    
    Responde ÚNICAMENTE con las 3 categorías separadas por comas.
  `;

  const resultado = await generarContenido(prompt, { temperatura: 0.2, maxTokens: 100 });
  return resultado.contenido.trim().split(",").map((c) => c.trim());
};

// Analizar las ordenes de un comprador 
export const analizarPatronCompras = async (ordenesUsuario, usuario) => {
  const resumen = ordenesUsuario.map((orden) => ({
    total: orden.total,
    fecha: orden.fecha_orden,
    productos_comprados: orden.productos?.length || 0,
    estado: orden.estado,
  }));

  const prompt = `
    Analiza este historial del usuario ${usuario.nombre} (Rol: ${usuario.rol}):
    DATOS: ${JSON.stringify(resumen)}
    
    Responde SOLO un JSON con esta estructura exacta:
    {
      "frecuencia": "descripción",
      "promedio_gasto": número,
      "tendencias": "descripción",
      "recomendaciones": ["recomendación1", "recomendación2"]
    }
  `;

  try {
    const resultado = await generarContenido(prompt, { temperatura: 0.5, maxTokens: 1000 });
    const jsonLimpio = resultado.contenido.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonLimpio);
  } catch (error) {
    return { frecuencia: "Error", promedio_gasto: 0, tendencias: "Error", recomendaciones: [] };
  }
};