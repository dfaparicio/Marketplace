import rateLimit from "express-rate-limit";

// Límite General (Para rutas normales como ver productos o categorías)
export const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, 
  message: { 
    error: true, 
    mensaje: "Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos." 
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Límite Estricto (Protección de fuerza bruta para Auth)
export const limiterAuth = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5, 
  message: { 
    error: true, 
    mensaje: "Demasiados intentos fallidos. IP bloqueada temporalmente por seguridad. Intenta en 1 hora." 
  },
});

// Límite para IA 
export const limiterIA = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15, 
  message: { 
    error: true, 
    mensaje: "Has alcanzado el límite de uso de la Inteligencia Artificial por ahora." 
  },
});