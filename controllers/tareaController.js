import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js";




// ----------------------------------------------------------------------------------------------------------------------------------
const agregarTarea = async(req, res) => {
    //console.log(req.body)
    // Trae el ID del proyecto donde se encuentra la tarea
    const { proyecto } = req.body;
    const existeProyecto = await Proyecto.findById(proyecto);
    if(!existeProyecto){
        const error = new Error('El proyecto no existe');
        return res.status(404).json({ msg: error.message})
    }
    // Comprobamos que el que intenta agregar la tarea sea el creador del proyecto
    if(existeProyecto.creador.toString() !== req.usuario._id.toString() ){
        const error = new Error('No tienes los permisos para añadir tareas');
        return res.status(403).json({ msg: error.message})
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body);
        // ALMACENAR EL ID EN EL PROYECTO
        existeProyecto.tareas.push(tareaAlmacenada._id);
        await existeProyecto.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error)
    }
    // console.log(existeProyecto)
    // console.log(req.usuario._id.toString())
}

// ----------------------------------------------------------------------------------------------------------------------------------

const obtenerTarea = async(req, res) => {
    const { id } = req.params;
    // cruzar consultas con populate
    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea){
        const error = new Error('Tarea No Encontrada');
        return res.status(404).json({ msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(403).json({ msg: error.message})
    }

    res.json(tarea)
    //console.log(tarea)
    //console.log(id)
}
// ----------------------------------------------------------------------------------------------------------------------------------

const actualizarTarea = async(req, res) => {
    const { id } = req.params;
    // cruzar consultas con populate
    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea){
        const error = new Error('Tarea No Encontrada');
        return res.status(404).json({ msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(403).json({ msg: error.message})
    }


    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------

const eliminarTarea = async(req, res) => {
    const { id } = req.params;
    //console.log(id);
    const tarea = await Tarea.findById(id).populate("proyecto");
    //console.log(tarea)
    if(!tarea){
        const error = new Error("Tarea No Encontrada");
        return res.status(404).json({msg: error.message})        
    } 
    // comparamos que la persona que esta intentando acceder al proyecto es la que lo creo
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){        
        const error = new Error("Acción No Válida, sin permiso para eliminar esta tarea");
        return res.status(401).json({msg: error.message})
    }

    try {

        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)
        
        // await proyecto.save() ------> hacerlo de esta manera bloquea la siguiente linea y no podra eliminarse la tarea
        // await tarea.deleteOne();
        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])
        res.json({ msg: "La Tarea se eliminó"})
    } catch (error) {
        console.log(error)
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------

const cambiarEstado = async(req, res) => {
    //console.log(req.params.id);
    const { id } = req.params;
   
    const tarea = await Tarea.findById(id).populate("proyecto");

    console.log(tarea);
   
    if(!tarea){
        const error = new Error("Tarea No Encontrada");
        return res.status(404).json({msg: error.message})        
    } 

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && 
    !tarea.proyecto.colaboradores.some( (colaborador) => colaborador._id.toString() === req.usuario._id.toString())){
        const error = new Error('Acción no válida');
        return res.status(403).json({ msg: error.message})
    }

    //console.log(!tarea.estado);
    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id;
    await tarea.save()

    const tareaAlmacenada = await Tarea.findById(id).populate("proyecto").populate('completado');

    res.json(tareaAlmacenada)
}

// ----------------------------------------------------------------------------------------------------------------------------------

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}











