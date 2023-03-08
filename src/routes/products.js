var express = require('express');
var router = express.Router();
const path =require('path');
const productsController=require('../controllers/productsController');


// Requiero Multer para recibir la imagen del perfil de usuario y lo configuro
const multer=require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, '../public/images/products');
  },
  filename: function(req,file,cb){
    
    cb(null, `${Date.now()}_img${path.extname(file.originalname)}`);

  }
})
const  uploadFile = multer ({storage});

//Requiero Express_valdator para validar los datos que vienen del formulario y cnfiguro las validaciones que debe realizar

const { body }=require ('express-validator');
const validations=[
    body('name').notEmpty().withMessage('Tienes que escribir un Nombre de producto'),
    body('description').notEmpty().withMessage('Tienes que escribir una desripcion'),
    body('category').notEmpty().withMessage('Tienes que escribir una categoria'),
    body('price')
          .notEmpty().withMessage('Tienes que escribir un precio').bail()
          .isNumeric().withMessage('Tienes que escribir valor numérico del precio'),
    body('points')
          .notEmpty().withMessage('Tienes que escribir una cantidad de puntos para que se cajee ese producto').bail()
          .isNumeric().withMessage('Tienes que escribir valor numérico de puntos'),
  body('image').custom((value, {req}) =>{
    let file = req.file;
    let acceptedExtensions=['.jpg','png','gif']
    
    if (!file) {
      throw new Error('Tienes que subir una imagen')
    } else {
      let fileExtension = path.extname(file.originalname)
        if (!acceptedExtensions.includes(fileExtension)) {
        throw new Error('Tienes que subir una imagen en formato válido .jpg, .png, .gif')
        } 
    }
    
      
    return true;
  })
]


/* GET companies listing. */
// Lista de Empresas
router.get('/', productsController.list);
// Formulario de registro de Empresa
router.get('/register', productsController.register);
//Procesar el registro
router.post('/register', uploadFile.single('image'), validations, productsController.processRegister);

// Perfil de Empresa
router.get('/:id', productsController.edit);


module.exports = router;
