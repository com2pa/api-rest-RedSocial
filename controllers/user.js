const {request, response} = require('../app')
const userRouter = require('express').Router();
const bcryt = require('bcrypt')
const User =require('../models/user')
const jwt =require('jsonwebtoken')
const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config');



// Ruta para registrar un usuario
userRouter.post('/', async (request, response) => {
    const{
        name,
        lastname,
        nick,
        email,
        password,
        }
        = request.body
    // verificar si lo datos existen
    if(!name ||!lastname || !nick ||!email ||!password) return response.status(400).json({msg: 'Todos los campos son obligatorios'})
    // verificar si el email ya existe
    const emailExist = await User.findOne({email: request.body.email})
    if(emailExist) return response.status(400).json({msg: 'El email ya existe'})

    //     // encriptar la contraseña
        const saltRounds = 10
        const passwordHash = await bcryt.hash(password, saltRounds)
        
    // crear nuevo usuario
        const newUser = new User({
            name,
            lastname,
            nick,
            email,
            password: passwordHash
        })
    // guardar usuario en la base de datos
    const savedUser =  await newUser.save()
    console.log('usuario guardado',savedUser)    

    //token
    const token = jwt.sign({id: savedUser.id},  process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h'})
    // console.log('prueba de token',token)

    // enviar correo de confirmación
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_password'
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: "Verificacion de usuario :)  ✔", // Subject line
            text: "'Hola'+ req.body.name + ', gracias por registrarte en nuestra red social Para confirmar tu correo, haz click en el siguiente enlace:", 
            html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar Correo por favor ! </a>`, 
          });
      
    return response.status(200).json('! usuario creado! , para continuar con el registro verificar su correo :)')
})

// // Ruta para verificar el correo

userRouter.get('/verify/:id', async (req, res) => {
    try {
        // buscar usuario por el id
        const token =req.params.token

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const id = decodedToken.id;

        // cambiar el estado del usuario a verificado
        await User.findOneAndUpdate({id,verificacion:true})

        return res.status(200).json('! Usuario verificado correctamente!')
    } catch (error) {
        // encontrar el email del usuario
        const id =request.params.id
        const {email}=await User.findById(id)
        // confirmar el nuevo token
        const token = jwt.sign({id},  process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h'})
        
        // enviar correo de confirmación
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_password'
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: "Verificacion de usuario :)  ✔", // Subject line
            text: "'Hola'+ req.body.name + ', gracias por registrarte en nuestra red social Para confirmar tu correo, haz click en el siguiente enlace:", 
            html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar Correo por favor ! </a>`, 
          });

          return response.status(400).json({error:'El link expiro. Se ha enviado un ¡Nuevo link! de verificacion a su correo'})
          
    }
})





module.exports = userRouter;