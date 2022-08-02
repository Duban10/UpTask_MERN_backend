import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    descripcion: {
        type: String,
        trim: true,
        required: true,
    },
    estado: {
        type: Boolean,
        default: false,
       
    },
    fechaEntrega: {
        type: Date,      
        required: true,
        default: Date.now()
    },
    prioridad: {
        type: String,
        required: true,
        // enum solo permite los valores que estan en el arreglo definido
        enum: ['Baja','Media','Alta']
    },
    proyecto: {
        // para hacer referencia a otra tabla de la BD
        type: mongoose.Schema.Types.ObjectId,      
        // nombre del modelo de la tabla
        ref: "Proyecto"
    },
    completado : {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "Usuario"
    }
},{
    timestamps: true,
});

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;