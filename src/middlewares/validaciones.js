import { body, param } from "express-validator";

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

  body("imagen_url")
    .trim()
    .notEmpty()
    .withMessage("La URL de la imagen es obligatoria"),

  body("vendedor_id")
    .isMongoId()
    .withMessage("El ID del vendedor no es un formato válido de MongoDB"),

  body("categoria_id")
    .isMongoId()
    .withMessage("El ID de la categoría no es un formato válido de MongoDB"),
];

export const validacionCrearOrden = [
  body("comprador_id")
    .isMongoId()
    .withMessage("El ID del comprador no es un formato válido de MongoDB"),

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
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria"),

  body("imagen_icono")
    .trim()
    .notEmpty()
    .withMessage("El ícono/imagen es obligatorio"),
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

  body("imagen_url")
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
