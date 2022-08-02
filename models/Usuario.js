import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true // quita los espacios de inicio y de final de un string
    },
    password:{
        type: String,
        required: true,
        trim: true // quita los espacios de inicio y de final de un string
    },
    email: {    
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token:{
        type: String
    },
    confirmado:{
        type: Boolean,
        default: false
    }

},{
    timestamps: true, // crea dos columnas, una de creado y otra de actualizado
});


// HASHEAR PASSWORD
usuarioSchema.pre('save', async function(next){
    // para saber que no esta modificando el password y los usuarios no pierdan el acceso
    if(!this.isModified('password')){ 
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// COMPROBAR EL PASSWORD
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}


const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;















