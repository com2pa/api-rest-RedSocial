// importando dependencia
const http = require('http')
const app= require('./app')

// creando servidor de nodejs
const server = http.createServer(app);
server.listen(3000,()=>{
    console.log('servidor escuchando en el puerto 3000')  
})
