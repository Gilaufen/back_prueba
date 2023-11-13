import express from "express";
import cors from "cors"
import {PORT} from './config.js'
import user from './routes/user.routes.js';
import realEstate from './routes/realEstate.routes.js'
import proyects from './routes/proyects.routes.js' 

//Inicializamos express
const app = express()
//Usando cors en la aplicación 

const corsOptions = {
    origin: 'http://localhost:3000', // Cambia esto al dominio de tu aplicación React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
  // Habilitar CORS con opciones personalizadas
  app.use(cors(corsOptions));
  
//Vaalidar archivos json en la app
app.use(express.json())
//Usar las rutas en la app
app.use(user, realEstate, proyects)


//Ejecutar el puerto
app.listen(PORT, ()=>{
    console.log("se esta ejecutando en el puerto", PORT)
})