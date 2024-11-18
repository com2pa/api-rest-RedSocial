require('dotenv').config();
const express = require('express');
// const path = require('path');
const app = express();
const connection = require('./database/connection') 
const cors = require('cors')
// cargar rutas
const{usertExtractor}=require('./middleware/auth');
const cookieParser = require('cookie-parser');

// Rutas
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const profileRouter = require('./controllers/profile');

// Connect to MongoDB
connection()

// configurar cors
app.use(cors());
// convertir los datos del body a objetos js
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// esto va hace que cualquier dato que me llegue con el farmato form url enconde me lo
// de codifique tambien y me lo convierta a un objeto usable por javascript 
// app.use(express.urlencoded({extended:true}))



// usar rutas
app.use('/api/users',userRouter)
app.use('/api/login',loginRouter)
app.use('/profile/:id',usertExtractor,profileRouter)

module.exports = app;
