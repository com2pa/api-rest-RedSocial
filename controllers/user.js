const {request, response} = require('../app')
// const userRouter = require('express').Router();
const bcrypt = require('bcrypt')
const User =require('../models/user')
const jwt =require('jsonwebtoken')
const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config');
const express = require('express');
const asyncHandler= require('express-async-handler')
const paginate = require('mongoose-paginate-v2');
const fs = require('fs')
const path = require('path');





// Ruta para registrar un usuario
// userRouter.post('/', async (request, response) => {
//     const{
//         name,
//         lastname,
//         nick,
//         email,
//         password,
//         }
//         = request.body
//     // verificar si lo datos existen
//     if(!name ||!lastname || !nick ||!email ||!password) return response.status(400).json({msg: 'Todos los campos son obligatorios'})
//     // verificar si el email ya existe
//     const emailExist = await User.findOne({email: request.body.email})
//     if(emailExist) return response.status(400).json({msg: 'El email ya existe'})

//     //     // encriptar la contraseña
//         const saltRounds = 10
//         const passwordHash = await bcryt.hash(password, saltRounds)
        
//     // crear nuevo usuario
//         const newUser = new User({
//             name,
//             lastname,
//             nick,
//             email,
//             password: passwordHash
//         })
//     // guardar usuario en la base de datos
//     const savedUser =  await newUser.save()
//     console.log('usuario guardado',savedUser)    

//     //token
//     const token = jwt.sign({id: savedUser.id},  process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h'})
//     // console.log('prueba de token',token)

//     // enviar correo de confirmación
//         const transporter = nodemailer.createTransport({
//             host:'smtp.gmail.com',
//             port: 465,
//             secure: true,
//             auth: {
//                 user: 'your_email@gmail.com',
//                 pass: 'your_password'
//             }
//         })

//         await transporter.sendMail({
//             from: process.env.EMAIL_USER, // sender address
//             to: email, // list of receivers
//             subject: "Verificacion de usuario :)  ✔", // Subject line
//             text: "'Hola'+ req.body.name + ', gracias por registrarte en nuestra red social Para confirmar tu correo, haz click en el siguiente enlace:", 
//             html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar Correo por favor ! </a>`, 
//           });
      
//     return response.status(200).json('! usuario creado! , para continuar con el registro verificar su correo :)')
// })

// // Ruta para verificar el correo

// userRouter.get('/verify/:id', async (req, res) => {
//     try {
//         // buscar usuario por el id
//         const token =req.params.token

//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//         const id = decodedToken.id;

//         // cambiar el estado del usuario a verificado
//         await User.findOneAndUpdate({id,verificacion:true})

//         return res.status(200).json('! Usuario verificado correctamente!')
//     } catch (error) {
//         // encontrar el email del usuario
//         const id =request.params.id
//         const {email}=await User.findById(id)
//         // confirmar el nuevo token
//         const token = jwt.sign({id},  process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h'})
        
//         // enviar correo de confirmación
//         const transporter = nodemailer.createTransport({
//             host:'smtp.gmail.com',
//             port: 465,
//             secure: true,
//             auth: {
//                 user: 'your_email@gmail.com',
//                 pass: 'your_password'
//             }
//         })

//         await transporter.sendMail({
//             from: process.env.EMAIL_USER, // sender address
//             to: email, // list of receivers
//             subject: "Verificacion de usuario :)  ✔", // Subject line
//             text: "'Hola'+ req.body.name + ', gracias por registrarte en nuestra red social Para confirmar tu correo, haz click en el siguiente enlace:", 
//             html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar Correo por favor ! </a>`, 
//           });

//           return response.status(400).json({error:'El link expiro. Se ha enviado un ¡Nuevo link! de verificacion a su correo'})
          
//     }
// })


// const Pruebuser=asyncHandler(async(req,res)=>{
//     const data = { message: 'prueba' };
//     res.status(200).json(data);
 
