import rateLimit from "express-rate-limit";

// 1. Límite General (Para rutas normales como ver productos o categorías)
export const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por IP en esos 15 minutos
  message: { 
    error: true, 
    mensaje: "Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos." 
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// 2. Límite Estricto (Protección de fuerza bruta para Auth)
export const limiterAuth = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora de bloqueo
  max: 5, // Solo 5 intentos por hora por IP
  message: { 
    error: true, 
    mensaje: "Demasiados intentos fallidos. IP bloqueada temporalmente por seguridad. Intenta en 1 hora." 
  },
});

// 3. Límite para IA (Para proteger tus cuotas de Gemini)
export const limiterIA = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 15, // Máximo 15 peticiones a la IA por hora por IP
  message: { 
    error: true, 
    mensaje: "Has alcanzado el límite de uso de la Inteligencia Artificial por ahora." 
  },
});