require('dotenv').config();

const express = require('express');
const path = require('path');
const { PAGE_URL } = require('./config');

const app = express();
const mongoose =require('mongoose')
const connection = require('./database/connection') 

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