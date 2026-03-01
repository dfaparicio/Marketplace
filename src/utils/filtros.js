// src/utils/filtros.js

// 1. Parsea listas separadas por comas (se queda igual)
export const parsearLista = (valor, tipo = "string") => {
  if (!valor) return null;
  const lista = valor
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  switch (tipo) {
    case "int":
      return lista.map((item) => parseInt(item)).filter((num) => !isNaN(num));
    case "float":
      return lista.map((item) => parseFloat(item)).filter((num) => !isNaN(num));
    default:
      return lista; // Para ObjectIds de Mongo, usamos string, Mongoose lo convierte solo
  }
};

// 2. Parsea el ordenamiento (Convertido a formato Mongo: { campo: 1 o -1 })
export const parsearOrdenamiento = (orden) => {
  if (!orden) return { createdAt: -1 }; // Por defecto: más recientes primero

  const sortQuery = {};
  orden.split(",").forEach((item) => {
    const [campo, direccion = "desc"] = item.trim().split(":");
    // Normalizamos "id" a "_id" para Mongo
    const campoMongo =
      campo.toLowerCase() === "id" ? "_id" : campo.toLowerCase();
    sortQuery[campoMongo] = direccion.toLowerCase() === "asc" ? 1 : -1;
  });

  return sortQuery;
};

// 3. Construye el objeto Query de MongoDB dinámicamente
// "camposRegex" es un array con los campos donde queremos que busque si envían "q"
export const construirFiltrosMongo = (filtros, camposRegex = []) => {
  const query = {};

  // Filtro de Categorías ($in)
  if (filtros.categorias && filtros.categorias.length > 0) {
    query.categoria_id = { $in: filtros.categorias };
  }

  // Filtro de Rol o Estado (Match exacto)
  if (filtros.rol) query.rol = filtros.rol;
  if (filtros.estado) query.estado = filtros.estado;
  if (filtros.vendedor_id) query.vendedor_id = filtros.vendedor_id;
  if (filtros.comprador_id) query.comprador_id = filtros.comprador_id;

  // Filtro de Precio ($gte y $lte)
  if (filtros.precio) {
    query.precio = {};
    if (filtros.precio.min !== undefined)
      query.precio.$gte = filtros.precio.min;
    if (filtros.precio.max !== undefined)
      query.precio.$lte = filtros.precio.max;
    if (Object.keys(query.precio).length === 0) delete query.precio;
  }

  // Filtro de Búsqueda General ($or + $regex)
  if (filtros.busqueda && camposRegex.length > 0) {
    query.$or = camposRegex.map((campo) => ({
      [campo]: { $regex: filtros.busqueda, $options: "i" }, // "i" = case-insensitive
    }));
  }

  return query;
};
