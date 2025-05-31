import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "71395cd9a3cd5a",
            pass: "cd4f840e1655ee"
        }
    });

    const { nombre, email, token } = datos
    // Enviar el correo
    await transport.sendMail({
        from: 'Bienes Raices',
        to: email,
        subject: 'Confirma tu cuenta en Bienes Raices',
        text: 'Confirma tu cuenta en Bienes Raices',
        html: `
        <p>Hola ${nombre}, comprueba tu cuenta en Bienes Raices</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT}/auth/confirmar/${token}">Comprobar cuenta</a>
        </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    })
}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "71395cd9a3cd5a",
            pass: "cd4f840e1655ee"
        }
    });

    const { nombre, email, token } = datos
    // Enviar el correo
    await transport.sendMail({
        from: 'Bienes Raices',
        to: email,
        subject: 'Reestablece tu password en Bienes Raices',
        text: 'Reestablece tu password en Bienes Raices',
        html: `
        <p>Hola ${nombre}, has solicitado reestablecer tu password en Bienes Raices</p>
        <p>Sigue el siguiente enlace para reestablecer tu password:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT}/auth/reestablecer-password/${token}">Reestablecer password</a>
        </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    })
}
export {
    emailRegistro,
    emailOlvidePassword
}
