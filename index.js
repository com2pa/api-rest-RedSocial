// importando dependencia
// const connection = require('./database/connection') 
const http = require('http')
const app= require('./app')

// Mensaje de bienvenida ejemplo
// console.log('api node para red social iniciando ...')

// conexion a la base de datos
// connection();

// creando servidor de nodejs
const server = http.createServer(app);
server.listen(3000,()=>{
    console.log('servidor escuchando en el puerto 3000')  
})
// configurar cors

// convertir los datos del body a objetos js

// cargar las rutas

// poner servidor a escuchar peticiones  http

