// importando dependencia
// const connection = require('./database/connection') 
const http = require('http')
const app= require('./app')

// conexion a la base de datos
// connection();

// creando servidor de nodejs
const server = http.createServer(app);
server.listen(3000,()=>{
    console.log('servidor escuchando en el puerto 3000')  
})


// poner servidor a escuchar peticiones  http

