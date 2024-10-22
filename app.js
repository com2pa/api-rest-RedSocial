require('dotenv').config();

const express = require('express');
const path = require('path');
const { PAGE_URL } = require('./config');

const app = express();
const mongoose =require('mongoose')
const connection = require('./database/connection') 
const cors = require('cors')
// cargar rutas
const userRouter =require('./routes/user')
const{usertExtractor}=require('./middleware/auth');
const CookieParser = require('cookieparser');

//  otra forma de trabajar mongodb a nivel local
// pero tiene que ejecutar primero mongod.exe 
// Connect to MongoDB
connection()

//  otra forma de trabajar mongodb a nivel local---------------------------------------
// ------------------------------------------------------------------------------------
// mongoose.connect(PAGE_URL, 
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         // useCreateIndex: true
//     }
// )
// const connection = mongoose.connection;

// connection.once('open', () => {
//   console.log('Conectando a MongoDB  local ... :)');
// });

// configurar cors
app.use(cors());
// convertir los datos del body a objetos js
app.use(express.json());
app.use(CookieParser())

// esto va hace que cualquier dato que me llegue con el farmato form url enconde me lo
// de codifique tambien y me lo convierta a un objeto usable por javascript 
// app.use(express.urlencoded({extended:true}))



// usar rutas
app.use('/api/users',usertExtractor ,userRouter)
