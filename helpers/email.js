import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
        port: process.env.EMAIL_PORT || 2525,
        auth: {
            user: process.env.EMAIL_USER || "71395cd9a3cd5a",
            pass: process.env.EMAIL_PASS || "cd4f840e1655ee"
        }
    });

    const { nombre, email, token } = datos

    // Enviar el correo
    await transport.sendMail({
        from: 'Bienes Raices <noreply@bienesraices.com>',
        to: email,
        subject: 'Confirma tu cuenta en Bienes Raices',
        text: 'Confirma tu cuenta en Bienes Raices',
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirma tu cuenta</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: Arial, sans-serif;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                    <td style="background: linear-gradient(to right, #FF6819, #FF8F17); padding: 30px 0; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bienes Raíces</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <h2 style="color: #333333; margin: 0 0 20px; font-size: 20px;">¡Bienvenido ${nombre}!</h2>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">Gracias por registrarte en Bienes Raíces. Para comenzar a usar tu cuenta, necesitamos confirmar tu dirección de correo electrónico.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.BACKEND_URL}:${process.env.PORT}/auth/confirmar/${token}" 
                               style="background: linear-gradient(to right, #FF6819, #FF8F17); 
                                      color: #ffffff; 
                                      text-decoration: none; 
                                      padding: 12px 30px; 
                                      border-radius: 25px; 
                                      font-weight: bold;
                                      display: inline-block;
                                      text-transform: uppercase;
                                      font-size: 14px;
                                      transition: all 0.3s;">
                                Confirmar mi cuenta
                            </a>
                        </div>
                        <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                        <p style="color: #999999; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} Bienes Raíces. Todos los derechos reservados.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    })
}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
        port: process.env.EMAIL_PORT || 2525,
        auth: {
            user: process.env.EMAIL_USER || "71395cd9a3cd5a",
            pass: process.env.EMAIL_PASS || "cd4f840e1655ee"
        }
    });

    const { nombre, email, token } = datos

    // Enviar el correo
    await transport.sendMail({
        from: 'Bienes Raices <noreply@bienesraices.com>',
        to: email,
        subject: 'Reestablece tu contraseña en Bienes Raices',
        text: 'Reestablece tu contraseña en Bienes Raices',
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reestablecer Contraseña</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: Arial, sans-serif;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                    <td style="background: linear-gradient(to right, #FF6819, #FF8F17); padding: 30px 0; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bienes Raíces</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <h2 style="color: #333333; margin: 0 0 20px; font-size: 20px;">Hola ${nombre}</h2>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">Has solicitado reestablecer tu contraseña. Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.BACKEND_URL}:${process.env.PORT}/auth/reestablecer-password/${token}" 
                               style="background: linear-gradient(to right, #FF6819, #FF8F17); 
                                      color: #ffffff; 
                                      text-decoration: none; 
                                      padding: 12px 30px; 
                                      border-radius: 25px; 
                                      font-weight: bold;
                                      display: inline-block;
                                      text-transform: uppercase;
                                      font-size: 14px;
                                      transition: all 0.3s;">
                                Reestablecer Contraseña
                            </a>
                        </div>
                        <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">Si no solicitaste reestablecer tu contraseña, puedes ignorar este mensaje. Tu contraseña actual seguirá funcionando.</p>
                        <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0 0;">Por seguridad, este enlace expirará en 24 horas.</p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                        <p style="color: #999999; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} Bienes Raíces. Todos los derechos reservados.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    })
}

const emailContacto = async (datos) => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "71395cd9a3cd5a",
            pass: "cd4f840e1655ee"
        }
    });

    const { email, asunto, mensaje, tipo } = datos

    // Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: 'admin@bienesraices.com',
        subject: `Nueva Consulta: ${asunto}`,
        text: 'Nueva consulta recibida',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(to right, #FF6819, #FF8F17); padding: 20px; text-align: center;">
                    <img src="cid:logo" alt="Bienes Raíces Logo" style="max-width: 200px;">
                </div>
                
                <div style="padding: 20px; background-color: #ffffff;">
                    <h2 style="color: #333333;">Nueva Consulta Recibida</h2>
                    
                    <div style="margin: 20px 0; padding: 15px; background-color: #f8f8f8; border-radius: 5px;">
                        <p><strong>Categoría:</strong> ${tipo}</p>
                        <p><strong>Email del remitente:</strong> ${email}</p>
                        <p><strong>Asunto:</strong> ${asunto}</p>
                        <p><strong>Mensaje:</strong></p>
                        <p style="white-space: pre-line;">${mensaje}</p>
                    </div>
                </div>
                
                <div style="background-color: #333333; color: #ffffff; padding: 20px; text-align: center;">
                    <p>&copy; ${new Date().getFullYear()} Bienes Raíces. Todos los derechos reservados.</p>
                </div>
            </div>
        `
    })
}

export {
    emailRegistro,
    emailOlvidePassword,
    emailContacto
}
