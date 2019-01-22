
// Requires
var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// inicializar variables
var app = express();

// modelos
var Usuario = require('../models/usuario')

// ================================================
// GET all users
// ================================================
app.post('/', ( req,res ) => {

     var body = req.body;

     Usuario.findOne( {userMail: body.userMail }, (err, userDb) => {

          if ( err ) {
               return res.status( 500 ).json({
                    ok: false,
                    mssg: "Error en base de datos | Error al buscar usuario",
                    errors: err
               })
          }
          if ( !userDb ) {
               return res.status( 400 ).json({
                    ok: false,
                    mssg: "Error en base de datos | credenciales incorrectas - email",
                    errors: err
               })
          }

          if ( !bcrypt.compareSync( body.userPsswrd, userDb.userPsswrd) ) {
               return res.status( 400 ).json({
                    ok: false,
                    mssg: "Error en base de datos | credenciales incorrectas - psswrd",
                    errors: err
               })
          }

          // crear un token
          userDb.userPsswrd = ';)';

          var token = jwt.sign({ user: userDb }, SEED, {expiresIn: 14400}) // 4 horas

          res.status(200).json({
               ok: true,
               usuario: userDb,
               token: token,
               id: userDb._id,
          })

     } )



})




// ================================================

module.exports = app;