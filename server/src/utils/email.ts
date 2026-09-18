import nodemailer from "nodemailer"

// Crear un transporte de prueba (MailHog o similar)
// En producción, usar tu servicio SMTP real
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "1025"),
  secure: false,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASSWORD
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      : undefined,
})

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@ferreteriajrc.com",
      to,
      subject,
      html,
    })
    console.log(`📧 Email enviado a ${to}`)
  } catch (error) {
    console.error("❌ Error enviando email:", error)
    throw error
  }
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetToken: string
): Promise<void> {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

  const html = `
    <h2>Recupera tu contraseña</h2>
    <p>Hola ${name},</p>
    <p>Recibimos una solicitud para recuperar tu contraseña. Haz clic en el enlace a continuación para restablecerla:</p>
    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
      Recuperar Contraseña
    </a>
    <p>Este enlace expirará en 1 hora.</p>
    <p>Si no solicitaste esto, puedes ignorar este email.</p>
    <p>Saludos,<br>Equipo Ferretería JRC</p>
  `

  await sendEmail(to, "Recupera tu contraseña - Ferretería JRC", html)
}

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<void> {
  const html = `
    <h2>¡Bienvenido a Ferretería JRC!</h2>
    <p>Hola ${name},</p>
    <p>Tu cuenta ha sido creada exitosamente. Ya puedes acceder al portal con tus credenciales.</p>
    <a href="${process.env.FRONTEND_URL}/portal" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
      Ir al Portal
    </a>
    <p>Saludos,<br>Equipo Ferretería JRC</p>
  `

  await sendEmail(to, "¡Bienvenido a Ferretería JRC!", html)
}
