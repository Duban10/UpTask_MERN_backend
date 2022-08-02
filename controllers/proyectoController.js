import Proyecto from "../models/Proyecto.js"
import Usuario from "../models/Usuario.js";



// obtener todos los proyectos del usuario que este autenticado
const obtenerProyectos = async (req, res) => {
    // traer todos los proyectos almacenados cuando el creador sea el logueado (req.usuario en checkAuth)
    // para que se muestren los proyecto donde son colaboradores
    const proyectos = await Proyecto.find({        
        '$or' : [
            { colaboradores: { $in: req.usuario }},
            { creador: { $in: req.usuario }}
        ],
    }).select('-tareas');
    res.json(proyectos);
}

// --------------------------------------------------------------------------------------------------------------------------------------------
// para crear nuevo proyecto   
const nuevoProyecto = async (req, res) => {
    // console.log(req.body);
    // console.log(req.usuario);
    // capturar lo que me envian del body de proyecto
    const proyecto = new Proyecto(req.body);
    // el creador va a ser el usuario logueado
    proyecto.creador = req.usuario._id;
    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

// --------------------------------------------------------------------------------------------------------------------------------------------

// va a listar un proyecto y las tareas asociadas a dicho proyecto 
const obtenerProyecto = async (req, res) => {
    const { id } = req.params;
    //console.log(id);
    const proyecto = await Proyecto.findById(id)
        //.populate('tareas')
        .populate({ path: 'tareas', populate: { path : "completado", select: "nombre" } })
        .populate('colaboradores', 'nombre email')
    //console.log(proyecto)
    // comprobamos que el proyecto exista
    if(!proyecto){
        const error = new Error("No Encontrado");
        return res.status(404).json({msg: error.message})
        
    }   
    // console.log(proyecto.creador)
    // console.log(req.usuario._id)

    // comparamos que la persona que esta intentando acceder al proyecto es la que lo creo
    if(proyecto.creador.toString() !== req.usuario._id.toString() && 
        !proyecto.colaboradores.some( (colaborador) => colaborador._id.toString() === req.usuario._id.toString())){        
        const error = new Error("Acción No Válida"); 
        return res.status(401).json({msg: error.message})
    }

    // Obtener las tareas del proyecto
    // tiene que ser el creador del proyecto o colaborador
    //const tareas = await Tarea.find().where('proyecto').equals(proyecto._id)
    res.json(
        proyecto,
        //tareas
    )

}

// --------------------------------------------------------------------------------------------------------------------------------------------


const editarProyecto = async (req, res) => {
    const { id } = req.params;
    //console.log(id);
    const proyecto = await Proyecto.findById(id)
    //console.log(proyecto)
    if(!proyecto){
        const error = new Error("No Encontrado");
        return res.status(404).json({msg: error.message})        
    }   
    // console.log(proyecto.creador)
    // console.log(req.usuario._id)
    // comparamos que la persona que esta intentando acceder al proyecto es la que lo creo
    if(proyecto.creador.toString() !== req.usuario._id.toString()){        
        const error = new Error("Acción No Válida, sin permiso para editar este proyecto");
        return res.status(401).json({msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;
    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error)
    }    
}


// --------------------------------------------------------------------------------------------------------------------------------------------


const eliminarProyecto = async (req, res) => {
    const { id } = req.params;
    //console.log(id);
    const proyecto = await Proyecto.findById(id)
    //console.log(proyecto)
    if(!proyecto){
        const error = new Error("No Encontrado");
        return res.status(404).json({msg: error.message})        
    } 
    // comparamos que la persona que esta intentando acceder al proyecto es la que lo creo
    if(proyecto.creador.toString() !== req.usuario._id.toString()){        
        const error = new Error("Acción No Válida, sin permiso para eliminar este proyecto");
        return res.status(401).json({msg: error.message})
    }

    try {
        await proyecto.deleteOne();
        res.json({ msg: "Proyecto Eliminado"})
    } catch (error) {
        console.log(error)
    }
}

// --------------------------------------------------------------------------------------------------------------------------------------------


const buscarColaborador = async (req, res) => {
    //console.log(req.body)
    const {email} = req.body

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v ')

    if(!usuario){
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }
    res.json(usuario)
}

// --------------------------------------------------------------------------------------------------------------------------------------------


const agregarColaborador = async (req, res) => {
    //console.log(req.params.id);
    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto){
        const error = new Error("Proyecto No Encontrado")
        return res.status(404).json({ msg: error.message})
    }

    // COMPROBAR QUE LA PERSONA QUE VA A AGREGAR COLABORADORES SEA EL CREADOR

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no válida, no eres el creador")
        return res.status(404).json({ msg: error.message})
    }
    //console.log(req.body);

    const {email} = req.body

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v ')

    if(!usuario){
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }

    // El colaborador no es el Admin del proyecto
    if(proyecto.creador.toString() === usuario._id.toString() ){
        const error = new Error('El creador del proyecto no puede ser colaborador')
        return res.status(404).json({msg: error.message})
    }

    //Revisar que no este agregado al proyecto
    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error('El Usuario ya pertenece al proyecto')
        return res.status(404).json({msg: error.message})
    }

    // ESTA BIEN !!! SE PUEDE AGREGAR
    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    res.json({msg: "Colaborador Agregado Correctamente"})

}

// --------------------------------------------------------------------------------------------------------------------------------------------

const eliminarColaborador = async (req, res) => {
     //console.log(req.params.id);
     const proyecto = await Proyecto.findById(req.params.id);

     if(!proyecto){
         const error = new Error("Proyecto No Encontrado")
         return res.status(404).json({ msg: error.message})
     }
 
     // COMPROBAR QUE LA PERSONA QUE VA A AGREGAR COLABORADORES SEA EL CREADOR
 
     if(proyecto.creador.toString() !== req.usuario._id.toString()){
         const error = new Error("Acción no válida, no eres el creador")
         return res.status(404).json({ msg: error.message})
     }
     //console.log(req.body);
 
      // ESTA BIEN !!! SE PUEDE ELIMINAR
    proyecto.colaboradores.pull(req.body.id);
    //console.log(proyecto);
    
    await proyecto.save();
    res.json({msg: "Colaborador Eliminado Correctamente"})

    
}


// --------------------------------------------------------------------------------------------------------------------------------------------


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
    
}


