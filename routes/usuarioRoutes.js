import express from "express"
const router = express.Router();
import { registrar, auntenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } from '../controllers/usuarioController.js'
import checkAuth from '../middleware/ckeckAuth.js'


// import { usuarios, crearUsuario } from '../controllers/usuarioController.js'

// router.get('/', usuarios);
// router.post('/', crearUsuario);

// router.post('/', (req, res) => {
//     res.send('desde póst api/usuarios')
// })

// router.put('/', (req, res) => {
//     res.send('desde PUT api/usuarios')
// })

// router.delete('/', (req, res) => {
//     res.send('desde DELETE api/usuarios')
// })


// AUTENTICACION, REGISTRO Y CONFIRMACION DE USUARIO
router.post('/', registrar); // crea un nuevo usuarios
router.post('/login', auntenticar) // autentica el acceso
router.get('/confirmar/:token', confirmar) // routing dinamico
router.post('/olvide-password', olvidePassword)
// router.get('/olvide-password/:token', comprobarToken)
// router.post('/olvide-password/:token', nuevoPassword)
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil', checkAuth, perfil)


export default router







