import multer from "multer";
import path from "path";
import fs from "fs";

// Configuración Inicial
const crearDirectorios = () => {
  // Solo directorios para productos y categorías
  const directorios = ["uploads", "uploads/productos", "uploads/categorias"];
  directorios.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

crearDirectorios();

// Configuración de Almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let carpeta = "uploads/productos"; // Por defecto a productos

    // Si el campo se llama imagen_icono, va a categorías
    if (file.fieldname === "imagen_icono") {
      carpeta = "uploads/categorias";
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

// Exports Nombrados para usar en las rutas
export const subirImagenProducto = upload.single("imagen_url");


// export const subirIconoCategoria = upload.single("imagen_icono");
export const subirIconoCategoria = upload.any();
