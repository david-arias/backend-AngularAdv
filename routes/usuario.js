
// Requires
var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

// inicializar variables
var app = express();

// modelos
var Usuario = require('../models/usuario')

// ================================================
// GET all users
// ================================================
app.get('/', ( req, res, next ) => {

     Usuario.find({}, 'userName userMail img role').exec(

          (err, users) => {
     
               if ( err ) {
                    return res.status(500).json({
                         ok: false,
                         mssg: "Error en base de datos | carga de usuarios",
                         errors: err
                    })
               }
     
               res.status(200).json({
                    ok: true,
                    mssg: "Usuarios cargados",
                    users: users,
               })
          }
     )
} )


// ================================================
// PUT update user
// ================================================
app.put( '/:id', mdAutenticacion.verifyToken , ( req, res ) => {

     var id = req.params.id;
     var body = req.body;

     Usuario.findById( id, ( err, user ) => {

          if ( err ) {
               return res.status(500).json({
                    ok: false,
                    mssg: "Error en base de datos | error al buscar usuario",
                    errors: err
               })
          }
          if ( !user ) {
               return res.status(400).json({
                    ok: false,
                    mssg: "Error en base de datos | usuario no existe",
                    errors: { message: 'No existe un usuario con el ID: ' + id }
               })
          }

          user.userName = body.userName;
          user.userMail = body.userMail;
          user.role = body.role;

          user.save( (err, userSaved ) => {

               if ( err ) {
                    return res.status(400).json({
                         ok: false,
                         mssg: "Error en base de datos | No es posible actualizar usuario",
                         errors: err
                    })
               }

               userSaved.userPsswrd = ';)';

               res.status(200).json({
                    ok: true,
                    user: userSaved
               });

          } );

     } );

})

// ================================================
// POST new user
// ================================================
app.post('/', mdAutenticacion.verifyToken, ( req, res ) => {

     var body = req.body;

     var user = new Usuario({
          userName: body.userName,
          userMail: body.userMail,
          userPsswrd: bcrypt.hashSync( body.userPsswrd, 10 ),
          img: body.img,
          role: body.role
     });

     user.save( ( err, saveUser ) => {
          if ( err ) {
               return res.status(400).json({
                    ok: false,
                    mssg: "Error en base de datos | Creación de usuario",
                    errors: err
               })
          }
          
          res.status(201).json({
               ok: true,
               user: saveUser,
               adminUser: req.user
          })
     } )

});

// ================================================
// DELETE delete by id user
// ================================================
app.delete( '/:id', mdAutenticacion.verifyToken , ( req,res ) => {
     var id = req.params.id;

     Usuario.findByIdAndRemove( id, ( err, userDeleted ) => {

          if ( err ) {
               return res.status(500).json({
                    ok: false,
                    mssg: "Error en base de datos | No es posible borrar usuario",
                    errors: err
               })
          }
          if ( !userDeleted ) {
               return res.status(400).json({
                    ok: false,
                    mssg: "Error en base de datos | No existe usuario",
                    errors: { message: 'no existe usuario con ese ID' }
               })
          }

          res.status(200).json({
               ok: true,
               user: userDeleted
          });

     })
})





// ================================================

module.exports = app;