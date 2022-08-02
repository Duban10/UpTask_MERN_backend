
import nodemailer from 'nodemailer'


export const emailRegistro = async (datos) => {
    //console.log("DATOS", datos)
    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure:false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls:{
          rejectUnauthorized: false
      }
      });
    //INFORMACION DE EMAIL
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <luisverjel@wposs.com>',
        to: email,
        subject: "UpTask - Comprueba tu cuenta",
        text: "Comprueba tu cuenta en Uptask",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
                <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el sigueinte enlace: </p>

                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>

                <p> Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>

                `,                
    })

}

export const emailOlvidePassword = async (datos) => {
    //console.log("DATOS", datos)
    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure:false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls:{
          rejectUnauthorized: false
      }
      });
    //INFORMACION DE EMAIL
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <luisverjel@wposs.com>',
        to: email,
        subject: "UpTask - Reestablece tu password",
        text: "Reestablece tu password",
        html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>
                <p>Sigue el siguiente enlace para generar un nuevo password:</p>

                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>

                <p> Si tu no solicitaste este email, puedes ignorar el mensaje</p>

                `,                
    })

}