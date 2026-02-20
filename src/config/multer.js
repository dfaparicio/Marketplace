import multer from "multer";
import path from "path";
import fs from "fs";

// Configuración Inicial

const crearDirectorios = () => {
  const directorios = ["uploads", "uploads/productos", "uploads/usuarios"];
  directorios.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Creamos los directorios al cargar el módulo
crearDirectorios();

// Configuración de Almacenamiento

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let carpeta = "uploads/productos";
    if (file.fieldname === "avatar_usuario") {
      carpeta = "uploads/usuarios";
    }
    cb(null, carpeta);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);

    const nombreUnico = `${timestamp}-${random}${extension}`;
    cb(null, nombreUnico);
  },
});

// Filtro de Archivos

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de archivo no permitido. Solo se aceptan: JPG, PNG, WEBP",
      ),
      false,
    );
  }
};

// Instancia de Multer

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,
  },
});

// Exports Nombrados
export const subirImagenProducto = upload.single("imagen_producto");
export const subirAvatarUsuario = upload.single("avatar_usuario");
// Si necesitas subir múltiples imágenes de un producto en el futuro:
export const subirGaleriaProducto = upload.array("imagenes_producto", 5);
