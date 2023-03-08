const { validationResult }=require ('express-validator')
const db= require('../database/models');

const controller = {
    list: (req,res) => {
        console.log(req.params.id)
        // db.Products.findAll()
        // .then (function(products) {
        //    res.render('productsList' , {products})
        // })
        // .catch (function(e){
        //    console.log(e)
        // })
    }, 
    register: (req,res) => {
        console.log(req.params.id)
        // db.Company.findAll()
        // .then(function (empresas) {
        //     return res.render('companyRegister', { areas })
        // })
        // .catch(function (e) {
        //     console.log(e)
        // })
    }, 
    processRegister: (req,res) => {
        const resultValidation = validationResult(req);
       console.log(resultValidation.errors)
        if(resultValidation.errors.length > 0) {
            //debería analizar cada uno de los errores cargando en una variable
            // errors:resultValidation.mapped(), esta última función me convierte
            // el array en un objeto literal, para luego trabajarlo más comodo
            return res.send('se registró algún error en los datos recibidos del formulario de Registro de usuario')
        }
        return res.send('Ok, se pasaron las validaciones perfectamente')
        
    }, 
    
    edit:(req,res) => {
        return res.send('este es el formulario para editar un producto')
    },
}

module.exports = controller