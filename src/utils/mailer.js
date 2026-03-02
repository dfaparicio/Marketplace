import nodemailer from "nodemailer";

// Configuracion del correo para los envios de codigos
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


export const correoRecuperacion = async (correo, codigo) => {
  try {
    const mailOptions = {
      from: `"Soporte Marketplace" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Código de Recuperación de Contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4A90E2;">Recuperación de Contraseña</h2>
          <p>Hola,</p>
          <p>Has solicitado restablecer tu contraseña en nuestro Marketplace. Usa el siguiente código para continuar con el proceso:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${codigo}</span>
          </div>
          <p><em>Este código expirará en 1 hora.</em></p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente:", info.messageId);
    return true; 
  } catch (error) {
    console.error("Error al enviar el correo de recuperación:", error);
    return false; 
  }
};
