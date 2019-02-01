
// Requires
var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// inicializar variables
var app = express();

// modelos
var Usuario = require('../models/usuario')

// google oauth
var CLIENT_ID = require('../config/config').CLIENT_ID;

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ================================================
// POST login authentication
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
               menu: getUsrMenu( userDb.role ),
          })

     } )



})

// ================================================
// GET Google authentication
// ================================================
async function verify( token ) {
     const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
     });
     const payload = ticket.getPayload();
     // const userid = payload['sub'];

     // If request specified a G Suite domain:
     //const domain = payload['hd'];
     return {
          userName: payload.name,
          userMail: payload.email,
          img: payload.picture,
          google: true,
     }
}

app.post('/google', async ( req, res, next ) => {

     var token = req.body.token;

     if ( !token ) {
          return res.status( 403 ).json({
               ok: false,
               mssg: "es requerido un token"
          })
     }

     var googleUser = await verify( token )
          .catch( e => {
               return res.status( 403 ).json({
                    ok: false,
                    mssg: "Token no valido"
               })
          })

     Usuario.findOne( { userMail: googleUser.email}, (err, userDb ) => {
          if ( err ) {
               return res.status( 500 ).json({
                    ok: false,
                    mssg: "Error en base de datos | Error al buscar usuario",
                    errors: err
               })
          }

          if ( userDb ) {
               if ( userDb.google === false ) {
                    return res.status( 400 ).json({
                         ok: false,
                         mssg: "Debe usar la autenticacion normal"
                    })
               } else {
                    var token = jwt.sign({ user: userDb }, SEED, {expiresIn: 14400}) // 4 horas

                    res.status(200).json({
                         ok: true,
                         usuario: userDb,
                         token: token,
                         id: userDb._id,
                         menu: getUsrMenu( userDb.role ),
                    })
               }
          } else {
               // user no exist
               var user = new Usuario();

               user.userName = googleUser.userName;
               user.userMail = googleUser.userMail;
               user.img = googleUser.img;
               user.google = true;
               user.userPsswrd = ':)';

               user.save( (err, userDb) => {

                    var token = jwt.sign({ user: userDb }, SEED, {expiresIn: 14400}) // 4 horas

                    res.status(200).json({
                         ok: true,
                         usuario: user,
                         token: token,
                         menu: getUsrMenu( user.role ),
                         // id: userDb._id,
                    })


               })
          }
     } )

} )


// ================================================
// GET MENU 
// ================================================
function getUsrMenu( role ) {

     menu = [
          {
               titulo: 'Personal',
               menu: [
                    {
                         titulo: 'Dashboard',
                         icon: 'fas fa-tachometer-alt ',
                         url: '#',
                         submenu: [
                              {
                                   titulo: 'Dashboard',
                                   icon: 'fas fa-tachometer-alt ',
                                   url: '/dashboard',
                              }
                         ]
                    }
               ]
          },
          {
               titulo: null,
               menu: [
                    {
                         titulo: 'Mantenimiento',
                         icon: 'fas fa-toolbox',
                         url: '#',
                         submenu: [
                         
                         ]
                    }
               ]
          },
          {
               titulo: null,
               menu: [
                    {
                         titulo: 'Temporal',
                         icon: 'far fa-clock',
                         url: '#',
                         submenu: [
                              {
                                   titulo: 'Promesas',
                                   icon: 'fas fa-stopwatch',
                                   url: '/promesas',
                              }, {
                                   titulo: 'RxJs',
                                   icon: 'fas fa-stopwatch',
                                   url: '/rxjs',
                              }
                         ]
                    }
               ]
          }
     ]

     if ( role === 'ADMIN_ROLE' ) {
          menu[1]['menu'][0].submenu.unshift(
               {
                    titulo: 'Usuarios',
                    icon: 'fas fa-users-cog',
                    url: '/user-config',
               },
               {
                    titulo: 'Productoras',
                    icon: 'fas fa-video',
                    url: '/prods-config',
               },
               {
                    titulo: 'Peliculas',
                    icon: 'fas fa-film',
                    url: '/movies-config',
               },
          )
     }

     return menu;

}




// ================================================

module.exports = app;