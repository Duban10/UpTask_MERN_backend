import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim: true,
        required: true
    },
    descripcion:{
        type: String,
        trim: true,
        required: true
    },
    fechaEntrega:{
        type: Date,
        default: Date.now()        
    },
    cliente:{
        type: String,
        trim: true,
        required: true
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,           // creador de tipo Usuario
        ref: 'Usuario'
    },
    tareas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tarea',
        }
    ],
    colaboradores: [ // corchetes para indicar que van a ver mas de un colaborador
        {
            type: mongoose.Schema.Types.ObjectId,           // creador de tipo Usuario
            ref: 'Usuario'
        }
    ]
},{
    timestamps: true
})

const Proyecto = mongoose.model("Proyecto", proyectosSchema)
export default Proyecto;





