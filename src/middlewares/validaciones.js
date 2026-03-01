import { body, param, query } from "express-validator";

export const validacionParametroId = [
  param("id")
    .isMongoId()
    .withMessage("El ID proporcionado no es un ID de MongoDB válido"),
];

export const validacionCrearUsuario = [
  body("nombre")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),

  body("email").trim().isEmail().withMessage("Email inválido").normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una minúscula, una mayúscula y un número",
    ),

  body("rol")
    .optional()
    .isIn(["comprador", "vendedor", "admin"])
    .withMessage("Rol inválido"),
];

export const validacionLogin = [
  body("email").trim().isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

export const validacionCrearProducto = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isLength({ max: 150 })
    .withMessage("El nombre es demasiado largo"),

  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria"),

  body("precio")
    .isNumeric()
    .withMessage("El precio debe ser un número válido")
    .isFloat({ min: 0 })
    .withMessage("El precio no puede ser negativo"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero positivo o cero"),

  body().custom((_, { req }) => {
    if (!req.file) {
      throw new Error("El ícono/imagen es obligatorio");
    }
    return true;
  }),

  body("vendedor_id")
    .isMongoId()
    .withMessage("El ID del vendedor no es un formato válido de MongoDB"),

  body("categoria_id")
    .isMongoId()
    .withMessage("El ID de la categoría no es un formato válido de MongoDB"),
];

export const validacionCrearOrden = [
  body("productos")
    .isArray({ min: 1 })
    .withMessage("La orden debe incluir al menos un producto"),

  body("productos.*.producto_id")
    .isMongoId()
    .withMessage("El ID del producto no es un formato válido"),

  body("productos.*.cantidad")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero mayor a 0"),

  body("productos.*.precio_unitario")
    .isNumeric()
    .withMessage("El precio unitario debe ser numérico"),

  body("productos.*.subtotal")
    .isNumeric()
    .withMessage("El subtotal debe ser numérico"),

  body("total")
    .isNumeric()
    .withMessage("El total debe ser un número")
    .isFloat({ min: 0 })
    .withMessage("El total no puede ser negativo"),

  body("estado")
    .optional()
    .isIn(["pendiente", "confirmada", "enviada", "entregada", "cancelada"])
    .withMessage("Estado de orden no válido"),

  body("direccion_envio")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("La dirección de envío debe ser más específica"),

  body("notas").optional().trim(),
];

export const validacionCrearCategoria = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  body().custom((_, { req }) => {
    if (!req.file) {
      throw new Error("El ícono/imagen es obligatorio");
    }
    return true;
  }),
];

export const validacionActualizarUsuario = [
  body("nombre", "El nombre no puede estar vacío").optional().not().isEmpty(),

  body("email", "El email debe tener un formato válido").optional().isEmail(),

  body("password", "El password debe tener al menos 6 caracteres")
    .optional()
    .isLength({ min: 6 }),

  body("rol", "El rol no es válido")
    .optional()
    .isIn(["admin", "comprador", "vendedor"]),
];

export const validacionActualizarProducto = [
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isString()
    .withMessage("El nombre debe ser un texto"),

  body("descripcion")
    .optional()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .isString()
    .withMessage("La descripción debe ser un texto"),

  body("precio")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero y no puede ser negativo"),

  body("imagen")
    .optional()
    .isURL()
    .withMessage("La imagen debe ser una URL válida"),
];

export const validacionActualizarCategoria = [
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isString()
    .withMessage("El nombre debe ser un texto"),

  body("descripcion")
    .optional()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .isString()
    .withMessage("La descripción debe ser un texto"),

  body("imagen_icono")
    .optional()
    .isString()
    .withMessage("El icono debe ser un texto o ruta válida"),
];

export const validacionActualizarOrden = [
  param("id").isMongoId().withMessage("El ID de la orden no es válido"),

  body("total")
    .optional()
    .isNumeric()
    .withMessage("El total debe ser un número válido"),

  body("estado")
    .optional()
    .notEmpty()
    .withMessage("El estado no puede estar vacío")
    .isIn(["pendiente", "confirmada", "enviada", "entregada", "cancelada"])
    .withMessage("Estado de orden no válido"),

  body("direccion_envio")
    .optional()
    .notEmpty()
    .withMessage("La dirección de envío no puede estar vacía")
    .isString()
    .withMessage("La dirección de envío debe ser un texto"),

  body("notas")
    .optional()
    .isString()
    .withMessage("Las notas deben ser un texto"),
];

export const validacionAnularOrden = [
  param("id").isMongoId().withMessage("El ID de la orden no es válido"),
];

export const validacionforgotPassword = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe ser un email válido"),
];

export const validacionresetPassword = [
  body("email")
    .isEmail()
    .withMessage("El email es obligatorio y debe ser válido"),
  body("codigo")
    .not()
    .isEmpty()
    .withMessage("El código de recuperación es obligatorio")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código debe tener exactamente 6 caracteres")
    .isNumeric()
    .withMessage("El código debe ser solo números"),
  body("nuevaPassword")
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
];

export const validacioncambioContraseña = [
  body("passwordActual")
    .not()
    .isEmpty()
    .withMessage("La contraseña actual es obligatoria"),
  body("nuevaPassword")
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
];

export const validacionesFiltros = [
  query("pagina")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número mayor a 0")
    .toInt(),
  query("limite")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser entre 1 y 100")
    .toInt(),

  query("q").optional().trim().escape(),

  query("precio_min")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio mínimo no puede ser negativo")
    .toFloat(),
  query("precio_max")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio máximo no puede ser negativo")
    .custom((value, { req }) => {
      if (req.query.precio_min && value < req.query.precio_min) {
        throw new Error("El precio máximo debe ser mayor al mínimo");
      }
      return true;
    })
    .toFloat(),

  query("rol")
    .optional()
    .isIn(["comprador", "vendedor", "admin"])
    .withMessage("Rol no válido"),
];
