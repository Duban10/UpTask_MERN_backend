import express from 'express'

import {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
} from '../controllers/tareaController.js'
import checkAuth from '../middleware/ckeckAuth.js'



const router = express.Router()

// para agregar tareas el usuario tiene que estar autenticado
router.post('/', checkAuth, agregarTarea)
router.route('/:id').get(checkAuth, obtenerTarea).put(checkAuth, actualizarTarea).delete(checkAuth, eliminarTarea)
router.post('/estado/:id', checkAuth, cambiarEstado)


export default router;










