import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from '../helpers/email.js'


// const usuarios = (req, res) => {
//     res.json({ msg: 'desde api/usuarios'})
// }

// const crearUsuario = (req, res) => {
//     res.json({ msg: 'Creando Usuario'})
// }

const registrar = async (req, res) => {
    // EVITAR REGISTROS DUPLICADOS
    const { email } = req.body;   
    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message })
    }
    // console.log(req.body)
    try {
        const usuario = new Usuario(req.body) // crea una instancia del modelo de usuario
        //console.log(usuario)
        usuario.token = generarId();
        // const usuarioAlmacenado = await usuario.save()
        await usuario.save()
        // res.json(usuarioAlmacenado);

        // ENVIAR EL EMAIL DE CONFIRMACION
       // console.log(usuario);
       emailRegistro({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
       })
        res.json({msg: 'Usuario Creado Correctamente, Revisa tu email para confirmar tu cuenta'});
    } catch (error) {
        console.log(error)
    }    
}

const auntenticar = async (req, res) => {
    const { email, password } = req.body;
    // comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email })
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message})
    }
    // comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message})
    }
    // comprobar password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)  // CREACION DE TOKEN
        })
    }else{
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message})
    }
}

const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({ token });
    //console.log(usuarioConfirmar)
    if(!usuarioConfirmar){
        const error = new Error("Token no válido");
        return res.status(403).json({msg: error.message})
    }
    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({msg: 'Usuario Confirmado Correctamente'})
        //console.log(usuarioConfirmar)
    } catch (error) {
        console.log(error)
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body; // body para extraer valores de un formulario
    const usuario = await Usuario.findOne({ email })
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message})
    }
    try {
        usuario.token = generarId();   
        //console.log(usuario)
        await usuario.save();

        // ENVAIR EL EMAIL

        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params; // params para extraer valores de la url

    const tokenValido = await Usuario.findOne({ token })
    if(tokenValido){
        res.json({msg: 'Token válido y el usuario existe'})
    }else{
        const error = new Error("Token NO válido");
        return res.status(404).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params; // params para extraer valores de la url
    const { password } = req.body;
    // console.log(token);
    // console.log(password);
    const usuario = await Usuario.findOne({ token })
    if(usuario){
       usuario.password = password;
       usuario.token = ''
       try {        
            await usuario.save()
            res.json({msg: 'Password Modificado Correctamente'})
       } catch (error) {
            console.log(error)
       }
    }else{
        const error = new Error("Token NO válido");
        return res.status(404).json({msg: error.message})
    }
}


const perfil = async (req, res) => {
    // console.log('desde perfil')
    const { usuario } = req
    res.json(usuario)
}

export {
    // usuarios,
    // crearUsuario
    registrar,
    auntenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}









