const express =require("express");
const router =express.Router();
const UserController = require('../controllers/user');
// const UserLogin =require('../controllers/login')
const { usertExtractor } = require('../middleware/auth');
const multer =require('multer')

// configuracion de subida
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const allowedMimeTypes = [
            'image/jpeg', 
            'image/png', 
            'image/gif',
            'video/mp4', 
            'video/webm',
            'video/ogg',
            'video/mkv'
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, './uploads/avatars/', true);
        }
        // else {
        //     cb(new Error('Formato de archivo no soportado'), false);
        // }
    },
    filename: function (req, file, cb) {
        cb(null, "avatars " + Date.now() + ' - ' + file.originalname);
    }
})

const upload = multer({
    storage: storage,
    // limits: { fileSize: 1000000 } // 1MB
})


// router.get('/prueba-user',UserController.Pruebuser)
router.post('/', UserController.user_detail)
// verificacion de correo
router.patch('/:id/token',UserController.verify_email)
// accion de login
router.post('/login',UserController.login_user)
// perfil del usuario
router.get('/profile/:id',usertExtractor,UserController.user_profile)
// lista de usuarios
router.get('/list/:page?',usertExtractor,UserController.lista_user)
// actualiar usuario
router.put('/update/', usertExtractor, UserController.user_update)
// subiendo archivo
router.post('/upload',[usertExtractor, upload.single("file0")], UserController.upload_avatar)
// ruta para imagenes
router.get('/avatar/:file',usertExtractor, UserController.avatar)






module.exports = router;