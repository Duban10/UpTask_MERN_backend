import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js';



// next nos permite ir al siguiente middleware que en este caso es perfil en usuarioController
const checkAuth = async (req, res, next) => {
    // console.log('desde ckeck')
    //console.log(req.headers.authorization)
    let token;
    // verifica si hay un token en el headers
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            // console.log(token)
            // sign crear el token y verify lo lee
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log(decoded)
            req.usuario = await Usuario.findById(decoded.id).select(
                "-password -confirmado -token -createdAt -updatedAt -__v")
            // console.log(req.usuario)
            return next()
        } catch (error) {
            return res.status(404).json({msg: 'Hubo un error'})
        }
    }
    
    if(!token){
        const error = new Error('Token no válido');
        return res.status(401).json({msg: error.message})
    }

    next()
}

export default checkAuth




