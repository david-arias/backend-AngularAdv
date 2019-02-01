
// Requires
var express = require('express');
const fileUpload = require('express-fileupload');

var fs = require('fs');

// inicializar variables
var app = express();

// default options
app.use(fileUpload());

// models
var Usuario = require('../models/usuario');
var Company = require('../models/company');
var Movie = require('../models/movie');

// ================================================
// GET 
// ================================================
app.get('/', ( req, res, next ) => {

     res.status(200).json({
          ok: true,
          mssg: "Petición realizada correctamente"
     })

} )

// ================================================
// GET all companies
// ================================================
app.put('/:kind/:id', ( req, res, next) => {

     var kind =req.params.kind;
     var id =req.params.id;

     // valid collection types
     var validKinds = ['companies', 'movieBacks', 'moviePoster', 'users'];
     if ( validKinds.indexOf( kind ) < 0 ) {
          return res.status(400).json({
               ok: false,
               mssg: "Tipo de collección no valida",
               errors: { mssg: 'Las colecciones validas son: ' + validKinds.join(', ') }
          })
     }


     if ( !req.files ) {
          return res.status(400).json({
               ok: false,
               mssg: "no se encuentran archivos",
               errors: { mssg: 'debe seleccionar archivos' }
          })
     }

     // get file name
     var file = req.files.imagen;
     var fileNameSplit = file.name.split('.');
     var fileExt = fileNameSplit[ fileNameSplit.length -1 ];

     // file valid extention
     var validExt = ['png', 'jpg', 'gif', 'jpeg'];

     if ( validExt.indexOf( fileExt ) < 0 ) {
          return res.status(400).json({
               ok: false,
               mssg: "Extención no válida",
               errors: { mssg: 'Las extenciones validas son: ' + validExt.join(', ') }
          })
     }

     // custom file name
     var newFileName = `${id}-${ new Date().getMilliseconds() }.${fileExt}`;

     // move file from TEM to PATH
     var path = `./uploads/${kind}/${newFileName}`;

     file.mv( path, ( err ) => {
          if ( err ) {
               return res.status(500).json({
                    ok: false,
                    mssg: "Error al mover archivo",
                    errors: { mssg: 'Error al mover archivo' + err }
               })
          }

          uploadByKind( kind, id, newFileName, res );
          
     })
     


})

function uploadByKind( kind, id, fileName, res ) {

     if ( kind === 'users') {
          Usuario.findById( id, (err,user) => {
               
               if ( !user ) {
                    return res.status(400).json({
                         ok: false,
                         mensaje: 'Usuario no existe',
                         error: { mssg: 'Usuario no existe'}
                    })
               }

               var oldPath = './uploads/users/' + user.img;

               // if exist : delete file
               if ( fs.existsSync(oldPath) ) {
                    fs.unlink(oldPath, (err) => {
                         if ( err ) {
                              return res.status(500).json({
                                   ok: false,
                                   mssg: "Error al actualizar usuario",
                                   error: { mssg: "error" + err}
                              })
                         }
                    });
               }

               user.img = fileName;
               user.save( (err, updatedUser ) => {
                    if ( err ) {
                         return res.status(500).json({
                              ok: false,
                              mssg: "Error al actualizar usuario",
                              error: { mssg: "error" + err}
                         })
                    }

                    updatedUser.userPsswrd = ':D';

                    return res.status(200).json({
                         ok: true,
                         mssg: 'Imagen de usuario actualizado',
                         user: updatedUser
                    })

               })
          })
     }
     if ( kind === 'companies') {
          Company.findById( id, (err,comp) => {

               if ( !comp ) {
                    return res.status(400).json({
                         ok: false,
                         mensaje: 'Productora no existe',
                         error: { mssg: 'Productora no existe'}
                    })
               }

               var oldPath = './uploads/companies/' + comp.compLogoImg;

               // if exist : delete file
               if ( fs.existsSync(oldPath) ) {
                    fs.unlink(oldPath, (err) => {
                         if ( err ) {
                              return res.status(500).json({
                                   ok: false,
                                   mssg: "Error al actualizar Productora",
                                   error: { mssg: "error" + err}
                              })
                         }
                    });
               }

               comp.compLogoImg = fileName;
               comp.save( (err, updatedComp ) => {
                    if ( err ) {
                         return res.status(500).json({
                              ok: false,
                              mssg: "Error al actualizar productora",
                              error: { mssg: "error" + err}
                         })
                    }

                    return res.status(200).json({
                         ok: true,
                         mssg: 'Imagen de productora actualizado',
                         company: updatedComp
                    })

               })
          })
     }
     if ( kind === 'movieBacks') {
          Movie.findById( id, (err, movie) => {

               if ( !movie ) {
                    return res.status(400).json({
                         ok: false,
                         mensaje: 'Pelicula no existe',
                         error: { mssg: 'Pelicula no existe'}
                    })
               }

               var oldPath = './uploads/movieBacks/' + movie.movieBackdrop;

               // if exist : delete file
               if ( fs.existsSync(oldPath) ) {
                    fs.unlink(oldPath, (err) => {
                         if ( err ) {
                              return res.status(500).json({
                                   ok: false,
                                   mssg: "Error al actualizar Productora",
                                   error: { mssg: "error" + err}
                              })
                         }
                    });
               }

               movie.movieBackdrop = fileName;
               movie.save( (err, updatedMovie ) => {
                    if ( err ) {
                         return res.status(500).json({
                              ok: false,
                              mssg: "Error al actualizar pelicula",
                              error: { mssg: "error" + err}
                         })
                    }

                    return res.status(200).json({
                         ok: true,
                         mssg: 'Imagen de pelicula actualizado',
                         movie: updatedMovie
                    })

               })
          })
     }
     if ( kind === 'moviePoster') {
          Movie.findById( id, (err, movie) => {

               if ( !movie ) {
                    return res.status(400).json({
                         ok: false,
                         mensaje: 'Pelicula no existe',
                         error: { mssg: 'Pelicula no existe'}
                    })
               }

               var oldPath = './uploads/moviePoster/' + movie.moviePoster;

               // if exist : delete file
               if ( fs.existsSync(oldPath) ) {
                    fs.unlink(oldPath, (err) => {
                         if ( err ) {
                              return res.status(500).json({
                                   ok: false,
                                   mssg: "Error al actualizar Productora",
                                   error: { mssg: "error" + err}
                              })
                         }
                    });
               }

               movie.moviePoster = fileName;
               movie.save( (err, updatedMovie ) => {
                    if ( err ) {
                         return res.status(500).json({
                              ok: false,
                              mssg: "Error al actualizar pelicula",
                              error: { mssg: "error" + err}
                         })
                    }

                    return res.status(200).json({
                         ok: true,
                         mssg: 'Imagen de pelicula actualizado',
                         movie: updatedMovie
                    })

               })
          })
     }
}





module.exports = app;