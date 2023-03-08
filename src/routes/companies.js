var express = require('express');
var router = express.Router();
const path =require('path');
const companiesController=require('../controllers/companiesController');

const authMiddleware = require('../middlewares/authMiddleware');

// Requiero Multer para recibir la imagen del perfil de usuario y lo configuro
const multer=require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, '../../public/images/logos');
  },
  filename: function(req,file,cb){
    
    cb(null, `${Date.now()}_img${path.extname(file.originalname)}`);

  }
})
const  uploadFile = multer ({storage});

//Requiero Express_valdator para validar los datos que vienen del formulario y cnfiguro las validaciones que debe realizar

const { body }=require ('express-validator');
const validations=[
  body('name').notEmpty().withMessage('Tienes que escribir un Nombre de empresa'),
  body('areas_id').notEmpty().withMessage('Tienes que escribir un rubro'),
  body('description').notEmpty().withMessage('Tienes que escribir una breve descripcion'),
  body('pricePoint')
          .notEmpty().withMessage('Tienes que escribir un precio').bail()
          .isNumeric().withMessage('Tienes que escribir valor numérico del precio'),
  body('image').custom((value, {req}) =>{
    let file = req.file;
    let acceptedExtensions=['.jpg','.png','.gif','.webp']
    
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



// Lista de Empresas
router.get('/', authMiddleware, companiesController.list);
// Formulario de registro de Empresa
router.get('/register',authMiddleware, companiesController.register);
//Procesar el registro
router.post('/register', uploadFile.single('image'), validations, companiesController.processRegister);

// Perfil de Empresa
router.get('/profile/:idCompany', authMiddleware, companiesController.profile);
// Editar Perfil de Empresa
router.get('/profile/edit/:id',authMiddleware, companiesController.edit);
router.post('/profile/edit/:id',authMiddleware,uploadFile.single('image'), validations, companiesController.update);
// Eliminar perfil de Empresa
router.post('/profile/delete/:id',authMiddleware, companiesController.delete);


//Rutas de los productos de cada Empresa
// Lista de Productos
router.get('/:idCompany/products', authMiddleware, companiesController.list);


module.exports = router;