// })
// creando el usuario
const user_detail = asyncHandler(async(req,res)=>{
    const {
        name,
        lastname,
        nick,
        email,
        password
    } = req.body;
    // verificar si lo datos existen
    if(!name ||!lastname ||!nick ||!email ||!password) return res.status(400).json({msg: 'Todos los campos son obligatorios'})
        
    // verificar si el email ya existe
    const emailExist = await User.findOne({email})
    if(emailExist) return res.status(400).json({msg: 'El email ya existe'})
        
    //     // encriptar la contraseña
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
        
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
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })
    await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: email, // list of receivers
        subject: "Verificacion de usuario :)  ✔", // Subject line
        text: "'Hola'+ req.body.name + ', gracias por registrarte en nuestra red social Para confirmar tu correo, haz click en el siguiente enlace:", 
        html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar Correo por favor ! </a>`, 
      });
      
    return res.status(200).json('! usuario creado! , para continuar con el registro verificar su correo :)')

})

// verificacion de correo

const verify_email = asyncHandler(async(req,res)=>{
    try {
        // buscar usuario por el id
        const token =req.params.token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const id = decodedToken.id;
        
        // cambiar el estado del usuario a verificado
        await User.findOneAndUpdate(id,{verificacion:true})
        
        return res.status(200).send('! Usuario verificado correctamente!')
    } catch (error) {
        // encontrar el email del usuario
        const id =request.params.id
        const {email}=await User.findById(id)
        // confirmar el nuevo token
        const token = jwt.sign({id:id},  process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h'})
        
        // enviar correo de confirmación
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        })
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: "Verificacion de usuario :)  ✔", // Subject line
            text: "'Hola'+ req.body.name + ', gracias por registrarte en nuestra red social Para confirmar tu correo, haz click en el siguiente enlace:", 
            html: `<a href="${PAGE_URL}/verify/${id}/${token}">Verificar Correo por favor ! </a>`, 
         
        })
        
        return res.status(400).json({error:'El link expiro. Se ha enviado un ��Nuevo link! de verificacion a su correo'})
    }

})

// login

const login_user = asyncHandler(async(req,res)=>{
    //  const data = { message: 'red social' };
    // res.status(200).json(data);
    const {
        email, 
        password
    }=req.body;
    // verificar si el usuario existe
    const userExist = await User.findOne({email})
    console.log('consultando.. de existencia !',userExist)
    // si el usuario no existe
    if(!userExist) return res.status(400).json({error: 'email o  Contraseña no encontrado'})
    
    //si el usuario esta verificado
    if(!userExist.verificacion) return res.status(400).json({error: 'Tu email no ha sido verificado por favor revisar!'})
    
    // // verificar la contraseña
    const match = await bcrypt.compare(password, userExist.password)
    if(!match) return res.status(400).json({error: 'email o  Contraseña incorrecta por favor revisar!'})
     // // generar un token de acceso
    const userForToken={
        id: userExist.id,
        user:userExist.name,
        email: userExist.email,
        nick: userExist.nick,
        role:userExist.role,
        fecha:userExist.created_at
    }
    console.log('inicio de sesion de :',userForToken)
    
    const accesstoken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'})
    
    // guardando las cookies
    res.cookie('accesstoken', accesstoken, { 
        expires: new Date(Date.now()+ 1000 * 60 * 60 * 24 * 1 ),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true  // solo puede ser accedido por el server
    }); // 1dia
    
    // torna el roken 
    return res.json(accesstoken)
    
   
})
// perfil de usuario
const user_profile = asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params
                                                  // no quiero ver cuando consulte el perfil
                                                  // role y verificacion 
        const user = await User.findById(id).select({role:0,verificacion:0,})
        if(!user) return res.status(400).json({error: 'usuario no encontrado'})
        
        return res.json({
            user,
            
        })
    } catch (error) {
        console.log('error en user_detail (no encontrado)',error)
        return res.status(500).json({error: 'Error en el server'})
    }
})


// list
const lista_user = asyncHandler(async(req,res)=>{
  const option={    
    limit:parseInt(req.query.page) || 1,
    page: parseInt(req.params.page) || 1,
    forceCountFn:true,
    lean: true,
  }
  const users = await User.paginate({},option,function(error,result){
    if(error) return res.status(500).json({error: 'Error en el server'})
    return res.status(200).json({
      pagina_Actual: result.page,    
      users: result.docs,
      total_usuarios: result.totalDocs,
      limit: result.limit,
      total_paginas: Math.ceil(result.totalDocs / result.limit),
    
    
    })
  })


})


// actualizar usuario

const user_update = asyncHandler(async(req,res)=>{
    // recoger info de usuario a actualizar
    // para obtener los datos del usuario
    let userIdentity = req.user
    // datos que me envia el cliente para actualizar
    let userUpdate = req.body;

    // eliminacion de campos ignecesarios
    delete userUpdate.role;
    delete userUpdate.avatar;
    delete userUpdate.verificacion;

   // buscar el usuario en la base de datos
   let user = await User.findById(userIdentity.id);

   // comprobar si el usuario existe
   if (!user) {
       return res.status(404).json({ error: 'Usuario no encontrado' });
   }

   // comprobar si se modificó algún campo
   let modifiedFields = [];
   if (user.name !== userUpdate.name) modifiedFields.push('name');
   if (user.lastname !== userUpdate.lastname) modifiedFields.push('lastname');
   if (user.nick !== userUpdate.nick) modifiedFields.push('nick');
   if (user.email !== userUpdate.email) modifiedFields.push('email');
   if (user.password!== userUpdate.password) {
    // encriptar la contraseña
    const saltRounds = 10
    const password = userUpdate.password;
    const passwordHash = await bcrypt.hash(Buffer.from(password), saltRounds)
    userUpdate.password = passwordHash;
    modifiedFields.push('password');
   }
   
    if(user.bio !== userUpdate.bio) modifiedFields('bio');
   
    // verificar si el email existe 
    const userExist = await User.findOne({ email: userUpdate.email });
    if (userExist && userExist._id.toString()!== userIdentity.id) {
        return res.status(400).json({ error: 'El email ya está en uso' });
    }
    // verificar si el nick existe
    const nickExist = await User.findOne({ nick: userUpdate.nick });
    if (nickExist && nickExist._id.toString()!== userIdentity.id) {
        return res.status(400).json({ error: 'El nick ya está en uso' });
    }

    // guardar los cambios en la base de datos
    await user.save();
    
    // buscar y actualizar 

   // verificar si se modificó algun campo 
   try {
    if (modifiedFields.length > 1) {
        user = await User.findByIdAndUpdate(userIdentity.id, userUpdate, { new: true }).exec();
        return res.status(200).json({ 
            message: 'Se modificó el campo: ' + modifiedFields.join(', '),
            user: user
         });
    } else {
        return res.status(200).json({ 
            message: 'No se modificó ningún campo',
            
         });
    } 
   } catch (error) {
    console.log('error en user_update', error)
    return res.status(500).json({ error: 'Error en el server al actualizar' });
    
   }  
   

})
// subir archivo

const upload_avatar =asyncHandler(async(req,res)=>{
    // recoger si fichero de imagen y comprobar si existe
    if (!req.file) {
        return res.status(404).send({msg:'La peticion no inclye imagen'  });
    }
    // conseguir el nombre del archivo
    let image = req.file.originalname

    //sacar la extension
    const imageSplit =image.split("\.")
    const ext = imageSplit[1];
     if (
        ext != "png" &&
        ext != "jpg" &&
        ext != "gif" &&
        ext != "jpeg" &&
        ext != "mp4" &&
        ext != "webm" &&
        ext != "ogg" &&
        ext != "mkv"
    ){
        // borrar archivo subido
        const filePath =req.file.path
        const fileDelete = fs.unlinkSync(filePath);
        // devolver respuesta negativa
        return res.status(400).json({error: 'La extension del archivo no es válida'})

     }
     // subir imagen al storage
     const avatarName = `${req.user.id}-${Date.now()}.${ext}`;
     const avatarPath = path.join(__dirname, '..', '/uploads/avatars', avatarName);
     fs.renameSync(req.file.path, avatarPath);
     // actualizar el campo avatar en la base de datos
     await User.findByIdAndUpdate(req.user.id, { avatar: avatarName }, { new: true }).exec();
    // devolver respuesta positiva
     const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarName }, { new: true }).exec();
     res.status(200).json({ 
         message: 'Subiendo archivo',
         user: user,
         avatar: avatarName,
         file:req.file,
        
     });

    // return res.status(200).json({ 
    //     message: 'subiendo archivo',
    //     // user:req.user
    //     file:req.file,
        
    //  });
})

// rutas para mostrar la imagenes
const avatar =asyncHandler(async(req,res)=>{
    // sacar el parametr de la url
    const file =req.params.file


    // mostrando el path real de la imagen
    const filePath="./uploads/avatars/"+file
    // comprobar si existe
    fs.stat(filePath,(error ,exists)=>{
        if(!exists){
            return res.status(404).send({
                status:"error",
                message:"no existe la imagen"
            }) 
        }
        // devolver un file
       return res.sendFile(path.resolve(filePath))
    })
})


module.exports = {
    user_detail,
    verify_email,
    login_user,
    user_profile,
    lista_user,
    user_update,
    upload_avatar,
    avatar
}