var express = require('express');
var router = express.Router();
const path =require('path');
const usersApiController=require('../../controllers/api/userApiController');
const recommendationApiController=require('../../controllers/api/recommendationApiController');
const guestMiddleware = require('../../middlewares/guestMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');

// Requiero Multer para recibir la imagen del perfil de usuario y lo configuro
const multer=require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, path.join(__dirname, '../../../recomendaMe/src/assets/images/avatars'));
  },
  filename: function(req,file,cb){
    cb(null, `${Date.now()}_img${path.extname(file.originalname)}`);
    
  }
})
const  uploadFile = multer ({storage});

//Requiero Express_valdator para validar los datos que vienen del formulario y cnfiguro las validaciones que debe realizar

const { body }=require ('express-validator');
const validations=[
  body('name').notEmpty().withMessage('Tienes que escribir un Nombre'),
  body('lastname').notEmpty().withMessage('Tienes que escribir un Apellido'),
  body('phone').notEmpty().withMessage('Tienes que escribir un número telefónico'),
  body('email')
          .notEmpty().withMessage('Tienes que escribir un email').bail()
          .isEmail().withMessage('Debes ingresar un formato de correo válido'),    
  body('password').notEmpty().withMessage('Tienes que escribir un password'),
  body('privileges_id').notEmpty(),
  body('image').custom((value, {req}) =>{
    let file = req.file;
    let acceptedExtensions=['.jpg','.png','.gif', '.webp']
    if (!file) {
      
    } else {
      let fileExtension = path.extname(file.originalname)
        if (!acceptedExtensions.includes(fileExtension)) {
        throw new Error('Tienes que subir una imagen en formato válido .jpg, .png, .gif')
        } 
    }
    
      
    return true;
  })
]


/* GET users listing. */
// Lista de usuarios
router.get('/', usersApiController.list);
// Formulario de registro de usuario
router.get('/register', usersApiController.register);
//Procesar el registro
router.post('/register', uploadFile.single('image'), validations, usersApiController.create);
//Formulario de login
router.get('/login', guestMiddleware, usersApiController.login);
//Procesar login
router.post('/login', usersApiController.loginProcess);
//Procesar logout
router.get('/logout',authMiddleware, usersApiController.logout);
// Perfil de usuario
router.get('/profile/:id', usersApiController.profile);
// Editar Perfil de Usuario
router.get('/profile/edit/:id',authMiddleware, usersApiController.edit);
router.post('/profile/edit/:id',authMiddleware,uploadFile.single('image'), validations, usersApiController.update);
// Eliminar perfil de usuario
router.post('/profile/delete/:id',authMiddleware, usersApiController.delete);

// Listar Recmendaciones
router.get('/recommendation/', recommendationApiController.list);
// Formulario de registro de Recomendacion
router.get('/recommendation/register', recommendationApiController.register);
router.post('/recommendation/register', recommendationApiController.create);
// Detalle de la Recomendacion
router.get('/recommendation/detail/:id', recommendationApiController.detail);
// Modificar Status a pendiente
router.post('/recommendation/updatePresentar/:id', recommendationApiController.updatePresentar);
// Modificar Status a confirmada
router.post('/recommendation/updateConfirmar/:id', recommendationApiController.updateConfirmar);
// Buscar recomendación por código
router.get('/recommendation/find/:code', recommendationApiController.findByCode);

//Buscar recomendaciones por usuario
router.get('/:id/recommendation', recommendationApiController.findByUser);

module.exports = router;
