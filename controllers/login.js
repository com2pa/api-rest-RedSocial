const loginRouter =require('express').Router()
const User =require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')




// Ruta para iniciar sesion
loginRouter.post('/', async(request,response)=>{
    const {email, password} = request.body;
    // verificar si el usuario existe
    const userExist =await User.findOne({email})
    console.log('exite el usuario',userExist)
    
    // si el usuario no existe
    if(!userExist) return response.status(400).json({error: 'email o  Contraseña no encontrado'})
    
    //si el usuario esta verificado
    if(!userExist.verificacion) return response.status(400).json({error: 'Tu email no ha sido verificado por vafor revisar !'})
    
    // // verificar la contraseña
    const match = await bcrypt.compare(password, userExist.password)
    if(!match) return response.status(400).json({error: 'email o  Contraseña incorrecta por favor revisar!'})
    
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
    response.cookie('accesstoken', accesstoken, { 
        expires: new Date(Date.now()+ 1000 * 60 * 60 * 24 * 1 ),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true  // solo puede ser accedido por el server
     }); // 1dia

     return response.json({
        accesstoken,
        message:'iniciando session correctamente !'
    })

})

module.exports = loginRouter;