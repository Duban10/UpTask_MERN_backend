//const express = require('express')
import  express from "express";
import dotenv from "dotenv"
import cors from 'cors'
import conectarDB from "./config/db.js";
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from "./routes/proyectoRoutes.js"
import tareaRoutes from "./routes/tareaRoutes.js"

const app = express();
app.use(express.json()); // Par que pueda procesar informacion tipo JSON

dotenv.config();

conectarDB();

// configurar CORS

const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    // origin detecta que fronent esta haciendo la peticion
    origin: function(origin, callback){
        console.log(origin)
        if(whiteList.includes(origin)){
            // PUEDE CONSULTAR LA API
            callback(null, true)
        }else{
            // NO PUEDE CONSULTAR LA API
            callback(new Error("Error de CORS"))
        }
    }
};
app.use(cors(corsOptions))

//Routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)

const PORT = process.env.port || 4000;

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

// Socket.io
import { Server } from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
       origin: process.env.FRONTEND_URL,
       //origin: 'http://localhost:3000',
    },
});


io.on("connection", (socket) => {
    console.log('Conectado a socket.io');
    
    // Definir los eventos de socket.io
        // socket.on('prueba', (nombre) => {
        //     console.log('prueba desde socket.io', nombre);

        //     socket.emit('respuesta', {nombre: 'Duban'})
        
        // })

    socket.on('abrir proyecto', (proyecto) => {
        //console.log("Desde el Proyecto", proyecto);
        socket.join(proyecto) // join es para entrar a una sala con ese proyecto
       // socket.to('62d307bccfd3300fd2934a65').emit('respuesta', {nombre: 'Duban'})
    })

    socket.on('nueva tarea', (tarea) => {
       //console.log(tarea);
       //const proyecto = tarea.proyecto;
       socket.to(tarea.proyecto).emit('tarea agregada', tarea) // emitir este evento a la persona que tenga abierto este proyecto
    })

    socket.on('eliminar tarea', tarea => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })

    socket.on('actualizar tarea', (tarea) => {
        //console.log(tarea);
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })

    socket.on('cambiar estado', tarea => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('nuevo estado', tarea)
    })

})





